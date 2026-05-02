<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NavbarSettings extends Model
{
    protected $table = 'navbar_settings';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'id', 'logo_type', 'logo_image_id', 'logo_svg', 'logo_text', 'logo_size', 'logo_link',
        'navigation_links', 'show_language_switcher', 'available_languages',
        'show_dark_mode_toggle', 'login_button_text', 'login_button_link', 'show_login_button',
        'join_button_text', 'join_button_link', 'join_button_style', 'show_join_button',
        'background_color', 'text_color', 'hover_color', 'font_family', 'font_size',
        'is_sticky', 'is_transparent', 'transparent_bg', 'scrolled_bg', 'height', 'updated_by',
    ];

    protected $casts = [
        'navigation_links'     => 'array',
        'available_languages'  => 'array',
        'show_language_switcher' => 'boolean',
        'show_dark_mode_toggle'  => 'boolean',
        'show_login_button'    => 'boolean',
        'show_join_button'     => 'boolean',
        'is_sticky'            => 'boolean',
        'is_transparent'       => 'boolean',
    ];
}
