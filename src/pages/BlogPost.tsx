import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ParticleBackground from '../components/ParticleBackground';
import type { Blog } from '../types';

const BlogPost = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await axios.get(`/api/blogs/${id}`);
                setBlog(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to load blog post.');
                setLoading(false);
            }
        };
        if (id) fetchBlog();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-dark text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen bg-dark text-white flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-3xl font-bold mb-4 text-red-500">Error</h1>
                <p className="text-xl text-gray-400 mb-8">{error || 'Blog post not found.'}</p>
                <Link to="/blogs" className="btn bg-primary px-6 py-2 rounded-lg text-white">Back to Blogs</Link>
            </div>
        );
    }

    return (
        <>
            <ParticleBackground />
            <Navbar />
            
            <main className="pt-32 pb-20 px-6 relative z-10 min-h-screen">
                <article className="max-w-4xl mx-auto glass p-8 md:p-12 rounded-3xl">
                    <Link to="/blogs" className="text-primary hover:underline mb-8 inline-block">← Back to Blogs</Link>
                    
                    <header className="mb-8">
                        <span className="text-sm text-gray-400 block mb-2">
                             {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ''}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                            {blog.title}
                        </h1>
                        <div className="h-1 w-20 bg-primary rounded-full"></div>
                    </header>

                    <div className="text-gray-300 whitespace-pre-wrap text-lg leading-relaxed">
                        {blog.content}
                    </div>
                </article>
            </main>

            <Footer />
        </>
    );
};

export default BlogPost;
