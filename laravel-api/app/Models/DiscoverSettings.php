<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DiscoverSettings extends Model
{
    protected $table = 'discover_page_settings';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'id',
        'hero_title',
        'hero_subtitle',
        'hero_bg_image',
        'intro_heading',
        'intro_description',
        'cta_heading',
        'cta_description',
        'cta_button_text',
        'cta_button_link',
        'updated_by',
    ];
}
