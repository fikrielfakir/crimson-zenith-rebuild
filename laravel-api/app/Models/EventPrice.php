<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventPrice extends Model
{
    public $timestamps = false;
    protected $fillable = ['event_id', 'travelers', 'price_per_person'];
    protected $casts = ['price_per_person' => 'float'];
    public function event() { return $this->belongsTo(BookingEvent::class, 'event_id'); }
}
