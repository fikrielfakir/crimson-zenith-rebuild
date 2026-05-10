<?php

namespace App\Http\Controllers;

use App\Models\BookingTicket;
use App\Models\PaymentSettings;
use App\Services\BookingService;
use App\Services\CmiPaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public function __construct(
        private BookingService    $bookingService,
        private CmiPaymentService $cmiService,
    ) {}

    // -------------------------------------------------------------------------
    // Stripe (legacy – kept for compatibility)
    // -------------------------------------------------------------------------
    public function createPaymentIntent(Request $request)
    {
        $request->validate(['amount' => 'required|numeric|min:1', 'currency' => 'nullable|string']);

        $settings = PaymentSettings::firstOrCreate(['id' => 'default']);
        $secretKey = $settings->stripe_secret_key ?: env('STRIPE_SECRET_KEY');

        if (!$secretKey) {
            return response()->json(['message' => 'Stripe not configured'], 503);
        }

        \Stripe\Stripe::setApiKey($secretKey);
        $intent = \Stripe\PaymentIntent::create([
            'amount'   => (int) ($request->amount * 100),
            'currency' => $request->currency ?? 'mad',
        ]);

        return response()->json(['clientSecret' => $intent->client_secret]);
    }

    public function createPaypalOrder(Request $request)
    {
        return response()->json(['message' => 'PayPal integration pending configuration'], 503);
    }

    // -------------------------------------------------------------------------
    // CMI – initiate
    // -------------------------------------------------------------------------
    public function initiateCmiPayment(Request $request)
    {
        $validated = $request->validate([
            'eventId'              => 'required|string',
            'customerName'         => 'required|string',
            'customerEmail'        => 'required|email',
            'customerPhone'        => 'nullable|string',
            'numberOfParticipants' => 'required|integer|min:1',
            'eventDate'            => 'required',
            'totalPrice'           => 'required|numeric|min:0',
            'specialRequests'      => 'nullable|string',
            'cin'                  => 'nullable|string',
            'cne'                  => 'nullable|string',
            'dateOfBirth'          => 'nullable|string',
            'address'              => 'nullable|string',
            'isAssociationEvent'   => 'nullable|boolean',
            'participants'         => 'nullable|integer',
        ]);

        if (!$this->cmiService->isEnabled()) {
            return response()->json(['message' => 'CMI payment is not enabled.'], 503);
        }

        $settings = $this->cmiService->getSettings();

        // ── Demo mode: simulate a completed payment without hitting CMI ────────
        if ($settings->demo_mode) {
            $ticket = $this->bookingService->createTicket(array_merge($validated, [
                'paymentMethod'  => 'cmi',
                'transactionId'  => 'DEMO-' . strtoupper(\Illuminate\Support\Str::random(10)),
                'paymentStatus'  => 'completed',
                'status'         => 'accepted',
            ]), $request->user()?->id);

            return response()->json([
                'demo_mode'         => true,
                'booking_reference' => $ticket->booking_reference,
            ]);
        }

        // Create a pending booking ticket first so we have a reference
        $ticket = $this->bookingService->createTicket(array_merge($validated, [
            'paymentMethod'  => 'cmi',
            'transactionId'  => null,
        ]), $request->user()?->id);

        // Determine callback / redirect URLs
        $appUrl    = rtrim(env('APP_FRONTEND_URL', env('APP_URL', 'http://localhost:5000')), '/');
        $apiUrl    = rtrim(env('APP_URL', 'http://localhost:8000'), '/');

        $okUrl     = $settings->cmi_ok_url     ?: $appUrl . '/book/payment/success';
        $failUrl   = $settings->cmi_fail_url   ?: $appUrl . '/book/payment/fail';
        $callbackUrl = $settings->cmi_callback_url ?: $apiUrl . '/api/payments/cmi/callback';

        // Append booking reference to redirect URLs so the frontend can display it
        $okUrl   .= (str_contains($okUrl,   '?') ? '&' : '?') . 'ref=' . $ticket->booking_reference;
        $failUrl .= (str_contains($failUrl, '?') ? '&' : '?') . 'ref=' . $ticket->booking_reference;

        try {
            $form = $this->cmiService->buildPaymentForm([
                'oid'         => $ticket->booking_reference,
                'amount'      => $ticket->total_price,
                'okUrl'       => $okUrl,
                'failUrl'     => $failUrl,
                'callbackUrl' => $callbackUrl,
                'email'       => $ticket->customer_email,
            ]);
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 503);
        }

        return response()->json([
            'gateway_url'      => $form['gateway_url'],
            'fields'           => $form['fields'],
            'booking_reference'=> $ticket->booking_reference,
        ]);
    }

    // -------------------------------------------------------------------------
    // CMI – server-to-server callback (CMI POSTs here)
    // -------------------------------------------------------------------------
    public function cmiCallback(Request $request)
    {
        $postData = $request->all();

        // Verify HMAC signature
        if (!$this->cmiService->verifyCallback($postData)) {
            \Log::warning('CMI callback: invalid HMAC', $postData);
            // CMI expects "ACTION=POSTAUTH" or "FAILURE" text response
            return response('FAILURE', 200)->header('Content-Type', 'text/plain');
        }

        $ref    = $postData['oid'] ?? null;
        $status = strtoupper($postData['ProcReturnCode'] ?? '');

        if ($ref) {
            $ticket = BookingTicket::where('booking_reference', $ref)->first();
            if ($ticket) {
                if ($status === '00') {
                    $ticket->update([
                        'payment_status' => 'completed',
                        'status'         => 'accepted',
                        'transaction_id' => $postData['AuthCode'] ?? $postData['TransId'] ?? null,
                        'confirmed_at'   => now(),
                    ]);
                } else {
                    $ticket->update([
                        'payment_status' => 'failed',
                        'status'         => 'cancelled',
                        'cancelled_at'   => now(),
                        'cancellation_reason' => 'CMI payment failed – code: ' . ($postData['ErrMsg'] ?? $status),
                    ]);
                }
            }
        }

        // CMI expects "ACTION=POSTAUTH" on success to finalise the transaction
        return response($status === '00' ? 'ACTION=POSTAUTH' : 'APPROVED', 200)
            ->header('Content-Type', 'text/plain');
    }

    // -------------------------------------------------------------------------
    // CMI – check payment status by booking reference
    // -------------------------------------------------------------------------
    public function cmiStatus(Request $request, string $ref)
    {
        $ticket = BookingTicket::where('booking_reference', $ref)->with('event')->first();
        if (!$ticket) {
            return response()->json(['message' => 'Booking not found'], 404);
        }

        return response()->json([
            'booking_reference'     => $ticket->booking_reference,
            'payment_status'        => $ticket->payment_status,
            'status'                => $ticket->status,
            'transaction_id'        => $ticket->transaction_id,
            'customer_name'         => $ticket->customer_name,
            'customer_email'        => $ticket->customer_email,
            'customer_phone'        => $ticket->customer_phone,
            'number_of_participants'=> $ticket->number_of_participants,
            'event_date'            => $ticket->event_date,
            'total_price'           => $ticket->total_price,
            'payment_method'        => $ticket->payment_method,
            'event_title'           => $ticket->event?->title ?? 'Event',
            'event_location'        => $ticket->event?->location ?? null,
        ]);
    }

    // -------------------------------------------------------------------------
    // Public: get available payment methods
    // -------------------------------------------------------------------------
    public function availableMethods()
    {
        $settings = PaymentSettings::firstOrCreate(['id' => 'default']);
        return response()->json([
            'cmi_enabled'    => (bool) $settings->cmi_enabled,
            'cash_enabled'   => (bool) $settings->cash_enabled,
            'stripe_enabled' => (bool) $settings->stripe_enabled,
            'cmi_mode'       => $settings->cmi_mode,
        ]);
    }
}
