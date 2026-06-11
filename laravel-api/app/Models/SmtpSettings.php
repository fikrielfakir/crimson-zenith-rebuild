<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SmtpSettings extends Model
{
    protected $table = 'smtp_settings';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'enabled',
        'host',
        'port',
        'secure',
        'username',
        'password',
        'from_name',
        'from_email',
        'updated_by',
    ];

    protected $casts = [
        'enabled' => 'boolean',
        'secure'  => 'boolean',
        'port'    => 'integer',
    ];

    protected $hidden = ['password'];
}
