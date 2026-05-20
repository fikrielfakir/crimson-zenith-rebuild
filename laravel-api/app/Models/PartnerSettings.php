<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PartnerSettings extends Model
{
    public $timestamps = false;
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['id', 'is_active', 'title', 'subtitle', 'background_color', 'updated_by'];
    protected $casts = ['is_active' => 'boolean'];

    const UPDATED_AT = 'updated_at';
    const CREATED_AT = null;
}
