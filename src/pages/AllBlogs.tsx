import { useState, useEffect } from 'react';
import axios from 'axios';
import BlogCard from '../components/BlogCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ParticleBackground from '../components/ParticleBackground';
import type { Blog } from '../types';

const AllBlogs = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        axios.get('/api/blogs')
            .then(res => setBlogs(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <>
            <ParticleBackground />
            <Navbar />

            <main className="pt-32 pb-20 px-6 relative z-10 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-5xl font-bold mb-12 text-center text-white">My <span className="text-primary">Thoughts</span></h1>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.length > 0 ? (
                            blogs.map(blog => (
                                <BlogCard key={blog._id} blog={blog} />
                            ))
                        ) : (
                            <p className="text-gray-400 text-center col-span-full">No blogs published yet.</p>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default AllBlogs;
