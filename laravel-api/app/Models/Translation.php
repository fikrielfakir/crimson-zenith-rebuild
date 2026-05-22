<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Translation extends Model
{
    protected $table = 'translations';

    protected $fillable = [
        'entity_type',
        'entity_id',
        'field',
        'language',
        'value',
    ];
}
