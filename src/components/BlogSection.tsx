import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BlogCard from './BlogCard';
import type { Blog } from '../types';

const BlogSection = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await axios.get('/api/blogs');
                setBlogs(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to load blogs.');
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    const recentBlogs = blogs.slice(0, 3);

    return (
        <section id="blog" className="py-20 px-6 bg-gray-900/50 relative z-10">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl font-bold mb-12 text-center">
                    <span className="border-b-4 border-primary pb-2">Latest Blogs</span>
                </h2>

                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {[1, 2, 3].map(i => (
                             <div key={i} className="glass p-6 rounded-xl animate-pulse">
                                <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <p className="text-red-400 mb-12">{error}</p>
                ) : (
                    <>
                         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            {recentBlogs.length > 0 ? (
                                recentBlogs.map(blog => (
                                    <BlogCard key={blog._id} blog={blog} />
                                ))
                            ) : (
                                <p className="text-gray-400 col-span-full text-center">No blogs yet.</p>
                            )}
                        </div>
                        <div className="text-center">
                            <Link to="/blogs" className="btn border border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-full transition text-lg font-semibold inline-block">
                                Show All Blogs
                            </Link>
                        </div>
                    </>
                )}
            </div>


        </section>
    );
};

export default BlogSection;
