<?php

namespace App\Services;

use App\Mail\BookingConfirmed;
use App\Models\BookingTicket;
use App\Models\BookingEvent;
use Illuminate\Support\Str;

class BookingService
{
    public function __construct(private SmtpMailService $mailer) {}

    public function createTicket(array $data, ?string $userId): BookingTicket
    {
        $ref = 'TJ-' . strtoupper(Str::random(8));

        $ticket = BookingTicket::create([
            'id'                     => Str::uuid(),
            'booking_reference'      => $ref,
            'event_id'               => $data['eventId'],
            'user_id'                => $userId ?? 'guest',
            'customer_name'          => $data['customerName'],
            'customer_email'         => $data['customerEmail'],
            'customer_phone'         => $data['customerPhone'] ?? null,
            'number_of_participants' => $data['numberOfParticipants'],
            'event_date'             => $data['eventDate'],
            'total_price'            => $data['totalPrice'],
            'payment_status'         => 'pending',
            'payment_method'         => $data['paymentMethod'] ?? null,
            'transaction_id'         => $data['transactionId'] ?? null,
            'special_requests'       => $data['specialRequests'] ?? null,
            'status'                 => 'pending',
        ]);

        BookingEvent::where('id', $data['eventId'])->increment('current_participants', $data['numberOfParticipants']);

        $ticket->load('event');

        try {
            $this->mailer->send($ticket->customer_email, new BookingConfirmed($ticket));
        } catch (\Throwable $e) {
            \Log::warning('Booking confirmation email failed: ' . $e->getMessage());
        }

        return $ticket;
    }
}
