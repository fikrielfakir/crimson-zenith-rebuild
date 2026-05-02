<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function createPaymentIntent(Request $request)
    {
        $request->validate(['amount' => 'required|numeric|min:1', 'currency' => 'nullable|string']);

        $secretKey = env('STRIPE_SECRET_KEY');
        if (!$secretKey) {
            return response()->json(['message' => 'Stripe not configured'], 503);
        }

        \Stripe\Stripe::setApiKey($secretKey);
        $intent = \Stripe\PaymentIntent::create([
            'amount'   => (int) ($request->amount * 100),
            'currency' => $request->currency ?? 'mad',
        ]);

        return response()->json(['clientSecret' => $intent->client_secret]);
    }

    public function createPaypalOrder(Request $request)
    {
        return response()->json(['message' => 'PayPal integration pending configuration'], 503);
    }
}
