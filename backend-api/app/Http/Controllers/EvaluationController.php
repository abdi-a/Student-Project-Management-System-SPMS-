<?php

namespace App\Http\Controllers;

use App\Models\Evaluation;
use App\Models\Project;
use Illuminate\Http\Request;

class EvaluationController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'project_id' => 'required|exists:projects,id',
            'score' => 'required|numeric|min:0|max:100',
            'comments' => 'nullable|string',
            'criteria' => 'nullable|array',
        ]);

        $user = $request->user();

        // Ensure user is an evaluator or admin
        if ($user->role !== 'evaluator' && $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $evaluation = Evaluation::updateOrCreate(
            ['project_id' => $request->project_id],
            [
                'evaluator_id' => $user->id,
                'score' => $request->score,
                'comments' => $request->comments,
                'criteria' => $request->criteria,
            ]
        );

        // Update project status to completed
        $project = Project::find($request->project_id);
        $project->update(['status' => 'completed']);

        return response()->json($evaluation, 201);
    }

    public function show(Project $project) {
        return response()->json($project->evaluation);
    }
}
