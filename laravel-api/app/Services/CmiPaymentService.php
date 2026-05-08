<?php

namespace App\Services;

use App\Models\PaymentSettings;
use Illuminate\Support\Str;

class CmiPaymentService
{
    private PaymentSettings $settings;

    public function __construct()
    {
        $this->settings = PaymentSettings::firstOrCreate(
            ['id' => 'default'],
            ['id' => 'default']
        );
    }

    public function isEnabled(): bool
    {
        return (bool) $this->settings->cmi_enabled;
    }

    /**
     * Build the form fields to POST to CMI gateway.
     * Returns ['gateway_url' => ..., 'fields' => [...]] or throws on mis-config.
     */
    public function buildPaymentForm(array $params): array
    {
        $merchantId = $this->settings->cmi_merchant_id;
        $storeKey   = $this->settings->cmi_store_key;
        $gatewayUrl = $this->settings->cmi_gateway_url
            ?: 'https://testpayment.cmi.co.ma/fim/est3Dgate';

        if (!$merchantId || !$storeKey) {
            throw new \RuntimeException('CMI payment gateway is not fully configured.');
        }

        $oid        = $params['oid'];                     // booking reference
        $amount     = number_format((float) $params['amount'], 2, '.', '');
        $okUrl      = $params['okUrl'];
        $failUrl    = $params['failUrl'];
        $callbackUrl= $params['callbackUrl'];
        $email      = $params['email'] ?? '';
        $currency   = $this->settings->cmi_currency ?: '504';
        $rnd        = Str::random(32);
        $trantype   = 'PreAuth';
        $instalment = '';

        // Hash = BASE64( HMAC-SHA512( fields, storeKey ) )
        // CMI field order: clientid|oid|amount|okUrl|failUrl|trantype|instalment|rnd|storeKey
        $hashData = implode('|', [
            $merchantId, $oid, $amount, $okUrl, $failUrl,
            $trantype, $instalment, $rnd, $storeKey,
        ]);
        $hash = base64_encode(hash_hmac('sha512', $hashData, $storeKey, true));

        $fields = [
            'clientid'    => $merchantId,
            'storetype'   => '3D_PAY_HOSTING',
            'amount'      => $amount,
            'currency'    => $currency,
            'oid'         => $oid,
            'okUrl'       => $okUrl,
            'failUrl'     => $failUrl,
            'callbackUrl' => $callbackUrl,
            'trantype'    => $trantype,
            'instalment'  => $instalment,
            'rnd'         => $rnd,
            'lang'        => 'fr',
            'encoding'    => 'UTF-8',
            'email'       => $email,
            'hash'        => $hash,
        ];

        return [
            'gateway_url' => $gatewayUrl,
            'fields'      => $fields,
        ];
    }

    /**
     * Verify callback HMAC from CMI.
     * CMI posts response fields including HASH; we rebuild the hash and compare.
     */
    public function verifyCallback(array $postData): bool
    {
        $storeKey = $this->settings->cmi_store_key;
        if (!$storeKey) return false;

        $receivedHash = $postData['HASH'] ?? $postData['hash'] ?? '';
        if (!$receivedHash) return false;

        // Remove HASH and encoding from the data, sort alphabetically by key
        $data = array_filter($postData, fn($k) => !in_array(strtoupper($k), ['HASH', 'ENCODING']), ARRAY_FILTER_USE_KEY);
        ksort($data);

        $hashData = implode('|', array_values($data)) . '|' . $storeKey;
        $expected = base64_encode(hash_hmac('sha512', $hashData, $storeKey, true));

        return hash_equals($expected, $receivedHash);
    }

    public function getSettings(): PaymentSettings
    {
        return $this->settings;
    }
}
