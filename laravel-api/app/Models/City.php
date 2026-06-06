<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class City extends Model
{
    protected $fillable = [
        'name', 'slug', 'title', 'description', 'image',
        'hero_type', 'hero_video', 'hero_overlay',
        'highlights', 'culture', 'cuisine', 'activities',
        'best_time', 'getting_there', 'travel_tips',
        'is_active', 'ordering',
    ];

    protected $casts = [
        'highlights'    => 'array',
        'culture'       => 'array',
        'cuisine'       => 'array',
        'activities'    => 'array',
        'best_time'     => 'array',
        'getting_there' => 'array',
        'travel_tips'   => 'array',
        'is_active'     => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->name);
            }
        });
    }
}
