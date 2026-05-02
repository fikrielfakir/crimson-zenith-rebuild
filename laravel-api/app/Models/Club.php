<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Club extends Model
{
    protected $fillable = [
        'name', 'slug', 'description', 'long_description', 'image',
        'location', 'member_count', 'features', 'contact_phone',
        'contact_email', 'website', 'social_media', 'rating',
        'established', 'is_active', 'latitude', 'longitude', 'owner_id',
    ];

    protected $casts = [
        'features'     => 'array',
        'social_media' => 'array',
        'is_active'    => 'boolean',
        'latitude'     => 'float',
        'longitude'    => 'float',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function memberships()
    {
        return $this->hasMany(ClubMembership::class, 'club_id');
    }

    public function events()
    {
        return $this->hasMany(BookingEvent::class, 'club_id');
    }

    public function gallery()
    {
        return $this->hasMany(ClubGallery::class, 'club_id');
    }

    public function reviews()
    {
        return $this->hasMany(ClubReview::class, 'club_id');
    }
}
