<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SubmissionController extends Controller
{
    public function index(Request $request)
    {
        // Simple list for now
        $user = $request->user();
        $query = Submission::query();

        if ($user->role === 'student') {
            $query->where('student_id', $user->id);
        }
        // Supervisors can see submissions for their projects
        elseif ($user->role === 'supervisor') {
             $query->whereHas('project', function ($q) use ($user) {
                 $q->where('supervisor_id', $user->id);
             });
        }

        return response()->json($query->with('project')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string',
            'file' => 'required|file|mimes:pdf,doc,docx,zip|max:10240', // 10MB max
            'submission_type' => 'required|in:proposal,milestone,final',
        ]);

        $user = $request->user();
        
        // Ensure the student owns the project
        $project = Project::findOrFail($request->project_id);
        if ($project->student_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('submissions', 'public');

            $submission = Submission::create([
                'project_id' => $request->project_id,
                'student_id' => $user->id,
                'title' => $request->title,
                'file_path' => $path,
                'submission_type' => $request->submission_type,
            ]);

            return response()->json($submission, 201);
        }

        return response()->json(['message' => 'File upload failed'], 500);
    }

    public function show(Submission $submission)
    {
        return response()->json($submission);
    }
}
