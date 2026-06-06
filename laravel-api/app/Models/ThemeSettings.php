<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ThemeSettings extends Model
{
    protected $table = 'theme_settings';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    protected $fillable = ['id', 'primary_color', 'secondary_color', 'custom_css', 'updated_by'];
}
