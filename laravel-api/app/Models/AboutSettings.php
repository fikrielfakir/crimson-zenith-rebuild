<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AboutSettings extends Model
{
    protected $table = 'about_settings';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'id',
        'is_active',
        'title',
        'subtitle',
        'description',
        'who_we_are_title',
        'who_we_are_paragraph2',
        'values_title',
        'cta_title',
        'cta_description',
        'translations',
        'image_id',
        'background_image_id',
        'background_color',
        'updated_by',
    ];

    protected $casts = [
        'is_active'    => 'boolean',
        'translations' => 'array',
    ];

    public function toApiArray(): array
    {
        return [
            'id'                  => $this->id,
            'isActive'            => (bool) ($this->is_active ?? true),
            'title'               => $this->title,
            'subtitle'            => $this->subtitle,
            'description'         => $this->description,
            'whoWeAreTitle'       => $this->who_we_are_title,
            'whoWeAreParagraph2'  => $this->who_we_are_paragraph2,
            'valuesTitle'         => $this->values_title,
            'ctaTitle'            => $this->cta_title,
            'ctaDescription'      => $this->cta_description,
            'translations'        => $this->translations ?? [],
            'updatedBy'           => $this->updated_by,
        ];
    }
}
