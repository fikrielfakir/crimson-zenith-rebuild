<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingPageSection extends Model
{
    protected $fillable = ['section_key', 'label', 'is_enabled', 'ordering'];

    protected $casts = [
        'is_enabled' => 'boolean',
        'ordering'   => 'integer',
    ];
}
