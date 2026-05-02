<?php

namespace App\Services;

use App\Models\BookingTicket;
use App\Models\BookingEvent;
use Illuminate\Support\Str;

class BookingService
{
    public function createTicket(array $data, ?string $userId): BookingTicket
    {
        $ref = 'TJ-' . strtoupper(Str::random(8));

        $ticket = BookingTicket::create([
            'id'                    => Str::uuid(),
            'booking_reference'     => $ref,
            'event_id'              => $data['eventId'],
            'user_id'               => $userId ?? 'guest',
            'customer_name'         => $data['customerName'],
            'customer_email'        => $data['customerEmail'],
            'customer_phone'        => $data['customerPhone'] ?? null,
            'number_of_participants'=> $data['numberOfParticipants'],
            'event_date'            => $data['eventDate'],
            'total_price'           => $data['totalPrice'],
            'payment_status'        => 'pending',
            'payment_method'        => $data['paymentMethod'] ?? null,
            'transaction_id'        => $data['transactionId'] ?? null,
            'special_requests'      => $data['specialRequests'] ?? null,
            'status'                => 'pending',
        ]);

        // Increment participant count on the event
        BookingEvent::where('id', $data['eventId'])->increment('current_participants', $data['numberOfParticipants']);

        return $ticket->load('event');
    }
}
