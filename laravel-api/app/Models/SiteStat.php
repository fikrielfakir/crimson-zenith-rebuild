<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteStat extends Model
{
    protected $table = 'site_stats';
    protected $fillable = ['label', 'value', 'icon', 'suffix', 'ordering', 'is_active', 'updated_by'];
    protected $casts = ['is_active' => 'boolean'];
}
