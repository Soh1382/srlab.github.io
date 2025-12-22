import { useState } from 'react';
import axios from 'axios';

import type { Blog } from '../types';

const Admin = () => {
    const [key, setKey] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState({ msg: '', type: '' });
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    const fetchBlogs = async () => {
        try {
            const res = await axios.get('/api/blogs');
            setBlogs(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const verifyKey = () => {
        if (key === '13822004') {
            setIsAuthenticated(true);
            fetchBlogs();
        } else {
            alert('Access Denied!');
            setKey('');
        }
    };

    const handleEdit = (blog: Blog) => {
        setTitle(blog.title);
        setContent(blog.content);
        setEditingId(blog._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this blog?')) return;
        try {
            await axios.delete(`/api/blogs/${id}`, { data: { key } });
            setBlogs(blogs.filter(b => b._id !== id));
            setStatus({ msg: 'Blog deleted.', type: 'text-green-400' });
        } catch (err) {
            alert('Failed to delete.');
        }
    };

    const handleCancelEdit = () => {
        setTitle('');
        setContent('');
        setEditingId(null);
    };

    const handleSubmit = async () => {
        if (!title || !content) {
            setStatus({ msg: 'Please fill in all fields.', type: 'text-red-400' });
            return;
        }

        setStatus({ msg: 'Publishing...', type: 'text-blue-400' });

        try {
            if (editingId) {
                await axios.put(`/api/blogs/${editingId}`, { title, content, key });
                setStatus({ msg: 'Success! Blog Updated.', type: 'text-green-400' });
                setEditingId(null);
            } else {
                await axios.post('/api/blogs', { title, content, key });
                setStatus({ msg: 'Success! Blog Published.', type: 'text-green-400' });
            }
            setTitle('');
            setContent('');
            fetchBlogs();
        } catch (err: unknown) {
            let errorMsg = 'An unexpected error occurred.';
            if (axios.isAxiosError(err) && err.response?.data?.error) {
                errorMsg = err.response.data.error;
            } else if (err instanceof Error) {
                errorMsg = err.message;
            }
            setStatus({ msg: 'Error: ' + errorMsg, type: 'text-red-500' });
        }
    };

    return (
        <div className="min-h-screen bg-dark text-white font-sans antialiased flex flex-col items-center p-6">
            <div className="max-w-4xl w-full glass p-8 rounded-2xl border border-gray-700 shadow-2xl bg-gray-900/50 backdrop-blur-xl mb-12">
                <h1 className="text-3xl font-bold mb-6 text-center text-primary">Admin Panel</h1>
                
                {!isAuthenticated ? (
                    <div id="auth-layer">
                        <p className="text-gray-400 mb-4 text-center">Enter Access Key to continue.</p>
                        <input 
                            type="password" 
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            placeholder="Access Key" 
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 mb-4 text-white focus:ring-2 focus:ring-primary outline-none text-center tracking-widest"
                        />
                        <button onClick={verifyKey} className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition">
                            Authenticate
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-2">
                             <h2 className="text-xl font-semibold">{editingId ? 'Edit Blog' : 'Create New Blog'}</h2>
                             {editingId && <button onClick={handleCancelEdit} className="text-sm text-red-400 hover:text-red-300">Cancel Edit</button>}
                        </div>
                        <input 
                            type="text" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Blog Title" 
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 mb-4 text-white focus:ring-2 focus:ring-primary outline-none"
                        />
                        <textarea 
                            rows={6} 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your blog content here..." 
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 mb-4 text-white focus:ring-2 focus:ring-primary outline-none"
                        ></textarea>
                        
                        <div className="flex gap-4">
                            <button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition">
                                {editingId ? 'Update Blog' : 'Publish Blog'}
                            </button>
                            <button onClick={() => window.location.reload()} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition">
                                Logout
                            </button>
                        </div>
                        {status.msg && <p className={`text-center mt-4 text-sm ${status.type}`}>{status.msg}</p>}
                        
                        <div className="mt-12">
                            <h3 className="text-2xl font-bold mb-6 text-center">Existing Blogs</h3>
                            <div className="space-y-4">
                                {blogs.map(blog => (
                                    <div key={blog._id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center border border-gray-700">
                                        <div>
                                            <h4 className="font-bold text-lg">{blog.title}</h4>
                                            <span className="text-xs text-gray-400">{new Date(blog.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(blog)} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm">Edit</button>
                                            <button onClick={() => handleDelete(blog._id)} className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
                                        </div>
                                    </div>
                                ))}
                                {blogs.length === 0 && <p className="text-gray-500 text-center">No blogs found.</p>}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
