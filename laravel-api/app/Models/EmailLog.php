<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailLog extends Model
{
    protected $table = 'email_log';

    protected $fillable = [
        'to',
        'subject',
        'body',
        'status',
        'error_message',
        'type',
        'sent_by',
    ];
}
