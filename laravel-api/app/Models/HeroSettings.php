<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeroSettings extends Model
{
    protected $table = 'hero_settings';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'id', 'title', 'subtitle', 'primary_button_text', 'primary_button_link',
        'secondary_button_text', 'secondary_button_link', 'background_type',
        'background_media_id', 'background_overlay_color', 'background_overlay_opacity',
        'title_font_size', 'title_color', 'subtitle_font_size', 'subtitle_color',
        'enable_typewriter', 'typewriter_texts', 'updated_by',
    ];

    protected $casts = [
        'typewriter_texts' => 'array',
        'enable_typewriter' => 'boolean',
    ];
}
