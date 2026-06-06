<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FocusSectionSettings extends Model
{
    protected $table = 'focus_section_settings';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    protected $fillable = ['id', 'title', 'subtitle', 'is_active', 'updated_by'];
    protected $casts = ['is_active' => 'boolean'];
}
