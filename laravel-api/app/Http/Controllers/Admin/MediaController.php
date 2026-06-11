<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MediaAsset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    public function index(Request $request)
    {
        $query = MediaAsset::query();

        if ($request->filled('type')) {
            $query->where('file_type', 'like', $request->type . '%');
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('file_name', 'like', '%' . $request->search . '%')
                  ->orWhere('alt_text', 'like', '%' . $request->search . '%');
            });
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
            'data'    => $media,
            'total'   => $total,
            'page'    => $page,
            'perPage' => $perPage,
        ]);
    }

    public function store(Request $request)
    {
        $userId = $request->user()?->id ?? 'system';

        if ($request->hasFile('file')) {
            $file     = $request->file('file');
            $mime     = $file->getMimeType() ?? 'application/octet-stream';
            $origName = $file->getClientOriginalName();
            $ext      = $file->getClientOriginalExtension() ?: 'bin';
            $uuid     = Str::uuid();
            $filename = $uuid . '.' . $ext;

            Storage::disk('public')->put('media/' . $filename, file_get_contents($file->getRealPath()));

            $fileUrl = '/storage/media/' . $filename;

            $asset = MediaAsset::create([
                'file_name'   => $origName,
                'file_type'   => $mime,
                'file_size'   => $file->getSize(),
                'file_url'    => $fileUrl,
                'thumbnail_url' => $fileUrl,
                'alt_text'    => $request->input('alt', pathinfo($origName, PATHINFO_FILENAME)),
                'uploaded_by' => $userId,
            ]);

            return response()->json($this->formatAsset($asset), 201);
        }

        if ($request->filled('imageData')) {
            $imageData = $request->imageData;
            if (!preg_match('/^data:([^;]+);base64,(.+)$/s', $imageData, $m)) {
                return response()->json(['message' => 'Invalid image format'], 400);
            }

            $mime   = $m[1];
            $binary = base64_decode($m[2]);
            $ext    = $this->mimeToExt($mime);
            $uuid   = Str::uuid();
            $filename = $uuid . '.' . $ext;

            Storage::disk('public')->put('media/' . $filename, $binary);

            $fileUrl = '/storage/media/' . $filename;
            $altText = $request->input('alt', '');

            $asset = MediaAsset::create([
                'file_name'   => ($altText ?: $uuid) . '.' . $ext,
                'file_type'   => $mime,
                'file_size'   => strlen($binary),
                'file_url'    => $fileUrl,
                'thumbnail_url' => $fileUrl,
                'alt_text'    => $altText,
                'uploaded_by' => $userId,
            ]);

            return response()->json($this->formatAsset($asset), 201);
        }

        return response()->json(['message' => 'No file or imageData provided'], 422);
    }

    public function destroy($id)
    {
        $asset = MediaAsset::findOrFail($id);

        if ($asset->file_url && str_starts_with($asset->file_url, '/storage/media/')) {
            $path = 'media/' . basename($asset->file_url);
            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }
        }

        $asset->delete();

        return response()->json(['message' => 'Media deleted']);
    }

    public function formatAsset(MediaAsset $m): array
    {
        $fileUrl = $m->file_url ?? '';

        $resolvedUrl = $fileUrl;
        if ($fileUrl && str_starts_with($fileUrl, '/storage/')) {
            $appUrl = rtrim(config('app.url', ''), '/');
            $resolvedUrl = $appUrl . $fileUrl;
        }

        return [
            'id'           => $m->id,
            'fileName'     => $m->file_name ?? 'media-' . $m->id,
            'fileType'     => $m->file_type ?? 'application/octet-stream',
            'fileSize'     => $m->file_size,
            'fileUrl'      => $resolvedUrl,
            'thumbnailUrl' => $m->thumbnail_url ? (
                str_starts_with($m->thumbnail_url, '/storage/')
                    ? rtrim(config('app.url', ''), '/') . $m->thumbnail_url
                    : $m->thumbnail_url
            ) : $resolvedUrl,
            'altText'      => $m->alt_text ?? $m->alt ?? '',
            'createdAt'    => $m->created_at?->toISOString() ?? now()->toISOString(),
        ];
    }

    private function mimeToExt(string $mime): string
    {
        return match ($mime) {
            'image/jpeg'  => 'jpg',
            'image/png'   => 'png',
            'image/gif'   => 'gif',
            'image/webp'  => 'webp',
            'image/svg+xml' => 'svg',
            'video/mp4'   => 'mp4',
            'video/webm'  => 'webm',
            'application/pdf' => 'pdf',
            default       => explode('/', $mime)[1] ?? 'bin',
        };
    }
}
