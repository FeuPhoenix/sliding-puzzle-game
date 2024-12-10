<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Score;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ScoreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'points' => 'required|integer|min:0',
            'achievement_type' => 'required|string|max:100',
            'description' => 'nullable|string|max:1000'
        ]);

        // Check if this is a high score for the user
        $userHighestScore = Score::where('user_id', Auth::id())
            ->where('achievement_type', $validated['achievement_type'])
            ->max('points');

        if (!$userHighestScore || $validated['points'] > $userHighestScore) {
            $score = Score::create([
                'user_id' => Auth::id(),
                'points' => $validated['points'],
                'achievement_type' => $validated['achievement_type'],
                'description' => $validated['description'] ?? null,
                'achieved_at' => now()
            ]);

            return response()->json($score, 201);
        }

        return response()->json(['message' => 'Score not high enough to record'], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function topScores(): JsonResponse
    {
        $topScores = Score::with('user')
            ->orderBy('points', 'desc')
            ->take(3)
            ->get()
            ->map(function ($score) {
                return [
                    'points' => $score->points,
                    'user_name' => $score->user->name,
                    'achievement_type' => $score->achievement_type,
                    'achieved_at' => $score->achieved_at
                ];
            });

        return response()->json($topScores);
    }

    public function userHighScores(): JsonResponse
    {
        $highScores = Score::where('user_id', Auth::id())
            ->orderBy('points', 'desc')
            ->get();

        return response()->json($highScores);
    }
}
