'use client';

import { useEffect, useState } from 'react';
import api from '../../../lib/axios';
import { Project } from '../../../types';

export default function SupervisorDashboard() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get('/projects');
                setProjects(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const handleApprove = async (id: number) => {
        if (!confirm('Approve this project?')) return;
        try {
            await api.put(`/projects/${id}`, { status: 'approved' });
            // Refresh list
            setProjects(projects.map(p => p.id === id ? { ...p, status: 'approved' } : p));
        } catch (err) {
            alert('Error approving project');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Supervised Projects</h2>
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-4">Title</th>
                            <th className="p-4">Student</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project) => (
                            <tr key={project.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-medium">{project.title}</td>
                                <td className="p-4">{project.student?.name || 'Unknown'}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs ${
                                        project.status === 'approved' ? 'bg-green-100 text-green-800' 
                                        : project.status === 'proposed' ? 'bg-blue-100 text-blue-800' 
                                        : 'bg-gray-100'
                                    }`}>
                                        {project.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button 
                                        onClick={() => window.location.href = `/projects/${project.id}`}
                                        className="text-blue-600 hover:underline mr-4"
                                    >
                                        View
                                    </button>
                                    {project.status === 'proposed' && (
                                        <button 
                                            onClick={() => handleApprove(project.id)}
                                            className="text-green-600 hover:underline"
                                        >
                                            Approve
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {projects.length === 0 && <p className="p-4 text-gray-500">No projects found.</p>}
            </div>
        </div>
    );
}
