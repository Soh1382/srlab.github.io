import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ParticleBackground from '../components/ParticleBackground';
import type { Blog } from '../types';
import { getBlogBySlug } from '../utils/blogLoader';

const BlogPost = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState<Blog | null>(() => {
        return id ? (getBlogBySlug(id) || null) : null;
    });

    useEffect(() => {
        if (id) {
             const foundBlog = getBlogBySlug(id);
             setBlog(foundBlog || null);
        }
    }, [id]);

    if (!blog) {
        return (
            <div className="min-h-screen bg-dark text-white flex flex-col items-center justify-center p-6 text-center">
                <Navbar />
                <h1 className="text-3xl font-bold mb-4 text-red-500">Not Found</h1>
                <p className="text-xl text-gray-400 mb-8">This blog post could not be found.</p>
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
                             {blog.date ? new Date(blog.date).toLocaleDateString() : ''}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                            {blog.title}
                        </h1>
                        <div className="h-1 w-20 bg-primary rounded-full"></div>
                    </header>

                    <div className="text-gray-300 text-lg leading-relaxed prose prose-invert max-w-none">
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{blog.content}</ReactMarkdown>
                    </div>
                </article>
            </main>

            <Footer />
        </>
    );
};

export default BlogPost;
