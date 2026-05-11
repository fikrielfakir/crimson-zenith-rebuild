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
        'is_featured',
        'sort_order',
        'aspect',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'sort_order'  => 'integer',
    ];
}
