<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventParticipant extends Model
{
    public $timestamps = false;
    protected $fillable = ['event_id', 'user_id', 'registered_at', 'attended'];
    protected $casts = ['attended' => 'boolean', 'registered_at' => 'datetime'];
    public function event() { return $this->belongsTo(BookingEvent::class, 'event_id'); }
    public function user()  { return $this->belongsTo(User::class, 'user_id'); }
}
