<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HeroSettings;
use App\Models\ThemeSettings;
use App\Models\NavbarSettings;
use App\Models\FooterSettings;
use App\Models\PresidentMessageSettings;
use App\Models\AboutSettings;
use App\Models\MediaAsset;
use App\Models\FocusItem;
use App\Models\TeamMember;
use App\Models\LandingTestimonial;
use App\Models\SiteStat;
use App\Models\Partner;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CmsAdminController extends Controller
{
    public function updateHero(Request $request)
    {
        $settings = HeroSettings::firstOrCreate(['id' => 'default']);
        $settings->update(array_merge($request->except(['id']), ['updated_by' => $request->user()->id]));
        return response()->json($settings->fresh());
    }

    public function updateTheme(Request $request)
    {
        $settings = ThemeSettings::firstOrCreate(['id' => 'default']);
        $settings->update(array_merge($request->except(['id']), ['updated_by' => $request->user()->id]));
        return response()->json($settings->fresh());
    }

    public function updateNavbar(Request $request)
    {
        $settings = NavbarSettings::firstOrCreate(['id' => 'default']);
        $settings->update(array_merge($request->except(['id']), ['updated_by' => $request->user()->id]));
        return response()->json($settings->fresh());
    }

    public function updateFooter(Request $request)
    {
        $settings = FooterSettings::firstOrCreate(['id' => 'default']);
        $settings->update(array_merge($request->except(['id']), ['updated_by' => $request->user()->id]));
        return response()->json($settings->fresh());
    }

    public function updatePresidentMessage(Request $request)
    {
        $settings = PresidentMessageSettings::firstOrCreate(['id' => 'default']);
        $settings->update(array_merge($request->except(['id']), ['updated_by' => $request->user()->id]));
        return response()->json($settings->fresh());
    }

    public function updateAbout(Request $request)
    {
        $settings = AboutSettings::firstOrCreate(['id' => 'default']);
        $settings->update(array_merge($request->except(['id']), ['updated_by' => $request->user()->id]));
        return response()->json($settings->fresh());
    }

    public function uploadMedia(Request $request)
    {
        $userId = $request->user()?->id ?? 'system';

        // Accept multipart file upload
        if ($request->hasFile('file')) {
            $file    = $request->file('file');
            $mime    = $file->getMimeType() ?? 'image/jpeg';
            $b64     = base64_encode(file_get_contents($file->getRealPath()));
            $dataUrl = 'data:' . $mime . ';base64,' . $b64;

            $asset = MediaAsset::create([
                'id'          => Str::uuid(),
                'url'         => $dataUrl,
                'alt'         => $request->input('alt', $file->getClientOriginalName()),
                'file_type'   => $mime,
                'file_name'   => $file->getClientOriginalName(),
                'uploaded_by' => $userId,
            ]);

            return response()->json([
                'url'      => $dataUrl,
                'imageUrl' => $dataUrl,
                'id'       => $asset->id,
            ], 201);
        }

        // Accept JSON base64 imageData
        $request->validate(['imageData' => 'required|string', 'alt' => 'nullable|string']);
        $imageData = $request->imageData;
        if (!preg_match('/^data:image\/(png|jpeg|jpg|gif|webp);base64,.+$/', $imageData, $m)) {
            return response()->json(['message' => 'Invalid image format'], 400);
        }

        $asset = MediaAsset::create([
            'id'          => Str::uuid(),
            'url'         => $imageData,
            'alt'         => $request->input('alt', ''),
            'file_type'   => 'image/' . $m[1],
            'uploaded_by' => $userId,
        ]);

        return response()->json([
            'url'      => $imageData,
            'imageUrl' => $imageData,
            'id'       => $asset->id,
        ], 201);
    }

    public function getCmsStat(Request $request)
    {
        $type = $request->type ?? 'all';
        $data = [];
        if (in_array($type, ['all', 'focus']))        $data['focusItems']   = FocusItem::where('is_active', true)->orderBy('ordering')->get();
        if (in_array($type, ['all', 'team']))         $data['teamMembers']  = TeamMember::where('is_active', true)->orderBy('ordering')->get();
        if (in_array($type, ['all', 'testimonials'])) $data['testimonials'] = LandingTestimonial::orderBy('ordering')->get();
        if (in_array($type, ['all', 'stats']))        $data['siteStats']    = SiteStat::where('is_active', true)->orderBy('ordering')->get();
        if (in_array($type, ['all', 'partners']))     $data['partners']     = Partner::where('is_active', true)->orderBy('ordering')->get();
        return response()->json($data);
    }

    public function updateCmsStat(Request $request)
    {
        $type = $request->validate(['type' => 'required|in:focus,team,testimonials,stats,partners'])['type'];
        $items = $request->validate(['items' => 'required|array'])['items'];

        $modelMap = [
            'focus'        => FocusItem::class,
            'team'         => TeamMember::class,
            'testimonials' => LandingTestimonial::class,
            'stats'        => SiteStat::class,
            'partners'     => Partner::class,
        ];
        $model = $modelMap[$type];

        foreach ($items as $index => $item) {
            $item['ordering'] = $index + 1;
            if (!empty($item['id'])) {
                $model::find($item['id'])?->update($item);
            } else {
                $model::create($item);
            }
        }

        return response()->json(['message' => 'Updated successfully']);
    }

    public function deleteCmsStat($type, $id)
    {
        $modelMap = [
            'focus'        => FocusItem::class,
            'team'         => TeamMember::class,
            'testimonials' => LandingTestimonial::class,
            'stats'        => SiteStat::class,
            'partners'     => Partner::class,
        ];
        if (!isset($modelMap[$type])) return response()->json(['message' => 'Invalid type'], 400);
        $modelMap[$type]::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
