<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentSettings extends Model
{
    protected $table = 'payment_settings';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'cmi_enabled', 'cash_enabled',
        'cmi_merchant_id', 'cmi_store_key', 'cmi_gateway_url',
        'cmi_currency', 'cmi_mode',
        'cmi_ok_url', 'cmi_fail_url', 'cmi_callback_url',
        'stripe_enabled', 'stripe_publishable_key', 'stripe_secret_key', 'stripe_mode',
        'updated_by',
    ];

    protected $casts = [
        'cmi_enabled'    => 'boolean',
        'cash_enabled'   => 'boolean',
        'stripe_enabled' => 'boolean',
    ];

    protected $hidden = [
        'cmi_store_key',
        'stripe_secret_key',
    ];
}
