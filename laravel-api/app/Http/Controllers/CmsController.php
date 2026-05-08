<?php

namespace App\Http\Controllers;

use App\Models\HeroSettings;
use App\Models\ThemeSettings;
use App\Models\NavbarSettings;
use App\Models\PresidentMessageSettings;
use App\Models\ContactSettings;
use App\Models\FooterSettings;
use App\Models\SeoSettings;
use App\Models\AboutSettings;
use App\Models\FocusItem;
use App\Models\TeamMember;
use App\Models\LandingTestimonial;
use App\Models\SiteStat;
use App\Models\MediaAsset;

class CmsController extends Controller
{
    public function hero()
    {
        return response()->json(HeroSettings::firstOrCreate(['id' => 'default']));
    }

    public function theme()
    {
        return response()->json(ThemeSettings::firstOrCreate(['id' => 'default']));
    }

    public function navbar()
    {
        return response()->json(NavbarSettings::firstOrCreate(['id' => 'default']));
    }

    public function presidentMessage()
    {
        return response()->json(PresidentMessageSettings::firstOrCreate(['id' => 'default']));
    }

    public function contact()
    {
        return response()->json(ContactSettings::firstOrCreate(['id' => 'default']));
    }

    public function footer()
    {
        return response()->json(FooterSettings::firstOrCreate(['id' => 'default']));
    }

    public function seo()
    {
        return response()->json(SeoSettings::firstOrCreate(['id' => 'default']));
    }

    public function about()
    {
        return response()->json(AboutSettings::firstOrCreate(['id' => 'default']));
    }

    public function focusItems()
    {
        return response()->json(FocusItem::where('is_active', true)->orderBy('ordering')->get());
    }

    public function teamMembers()
    {
        return response()->json(TeamMember::where('is_active', true)->orderBy('ordering')->get());
    }

    public function testimonials()
    {
        return response()->json(
            LandingTestimonial::where('is_active', true)->where('is_approved', true)->orderBy('ordering')->get()
        );
    }

    public function stats()
    {
        return response()->json(SiteStat::where('is_active', true)->orderBy('ordering')->get());
    }

    public function media($id)
    {
        $asset = MediaAsset::findOrFail($id);

        $dataUrl = $asset->url ?? ($asset->file_url ?? null);

        // If it's a base64 data URL, decode and serve as binary image
        if ($dataUrl && preg_match('/^data:([^;]+);base64,(.+)$/s', $dataUrl, $m)) {
            $mime    = $m[1];
            $binary  = base64_decode($m[2]);
            return response($binary, 200)
                ->header('Content-Type', $mime)
                ->header('Cache-Control', 'public, max-age=31536000, immutable');
        }

        // If it's an external URL, redirect to it
        if ($dataUrl && filter_var($dataUrl, FILTER_VALIDATE_URL)) {
            return redirect($dataUrl);
        }

        // Fallback: return JSON representation
        return response()->json($asset);
    }
}
