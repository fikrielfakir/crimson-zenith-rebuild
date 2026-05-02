<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MediaAsset;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    public function index(Request $request)
    {
        $query = MediaAsset::query();
        if ($request->has('type')) $query->where('file_type', $request->type);
        $page  = max(1, (int)($request->page ?? 1));
        $limit = max(1, min(200, (int)($request->limit ?? 50)));
        $total = $query->count();
        $media = $query->orderBy('created_at', 'desc')->skip(($page-1)*$limit)->take($limit)->get();
        return response()->json(['media' => $media, 'total' => $total, 'page' => $page, 'limit' => $limit]);
    }

    public function store(Request $request)
    {
        $request->validate(['imageData' => 'required|string', 'alt' => 'nullable|string']);

        $imageData = $request->imageData;
        if (!preg_match('/^data:image\/(png|jpeg|jpg|gif|webp);base64,.+$/', $imageData, $m)) {
            return response()->json(['message' => 'Invalid image format'], 400);
        }

        $asset = MediaAsset::create([
            'id'          => Str::uuid(),
            'url'         => $imageData,
            'alt'         => $request->alt ?? '',
            'file_type'   => 'image/'.$m[1],
            'uploaded_by' => $request->user()->id,
        ]);

        return response()->json($asset, 201);
    }

    public function destroy($id)
    {
        MediaAsset::findOrFail($id)->delete();
        return response()->json(['message' => 'Media deleted']);
    }
}
