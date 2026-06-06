<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VolunteerPost extends Model
{
    protected $fillable = [
        'title', 'location', 'type', 'duration', 'commitment',
        'start_date', 'deadline', 'description', 'responsibilities',
        'requirements', 'benefits', 'category', 'status',
    ];

    protected $casts = [
        'responsibilities' => 'array',
        'requirements' => 'array',
        'benefits' => 'array',
        'start_date' => 'date',
        'deadline' => 'date',
    ];
}
