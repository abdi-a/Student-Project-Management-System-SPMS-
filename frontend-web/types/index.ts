export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'student' | 'supervisor' | 'evaluator';
    matric_no?: string;
    department?: string;
    created_at: string;
}

export interface Project {
    id: number;
    title: string;
    description: string;
    student_id: number;
    supervisor_id?: number;
    evaluator_id?: number;
    status: 'proposed' | 'approved' | 'rejected' | 'in_progress' | 'completed';
    deadline?: string;
    created_at: string;
    student?: User;
    supervisor?: User;
    submissions?: Submission[];
    evaluation?: Evaluation;
}

export interface Submission {
    id: number;
    project_id: number;
    student_id: number;
    title: string;
    file_path: string;
    submission_type: 'proposal' | 'milestone' | 'final';
    submitted_at: string;
}

export interface Evaluation {
    id: number;
    project_id: number;
    evaluator_id: number;
    score: number;
    comments: string;
    criteria: any;
}
