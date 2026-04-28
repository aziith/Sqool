import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../../config';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { FileText, Calendar, CheckCircle, TrendingUp, Users, Award } from 'lucide-react';

const ExamsDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const institutionId = localStorage.getItem('sqool_institution_id') || 1;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_BASE}/exams/dashboard?institution_id=${institutionId}`);
                setData(response.data);
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [institutionId]);

    if (loading) return <div className="p-8 text-center">Loading Analytics...</div>;

    const COLORS = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b'];

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Exam Analytics Dashboard</h1>
                <div className="text-sm text-gray-500">Academic Year 2024-25</div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<FileText className="text-indigo-600" />} label="Total Exams" value={data?.stats.totalExams || 0} color="bg-indigo-50" />
                <StatCard icon={<Calendar className="text-orange-600" />} label="Upcoming" value={data?.stats.upcomingExams || 0} color="bg-orange-50" />
                <StatCard icon={<CheckCircle className="text-emerald-600" />} label="Completed" value={data?.stats.completedExams || 0} color="bg-emerald-50" />
                <StatCard icon={<TrendingUp className="text-purple-600" />} label="Avg. Result" value={`${data?.stats.avgResult || 0}%`} color="bg-purple-50" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pass vs Fail Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Users size={20} className="text-gray-400" /> Pass vs Fail Analysis
                    </h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data?.charts.passFail || []}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data?.charts.passFail.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Class Wise Performance */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <GraduationCap size={20} className="text-gray-400" /> Class-wise Performance
                    </h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.charts.classWise || []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: '#f9fafb' }} />
                                <Bar dataKey="avg" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Subject Performance Mockup */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Award size={20} className="text-gray-400" /> Subject-wise Distribution
                </h2>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[
                            { name: 'Math', score: 85 },
                            { name: 'Science', score: 78 },
                            { name: 'English', score: 82 },
                            { name: 'History', score: 74 },
                            { name: 'Physics', score: 80 },
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <div className={`p-4 rounded-xl flex items-center gap-4 ${color}`}>
        <div className="p-3 bg-white rounded-lg shadow-sm">
            {icon}
        </div>
        <div>
            <div className="text-sm text-gray-500 font-medium">{label}</div>
            <div className="text-xl font-bold text-gray-800">{value}</div>
        </div>
    </div>
);

const GraduationCap = ({ size, className }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
);

export default ExamsDashboard;
