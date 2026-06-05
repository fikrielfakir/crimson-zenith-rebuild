<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClubsPageSettings extends Model
{
    protected $table = 'clubs_page_settings';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'id',
        'intro_heading',
        'intro_description',
        'cta_heading',
        'cta_description',
        'cta_button_text',
        'cta_button_link',
        'updated_by',
    ];
}
