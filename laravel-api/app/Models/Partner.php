<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Partner extends Model
{
    protected $fillable = ['name', 'logo_id', 'logo_url', 'website_url', 'description', 'ordering', 'is_active', 'created_by'];
    protected $casts = ['is_active' => 'boolean'];
}
