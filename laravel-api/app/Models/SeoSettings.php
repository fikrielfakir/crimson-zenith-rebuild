<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SeoSettings extends Model
{
    protected $table = 'seo_settings';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    protected $fillable = [
        'id', 'site_title', 'site_description', 'keywords', 'og_image',
        'twitter_handle', 'google_analytics_id', 'facebook_pixel_id',
        'custom_head_code', 'custom_body_code', 'updated_by',
    ];
}
