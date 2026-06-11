<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuthSettings extends Model
{
    protected $table = 'auth_settings';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'allow_registration',
        'password_min_length',
        'session_duration_hours',
        'require_email_verification',
        'max_login_attempts',
        'updated_by',
    ];

    protected $casts = [
        'allow_registration'          => 'boolean',
        'require_email_verification'  => 'boolean',
        'password_min_length'         => 'integer',
        'session_duration_hours'      => 'integer',
        'max_login_attempts'          => 'integer',
    ];
}
