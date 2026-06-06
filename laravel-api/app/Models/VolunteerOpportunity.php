<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VolunteerOpportunity extends Model
{
    protected $fillable = [
        'title', 'location', 'duration', 'max_participants', 'current_participants',
        'description', 'skills', 'urgency', 'status',
    ];

    protected $casts = [
        'skills' => 'array',
        'max_participants' => 'integer',
        'current_participants' => 'integer',
    ];
}
