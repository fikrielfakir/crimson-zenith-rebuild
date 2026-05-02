<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingTicket extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'booking_reference', 'event_id', 'user_id', 'customer_name',
        'customer_email', 'customer_phone', 'number_of_participants',
        'event_date', 'total_price', 'payment_status', 'payment_method',
        'transaction_id', 'special_requests', 'status',
        'confirmed_at', 'cancelled_at', 'cancellation_reason',
    ];

    protected $casts = [
        'event_date'   => 'datetime',
        'confirmed_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'total_price'  => 'float',
    ];

    public function event()
    {
        return $this->belongsTo(BookingEvent::class, 'event_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
