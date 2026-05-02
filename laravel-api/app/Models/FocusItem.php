<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FocusItem extends Model
{
    protected $fillable = ['title', 'icon', 'description', 'ordering', 'is_active', 'media_id', 'created_by'];
    protected $casts = ['is_active' => 'boolean'];
}
