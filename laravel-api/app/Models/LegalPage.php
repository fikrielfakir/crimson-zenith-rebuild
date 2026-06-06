<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LegalPage extends Model
{
    protected $table = 'legal_pages';

    protected $fillable = [
        'page_key',
        'title',
        'content',
        'updated_by',
    ];

    protected $hidden = [];

    public function toApiArray(): array
    {
        return [
            'id'        => $this->id,
            'pageKey'   => $this->page_key,
            'title'     => $this->title,
            'content'   => $this->content,
            'updatedAt' => $this->updated_at,
        ];
    }
}
