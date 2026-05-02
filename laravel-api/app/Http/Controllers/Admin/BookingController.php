<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BookingTicket;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $query = BookingTicket::with('event');
        if ($request->has('status'))  $query->where('status', $request->status);
        if ($request->has('eventId')) $query->where('event_id', $request->eventId);
        if ($request->has('search')) {
            $s = $request->search;
            $query->where(fn($q) => $q
                ->where('customer_name', 'like', "%$s%")
                ->orWhere('customer_email', 'like', "%$s%")
                ->orWhere('booking_reference', 'like', "%$s%")
            );
        }
        $page  = max(1, (int)($request->page ?? 1));
        $limit = max(1, min(100, (int)($request->limit ?? 20)));
        $total = $query->count();
        $tickets = $query->orderBy('created_at', 'desc')
            ->skip(($page - 1) * $limit)
            ->take($limit)
            ->get()
            ->map(fn($t) => [
                'id'               => $t->id,
                'bookingReference' => $t->booking_reference,
                'eventTitle'       => $t->event?->title ?? 'N/A',
                'userName'         => $t->customer_name,
                'userEmail'        => $t->customer_email,
                'eventDate'        => $t->event?->start_date,
                'attendees'        => $t->quantity ?? 1,
                'totalAmount'      => $t->total_price,
                'status'           => $t->status,
                'ticketNumber'     => $t->ticket_number,
                'createdAt'        => $t->created_at,
            ]);

        return response()->json([
            'bookings' => $tickets,
            'total'    => $total,
            'page'     => $page,
            'limit'    => $limit,
        ]);
    }

    public function showByRef($ref)
    {
        $ticket = BookingTicket::where('booking_reference', $ref)->with('event')->firstOrFail();
        return response()->json($ticket);
    }

    public function updateStatus(Request $request, $identifier)
    {
        $request->validate(['status' => 'required|in:pending,confirmed,cancelled,completed']);

        // Support both numeric ID and booking reference string
        if (is_numeric($identifier)) {
            $ticket = BookingTicket::findOrFail($identifier);
        } else {
            $ticket = BookingTicket::where('booking_reference', $identifier)->firstOrFail();
        }

        $update = ['status' => $request->status, 'payment_status' => $request->status];
        if ($request->status === 'confirmed') $update['confirmed_at'] = now();
        if ($request->status === 'cancelled')  $update['cancelled_at']  = now();
        $ticket->update($update);

        return response()->json($ticket->fresh()->load('event'));
    }

    public function destroy($identifier)
    {
        if (is_numeric($identifier)) {
            $ticket = BookingTicket::findOrFail($identifier);
        } else {
            $ticket = BookingTicket::where('booking_reference', $identifier)->firstOrFail();
        }
        $ticket->delete();
        return response()->json(['message' => 'Booking deleted']);
    }
}
