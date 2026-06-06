<?php

namespace App\Http\Controllers;

use App\Models\BookingPageSettings;

class BookingPageSettingsController extends Controller
{
    public function show()
    {
        $settings = BookingPageSettings::first();
        return response()->json($settings);
    }
}
