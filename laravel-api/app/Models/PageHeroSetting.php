<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageHeroSetting extends Model
{
    protected $table = 'page_hero_settings';
    protected $primaryKey = 'page_key';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'page_key',
        'background_type',
        'background_image_url',
        'background_video_url',
        'overlay_opacity',
        'title',
        'subtitle',
        'updated_by',
    ];

    protected $casts = [
        'overlay_opacity' => 'integer',
    ];
}
