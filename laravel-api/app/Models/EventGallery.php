<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventGallery extends Model
{
    public $timestamps = false;
    protected $fillable = ['event_id', 'image_url', 'sort_order'];
    public function event() { return $this->belongsTo(BookingEvent::class, 'event_id'); }
}
