<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingEvent extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'club_id', 'is_association_event', 'title', 'subtitle',
        'description', 'location', 'location_details', 'latitude', 'longitude',
        'duration', 'start_date', 'end_date', 'event_date', 'price',
        'original_price', 'rating', 'review_count', 'category', 'languages',
        'age_range', 'min_age', 'group_size', 'max_people', 'max_participants',
        'current_participants', 'cancellation_policy', 'images', 'image',
        'highlights', 'included', 'not_included', 'schedule', 'important_info',
        'status', 'is_active', 'created_by',
    ];

    protected $casts = [
        'languages'            => 'array',
        'images'               => 'array',
        'highlights'           => 'array',
        'included'             => 'array',
        'not_included'         => 'array',
        'schedule'             => 'array',
        'is_association_event' => 'boolean',
        'is_active'            => 'boolean',
        'latitude'             => 'float',
        'longitude'            => 'float',
    ];

    public function club()
    {
        return $this->belongsTo(Club::class, 'club_id');
    }

    public function tickets()
    {
        return $this->hasMany(BookingTicket::class, 'event_id');
    }

    public function participants()
    {
        return $this->hasMany(EventParticipant::class, 'event_id');
    }

    public function gallery()
    {
        return $this->hasMany(EventGallery::class, 'event_id');
    }

    public function scheduleItems()
    {
        return $this->hasMany(EventSchedule::class, 'event_id');
    }

    public function reviews()
    {
        return $this->hasMany(EventReview::class, 'event_id');
    }

    public function prices()
    {
        return $this->hasMany(EventPrice::class, 'event_id');
    }
}
