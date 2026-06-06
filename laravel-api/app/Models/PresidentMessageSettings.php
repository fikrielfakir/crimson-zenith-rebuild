<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PresidentMessageSettings extends Model
{
    protected $table = 'president_message_settings';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    protected $fillable = [
        'id', 'is_active', 'title', 'president_name', 'president_role', 'message', 'quote',
        'photo_id', 'signature_id', 'background_image_id', 'background_color', 'background_gradient',
        'title_font_family', 'title_font_size', 'title_color', 'title_alignment',
        'name_font_family', 'name_font_size', 'name_color', 'role_font_family', 'role_font_size', 'role_color',
        'message_font_family', 'message_font_size', 'message_color', 'quote_color', 'quote_font_size',
        'image_position', 'image_alignment', 'image_width', 'section_padding', 'content_gap', 'updated_by',
    ];
    protected $casts = ['is_active' => 'boolean'];
}
