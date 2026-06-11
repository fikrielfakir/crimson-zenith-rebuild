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

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,svg,webp|max:5120',
        ]);

        $file     = $request->file('image');
        $folder   = $request->input('folder', 'general');
        $filename = uniqid($folder . '_', true) . '.' . $file->getClientOriginalExtension();
        $dir      = public_path('uploads/' . $folder);

        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        $file->move($dir, $filename);

        return response()->json(['url' => url('uploads/' . $folder . '/' . $filename)]);
    }
}
