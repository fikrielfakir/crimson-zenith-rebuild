<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingTestimonial extends Model
{
    protected $fillable = ['name', 'role', 'photo_id', 'rating', 'feedback', 'is_approved', 'is_active', 'ordering', 'user_id'];
    protected $casts = ['is_approved' => 'boolean', 'is_active' => 'boolean'];
}
