<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventTranslation extends Model
{
    protected $table = 'event_translations';

    protected $fillable = [
        'event_id',
        'locale',
        'title',
        'description',
        'location',
        'location_details',
        'highlights',
        'included',
        'not_included',
        'important_info',
    ];

    protected $casts = [
        'highlights'   => 'array',
        'included'     => 'array',
        'not_included' => 'array',
    ];

    public function event()
    {
        return $this->belongsTo(BookingEvent::class, 'event_id');
    }
}
