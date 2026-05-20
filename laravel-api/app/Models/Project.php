<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'title', 'description', 'category', 'status', 'progress',
        'image', 'location', 'participants_count', 'impact_people',
        'impact_co2', 'impact_sites', 'is_featured',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'progress' => 'integer',
        'participants_count' => 'integer',
        'impact_people' => 'integer',
        'impact_sites' => 'integer',
    ];
}
