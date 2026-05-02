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

        if ($request->filled('type')) {
            $query->where('file_type', 'like', $request->type . '%');
        }

        $page    = max(1, (int) ($request->page ?? 1));
        $perPage = max(1, min(200, (int) ($request->perPage ?? $request->limit ?? 50)));
        $total   = $query->count();
        $media   = $query->orderBy('created_at', 'desc')
                         ->skip(($page - 1) * $perPage)
                         ->take($perPage)
                         ->get()
                         ->map(fn ($m) => $this->formatAsset($m));

        return response()->json([
            'media'   => $media,
            'total'   => $total,
            'page'    => $page,
            'perPage' => $perPage,
        ]);
    }

    public function store(Request $request)
    {
        $assetData = ['id' => Str::uuid(), 'uploaded_by' => $request->user()->id];

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $mime = $file->getMimeType() ?? 'application/octet-stream';
            $name = $file->getClientOriginalName();
            $b64  = base64_encode(file_get_contents($file->getRealPath()));
            $dataUrl = 'data:' . $mime . ';base64,' . $b64;

            $assetData['url']       = $dataUrl;
            $assetData['file_name'] = $name;
            $assetData['file_type'] = $mime;
            $assetData['alt']       = $request->alt ?? pathinfo($name, PATHINFO_FILENAME);
        } elseif ($request->filled('imageData')) {
            $imageData = $request->imageData;
            if (!preg_match('/^data:([^;]+);base64,.+$/', $imageData, $m)) {
                return response()->json(['message' => 'Invalid image format'], 400);
            }
            $assetData['url']       = $imageData;
            $assetData['file_type'] = $m[1];
            $assetData['alt']       = $request->alt ?? '';
        } else {
            return response()->json(['message' => 'No file or imageData provided'], 422);
        }

        $asset = MediaAsset::create($assetData);

        return response()->json($this->formatAsset($asset), 201);
    }

    public function destroy($id)
    {
        MediaAsset::findOrFail($id)->delete();

        return response()->json(['message' => 'Media deleted']);
    }

    private function formatAsset(MediaAsset $m): array
    {
        $fileUrl = $m->file_url ?? $m->url ?? '';
        if (empty($fileUrl) && !empty($m->url)) {
            $fileUrl = $m->url;
        }

        return [
            'id'           => $m->id,
            'fileName'     => $m->file_name ?? $m->alt ?? 'media-' . $m->id,
            'fileType'     => $m->file_type ?? 'application/octet-stream',
            'fileSize'     => $m->file_size ?? null,
            'fileUrl'      => $fileUrl,
            'thumbnailUrl' => $m->thumbnail_url ?? null,
            'altText'      => $m->alt_text ?? $m->alt ?? null,
            'createdAt'    => $m->created_at?->toISOString() ?? now()->toISOString(),
        ];
    }
}
