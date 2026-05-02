<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FooterSettings extends Model
{
    protected $table = 'footer_settings';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    protected $fillable = ['id','copyright_text','description','links','social_links','newsletter_enabled','newsletter_title','newsletter_description','updated_by'];
    protected $casts = ['links' => 'array', 'social_links' => 'array', 'newsletter_enabled' => 'boolean'];
}
