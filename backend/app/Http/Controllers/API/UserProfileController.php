<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class UserProfileController extends Controller
{
    public function show(): JsonResponse
    {
        $profile = UserProfile::where('user_id', Auth::id())->firstOrFail();
        return response()->json($profile);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'avatar_url' => 'nullable|url',
            'bio' => 'nullable|string|max:1000',
            'phone_number' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'country' => 'nullable|string|max:100'
        ]);

        $profile = UserProfile::create([
            'user_id' => Auth::id(),
            ...$validated
        ]);

        return response()->json($profile, 201);
    }

    public function update(Request $request): JsonResponse
    {
        $profile = UserProfile::where('user_id', Auth::id())->firstOrFail();

        $validated = $request->validate([
            'avatar_url' => 'nullable|url',
            'bio' => 'nullable|string|max:1000',
            'phone_number' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'country' => 'nullable|string|max:100'
        ]);

        $profile->update($validated);

        return response()->json($profile);
    }

    public function destroy(): JsonResponse
    {
        $profile = UserProfile::where('user_id', Auth::id())->firstOrFail();
        $profile->delete();

        return response()->json(null, 204);
    }
}
