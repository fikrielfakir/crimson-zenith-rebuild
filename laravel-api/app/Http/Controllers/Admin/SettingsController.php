<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SeoSettings;
use App\Models\ContactSettings;
use App\Models\MediaAsset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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
        $file = $request->file('image');

        $isSvg = $file && $file->getMimeType() === 'image/svg+xml';

        if ($isSvg) {
            $request->validate(['image' => 'required|file|mimes:svg+xml,svg|max:5120']);
        } else {
            $request->validate(['image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120']);
        }

        $origName = $file->getClientOriginalName();
        $ext      = $file->getClientOriginalExtension() ?: 'bin';
        $uuid     = (string) Str::uuid();
        $filename = $uuid . '.' . $ext;
        $mime     = $file->getMimeType() ?? 'application/octet-stream';

        Storage::disk('public')->put('media/' . $filename, file_get_contents($file->getRealPath()));
        $fileUrl = '/storage/media/' . $filename;

        $asset = MediaAsset::create([
            'file_name'     => $origName,
            'file_type'     => $mime,
            'file_size'     => $file->getSize(),
            'file_url'      => $fileUrl,
            'thumbnail_url' => $fileUrl,
            'alt_text'      => $request->input('alt', pathinfo($origName, PATHINFO_FILENAME)),
            'uploaded_by'   => $request->user()?->id ?? 'system',
        ]);

        return response()->json([
            'url'     => $fileUrl,
            'fileUrl' => $fileUrl,
            'id'      => $asset->id,
        ]);
    }
}
