<?php

namespace App\Models;

use App\Enum\Gender;
use Illuminate\Database\Eloquent\Casts\AsEnumCollection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Contact extends Model
{
    // protected $appends = ['profile_photo_url'];

    protected $fillable = [
        'name',
        'emails',
        'phone_numbers',
        'gender',
        'profile_photo',
        'file',
        'merged_into',
    ];

    protected $casts = [
        'emails' => 'array',
        'phone_numbers' => 'array',
    ];

    protected function getProfilePhotoAttribute($profile_photo): string
    {
        return url(Storage::url($profile_photo));
    }

    protected function getFileAttribute($file): string
    {
        return url(Storage::url($file));
    }

    public function customFields(): HasMany
    {
        return $this->hasMany(CustomField::class);
    }

    public function mergedFrom()
    {
        return $this->hasMany(Contact::class, 'merged_into');
    }
}
