<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GalleryItem extends Model
{
    protected $fillable = [
        'title',
        'location',
        'category',
        'photographer',
        'description',
        'image_url',
        'panorama_url',
        'has_360',
        'hotspots',
        'is_featured',
        'sort_order',
        'aspect',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'has_360'     => 'boolean',
        'sort_order'  => 'integer',
        'hotspots'    => 'array',
    ];
}
