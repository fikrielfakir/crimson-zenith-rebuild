<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    protected $fillable = ['name', 'role', 'bio', 'photo_id', 'email', 'phone', 'social_links', 'ordering', 'is_active', 'created_by'];
    protected $casts = ['social_links' => 'array', 'is_active' => 'boolean'];
}
