'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Project, Submission } from '../../../types';
import axios from '@/lib/axios'; // Or relative path if alias fails: ../../../lib/axios

export default function StudentDashboard() {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [submissionType, setSubmissionType] = useState('milestone');

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await api.get('/projects');
                if (res.data.data.length > 0) {
                    setProject(res.data.data[0]);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, []);

    const handlePropose = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/projects', { title, description });
            setProject(res.data);
            alert('Proposal Submitted!');
        } catch (err) {
            alert('Failed to submit proposal');
        }
    };

    const handleFileUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !project) return;

        const formData = new FormData();
        formData.append('project_id', project.id.toString());
        formData.append('title', `Submission for ${project.title}`);
        formData.append('submission_type', submissionType);
        formData.append('file', file);

        try {
            await api.post('/submissions', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('File Uploaded Successfully!');
            // Ideally refresh the data here
        } catch (err) {
            alert('Upload failed');
        }
    };

    if (loading) return <div>Loading...</div>;

    if (!project) {
        return (
            <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
                <h2 className="text-2xl font-bold mb-4">Submit Project Proposal</h2>
                <form onSubmit={handlePropose} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Project Title</label>
                        <input 
                            type="text" 
                            className="w-full border p-2 rounded" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Description</label>
                        <textarea 
                            className="w-full border p-2 rounded h-32" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Submit Proposal</button>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
                <h2 className="text-2xl font-bold">{project.title}</h2>
                <p className="text-gray-600 mt-2">{project.description}</p>
                <div className="mt-4 flex gap-4 text-sm">
                    <span className={`px-2 py-1 rounded ${
                        project.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        Status: {project.status.toUpperCase()}
                    </span>
                    {project.supervisor && (
                        <span className="text-gray-500">Supervisor: {project.supervisor.name}</span>
                    )}
                </div>
            </div>

            {/* File Upload Section */}
            <div className="bg-white p-6 rounded shadow">
                <h3 className="text-xl font-bold mb-4">Upload Submission</h3>
                <form onSubmit={handleFileUpload} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Construct</label>
                        <select 
                            className="border p-2 rounded w-full"
                            value={submissionType}
                            onChange={(e) => setSubmissionType(e.target.value)}
                        >
                            <option value="milestone">Milestone / Progress Report</option>
                            <option value="final">Final Report</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">File</label>
                        <input 
                            type="file" 
                            className="w-full border p-2 rounded" 
                            onChange={(e) => setFile(e.target.files?.[0] || null)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Upload File</button>
                </form>
            </div>

            {/* Submissions List (Placeholder) */}
            <div className="bg-white p-6 rounded shadow">
                 <h3 className="text-xl font-bold mb-4">Submission History</h3>
                 {/* Map through submissions here if fetched */}
                 <p className="text-gray-500 italic">No historical submissions loaded.</p>
            </div>
        </div>
    );
}
