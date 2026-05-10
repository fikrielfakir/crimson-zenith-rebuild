<?php

namespace App\Http\Controllers;

use App\Models\BookingEvent;
use App\Models\BookingTicket;
use App\Services\BookingService;
use Illuminate\Http\Request;

class BookingTicketController extends Controller
{
    public function __construct(private BookingService $bookingService) {}

    public function store(Request $request)
    {
        $data = $request->validate([
            'eventId'              => 'required|string',
            'customerName'         => 'required|string',
            'customerEmail'        => 'required|email',
            'customerPhone'        => 'nullable|string',
            'numberOfParticipants' => 'required|integer|min:1',
            'eventDate'            => 'required',
            'totalPrice'           => 'required|numeric',
            'paymentMethod'        => 'nullable|string',
            'transactionId'        => 'nullable|string',
            'specialRequests'      => 'nullable|string',
        ]);

        $ticket = $this->bookingService->createTicket($data, $request->user()?->id);
        $ticket->load('event');
        return response()->json(['ticket' => $this->formatTicket($ticket)], 201);
    }

    public function show($ref)
    {
        $ticket = BookingTicket::where('booking_reference', $ref)->with('event')->firstOrFail();
        return response()->json($this->formatTicket($ticket));
    }

    public function checkEvent($eventId)
    {
        $event = BookingEvent::where('id', $eventId)->where('is_active', true)->first();
        if (!$event) return response()->json(['available' => false, 'message' => 'Event not found'], 404);
        $spotsLeft = $event->max_participants ? max(0, $event->max_participants - $event->current_participants) : null;
        return response()->json(['available' => true, 'event' => $event, 'spotsLeft' => $spotsLeft]);
    }

    public function myTickets(Request $request)
    {
        $user = $request->user();
        $tickets = BookingTicket::where(function ($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->orWhere('customer_email', $user->email);
            })
            ->with('event')
            ->orderBy('created_at', 'desc')
            ->get()
            ->unique('id')
            ->values();
        return response()->json($tickets->map(fn($t) => $this->formatTicket($t)));
    }

    public function cancel(Request $request, $id)
    {
        $ticket = BookingTicket::findOrFail($id);
        if ($ticket->user_id !== $request->user()->id) return response()->json(['message' => 'Forbidden'], 403);
        $ticket->update(['status' => 'cancelled', 'cancelled_at' => now(), 'cancellation_reason' => $request->reason]);
        return response()->json(['message' => 'Booking cancelled', 'ticket' => $this->formatTicket($ticket->fresh())]);
    }

    public function cancelByRef(Request $request, $ref)
    {
        $ticket = BookingTicket::where('booking_reference', $ref)->firstOrFail();
        if ($ticket->user_id !== $request->user()->id) return response()->json(['message' => 'Forbidden'], 403);
        $ticket->update(['status' => 'cancelled', 'cancelled_at' => now(), 'cancellation_reason' => $request->reason]);
        return response()->json(['message' => 'Booking cancelled', 'ticket' => $this->formatTicket($ticket->fresh())]);
    }

    public function updateByRef(Request $request, $ref)
    {
        $ticket = BookingTicket::where('booking_reference', $ref)->firstOrFail();
        if ($ticket->user_id !== $request->user()->id) return response()->json(['message' => 'Forbidden'], 403);
        $allowed = ['special_requests', 'customer_phone', 'number_of_participants'];
        $ticket->update($request->only($allowed));
        return response()->json(['message' => 'Booking updated', 'ticket' => $this->formatTicket($ticket->fresh())]);
    }

    private function formatTicket(BookingTicket $t): array
    {
        return [
            'id'                   => $t->id,
            'bookingReference'     => $t->booking_reference,
            'eventId'              => $t->event_id,
            'customerName'         => $t->customer_name,
            'customerEmail'        => $t->customer_email,
            'customerPhone'        => $t->customer_phone,
            'numberOfParticipants' => $t->number_of_participants,
            'eventDate'            => $t->event_date,
            'totalPrice'           => $t->total_price,
            'paymentStatus'        => $t->payment_status,
            'paymentMethod'        => $t->payment_method,
            'status'               => $t->status,
            'confirmedAt'          => $t->confirmed_at,
            'cancelledAt'          => $t->cancelled_at,
            'createdAt'            => $t->created_at,
            'event'                => $t->relationLoaded('event') ? $t->event : null,
        ];
    }
}
