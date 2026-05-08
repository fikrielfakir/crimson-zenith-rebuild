<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PaymentSettings;
use Illuminate\Http\Request;

class PaymentSettingsController extends Controller
{
    public function show()
    {
        $settings = PaymentSettings::firstOrCreate(
            ['id' => 'default'],
            ['id' => 'default', 'cash_enabled' => true]
        );

        // Return all fields including sensitive ones for admin view
        return response()->json(array_merge($settings->toArray(), [
            'cmi_store_key'      => $settings->getRawOriginal('cmi_store_key'),
            'stripe_secret_key'  => $settings->getRawOriginal('stripe_secret_key'),
        ]));
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'cmi_enabled'          => 'nullable|boolean',
            'cash_enabled'         => 'nullable|boolean',
            'cmi_merchant_id'      => 'nullable|string|max:255',
            'cmi_store_key'        => 'nullable|string',
            'cmi_gateway_url'      => 'nullable|url|max:500',
            'cmi_currency'         => 'nullable|string|max:10',
            'cmi_mode'             => 'nullable|in:test,live',
            'cmi_ok_url'           => 'nullable|max:500',
            'cmi_fail_url'         => 'nullable|max:500',
            'cmi_callback_url'     => 'nullable|max:500',
            'stripe_enabled'       => 'nullable|boolean',
            'stripe_publishable_key'=> 'nullable|string',
            'stripe_secret_key'    => 'nullable|string',
            'stripe_mode'          => 'nullable|in:test,live',
        ]);

        $settings = PaymentSettings::firstOrCreate(['id' => 'default']);

        // Don't overwrite secret keys if sent as masked placeholder
        foreach (['cmi_store_key', 'stripe_secret_key'] as $key) {
            if (isset($validated[$key]) && str_contains($validated[$key], '••')) {
                unset($validated[$key]);
            }
        }

        $validated['updated_by'] = $request->user()?->id ?? 'admin';
        $settings->update($validated);

        return response()->json(array_merge($settings->fresh()->toArray(), [
            'cmi_store_key'     => $settings->fresh()->getRawOriginal('cmi_store_key'),
            'stripe_secret_key' => $settings->fresh()->getRawOriginal('stripe_secret_key'),
        ]));
    }

    public function testConnection(Request $request)
    {
        $settings = PaymentSettings::firstOrCreate(['id' => 'default']);

        $checks = [];

        // CMI check
        if ($settings->cmi_enabled) {
            $checks['cmi'] = [
                'configured' => !empty($settings->cmi_merchant_id) && !empty($settings->cmi_store_key),
                'mode'       => $settings->cmi_mode,
                'gateway'    => $settings->cmi_gateway_url,
            ];
        }

        // Stripe check
        if ($settings->stripe_enabled) {
            $checks['stripe'] = [
                'configured' => !empty($settings->stripe_publishable_key) && !empty($settings->getRawOriginal('stripe_secret_key')),
                'mode'       => $settings->stripe_mode,
            ];
        }

        return response()->json(['checks' => $checks]);
    }
}
