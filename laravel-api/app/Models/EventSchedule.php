<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventSchedule extends Model
{
    public $timestamps = false;
    protected $fillable = ['event_id', 'day_number', 'title', 'description'];
    public function event() { return $this->belongsTo(BookingEvent::class, 'event_id'); }
}
