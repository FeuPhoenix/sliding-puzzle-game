<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Score extends Model
{
    protected $fillable = [
        'user_id',
        'points',
        'achievement_type',
        'description',
        'achieved_at'
    ];

    protected $casts = [
        'achieved_at' => 'datetime',
        'points' => 'integer'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
