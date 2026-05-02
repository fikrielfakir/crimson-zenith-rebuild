<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AboutSettings extends Model
{
    protected $table = 'about_settings';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    protected $fillable = ['id','is_active','title','subtitle','description','image_id','background_image_id','background_color','updated_by'];
    protected $casts = ['is_active' => 'boolean'];
}
