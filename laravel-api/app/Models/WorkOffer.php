<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkOffer extends Model
{
    protected $fillable = [
        'title', 'company', 'location', 'type', 'salary', 'experience_level',
        'description', 'responsibilities', 'requirements', 'benefits',
        'category', 'status',
    ];

    protected $casts = [
        'responsibilities' => 'array',
        'requirements' => 'array',
        'benefits' => 'array',
    ];
}
