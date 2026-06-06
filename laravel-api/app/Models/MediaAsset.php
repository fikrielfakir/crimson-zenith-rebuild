<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MediaAsset extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    const CREATED_AT = 'created_at';

    protected $fillable = [
        'id', 'url', 'alt', 'file_name', 'file_type', 'file_url', 'thumbnail_url',
        'alt_text', 'focal_point', 'metadata', 'uploaded_by',
    ];

    protected $casts = [
        'focal_point' => 'array',
        'metadata'    => 'array',
        'created_at'  => 'datetime',
    ];
}
