<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    /**
     * Display a listing of projects.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Project::with(['student', 'supervisor']);

        if ($user->role === 'student') {
            $query->where('student_id', $user->id);
        } elseif ($user->role === 'supervisor') {
            $query->where('supervisor_id', $user->id);
        } elseif ($user->role === 'evaluator') {
            $query->where('evaluator_id', $user->id);
        }

        // Admin sees all
        return response()->json($query->paginate(10));
    }

    /**
     * Store a newly created project (Proposal).
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'student') {
            return response()->json(['message' => 'Only students can propose projects.'], 403);
        }

        // Check if student already has a project
        if (Project::where('student_id', $user->id)->exists()) {
            return response()->json(['message' => 'You have already submitted a proposal.'], 400);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $project = Project::create([
            'title' => $request->title,
            'description' => $request->description,
            'student_id' => $user->id,
            'status' => 'proposed',
        ]);

        return response()->json($project, 201);
    }

    /**
     * Display the specified project.
     */
    public function show(Project $project)
    {
        // Simple authorization check
        $user = Auth::user();
        if ($user->role === 'student' && $project->student_id !== $user->id) {
             return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($project->load(['submissions', 'evaluation', 'supervisor']));
    }

    /**
     * Update the specified project in storage.
     */
    public function update(Request $request, Project $project)
    {
        $user = $request->user();

        // Supervisor assigning themselves or Admin assigning supervisor
        if ($request->has('supervisor_id')) {
             // Logic for supervisor assignment
        }

        // Supervisor approving/rejecting
        if ($request->has('status') && ($user->role === 'supervisor' || $user->role === 'admin')) {
             $project->update(['status' => $request->status]);
        }

        // Updating details
        if ($user->id === $project->student_id && $project->status === 'proposed') {
             $project->update($request->only(['title', 'description']));
        }

        return response()->json($project);
    }

    /**
     * Remove the specified project from storage.
     */
    public function destroy(Project $project)
    {
        // Only admin can delete
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $project->delete();
        return response()->json(['message' => 'Project deleted']);
    }
}
