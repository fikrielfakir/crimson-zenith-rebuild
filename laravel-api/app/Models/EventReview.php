<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventReview extends Model
{
    public $timestamps = false;
    protected $fillable = ['event_id', 'user_name', 'rating', 'review'];
    public function event() { return $this->belongsTo(BookingEvent::class, 'event_id'); }
}
