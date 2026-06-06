<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expert extends Model
{
    protected $fillable = [
        'name', 'title', 'location', 'image', 'linkedin_url', 'contact_email',
        'expertise', 'rating', 'projects_count', 'years_experience', 'languages',
        'bio', 'achievements', 'certifications', 'is_available', 'status',
    ];

    protected $casts = [
        'expertise' => 'array',
        'languages' => 'array',
        'achievements' => 'array',
        'certifications' => 'array',
        'is_available' => 'boolean',
        'rating' => 'float',
        'projects_count' => 'integer',
        'years_experience' => 'integer',
    ];
}
