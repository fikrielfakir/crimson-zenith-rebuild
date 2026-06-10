<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CookieSetting extends Model
{
    protected $table = 'cookie_settings';

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['id', 'enabled', 'delay', 'title', 'description', 'categories'];

    protected $casts = [
        'enabled'    => 'boolean',
        'delay'      => 'integer',
        'categories' => 'array',
    ];
}
