<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SeoSettings;
use App\Models\ContactSettings;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function show()
    {
        return response()->json([
            'seo'     => SeoSettings::firstOrCreate(['id' => 'default']),
            'contact' => ContactSettings::firstOrCreate(['id' => 'default']),
        ]);
    }

    public function updateSeo(Request $request)
    {
        $settings = SeoSettings::firstOrCreate(['id' => 'default']);
        $settings->update($request->except(['id']));
        return response()->json($settings->fresh());
    }

    public function updateContact(Request $request)
    {
        $settings = ContactSettings::firstOrCreate(['id' => 'default']);
        $settings->update($request->except(['id']));
        return response()->json($settings->fresh());
    }
}
