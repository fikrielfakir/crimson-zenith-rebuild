<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactSettings extends Model
{
    protected $table = 'contact_settings';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    protected $fillable = [
        'id', 'office_address', 'email', 'phone', 'office_hours',
        'map_latitude', 'map_longitude', 'form_recipients', 'auto_reply_enabled',
        'auto_reply_message', 'social_links', 'updated_by',
    ];
    protected $casts = ['form_recipients' => 'array', 'social_links' => 'array', 'auto_reply_enabled' => 'boolean'];
}
