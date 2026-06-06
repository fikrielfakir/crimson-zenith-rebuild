<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BookingTicket;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    // ------------------------------------------------------------------ //
    // Helpers
    // ------------------------------------------------------------------ //

    private function mapOutput(BookingTicket $t): array
    {
        return [
            'id'                   => $t->id,
            'bookingReference'     => $t->booking_reference,
            'eventId'              => $t->event_id,
            'eventTitle'           => $t->event?->title ?? 'N/A',
            'eventDate'            => $t->event?->start_date,
            'userName'             => $t->customer_name,
            'userEmail'            => $t->customer_email,
            'customerPhone'        => $t->customer_phone,
            'numberOfParticipants' => $t->number_of_participants ?? 1,
            'attendees'            => $t->number_of_participants ?? 1,
            'totalAmount'          => $t->total_price,
            'paymentStatus'        => $t->payment_status,
            'paymentMethod'        => $t->payment_method,
            'transactionId'        => $t->transaction_id,
            'specialRequests'      => $t->special_requests,
            'status'               => $t->status,
            'confirmedAt'          => $t->confirmed_at,
            'cancelledAt'          => $t->cancelled_at,
            'cancellationReason'   => $t->cancellation_reason,
            'createdAt'            => $t->created_at,
            'updatedAt'            => $t->updated_at,
        ];
    }

    // ------------------------------------------------------------------ //
    // CRUD
    // ------------------------------------------------------------------ //

    public function index(Request $request)
    {
        $query = BookingTicket::with('event');

        if ($request->filled('status'))  $query->where('status', $request->status);
        if ($request->filled('eventId')) $query->where('event_id', $request->eventId);

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(fn($q) => $q
                ->where('customer_name', 'like', "%$s%")
                ->orWhere('customer_email', 'like', "%$s%")
                ->orWhere('booking_reference', 'like', "%$s%")
            );
        }

        $page  = max(1, (int) ($request->page  ?? 1));
        $limit = max(1, min(100, (int) ($request->limit ?? 20)));
        $total = $query->count();

        $tickets = $query->orderBy('created_at', 'desc')
            ->skip(($page - 1) * $limit)
            ->take($limit)
            ->get()
            ->map(fn($t) => $this->mapOutput($t));

        return response()->json([
            'bookings' => $tickets,
            'total'    => $total,
            'page'     => $page,
            'limit'    => $limit,
        ]);
    }

    public function showByRef($ref)
    {
        $ticket = BookingTicket::where('booking_reference', $ref)
            ->with('event')
            ->firstOrFail();

        return response()->json($this->mapOutput($ticket));
    }

    public function updateStatus(Request $request, $identifier)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled,completed',
        ]);

        $ticket = is_numeric($identifier)
            ? BookingTicket::findOrFail($identifier)
            : BookingTicket::where('booking_reference', $identifier)->firstOrFail();

        $update = [
            'status'         => $request->status,
            'payment_status' => $request->status,
        ];

        if ($request->status === 'confirmed') $update['confirmed_at'] = now();
        if ($request->status === 'cancelled')  $update['cancelled_at']  = now();

        $ticket->update($update);

        return response()->json($this->mapOutput($ticket->fresh()->load('event')));
    }

    public function destroy($identifier)
    {
        $ticket = is_numeric($identifier)
            ? BookingTicket::findOrFail($identifier)
            : BookingTicket::where('booking_reference', $identifier)->firstOrFail();

        $ticket->delete();
        return response()->json(['message' => 'Booking deleted']);
    }
}
