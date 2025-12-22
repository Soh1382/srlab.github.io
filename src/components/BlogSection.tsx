import { useState } from 'react';
import { Link } from 'react-router-dom';
import BlogCard from './BlogCard';
import type { Blog } from '../types';
import { getAllBlogs } from '../utils/blogLoader';

const BlogSection = () => {
    const [blogs] = useState<Blog[]>(() => getAllBlogs().slice(0, 3));



    return (
        <section id="blog" className="py-20 px-6 bg-gray-900/50 relative z-10">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl font-bold mb-12 text-center">
                    <span className="border-b-4 border-primary pb-2">Latest Blogs</span>
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {blogs.length > 0 ? (
                        blogs.map(blog => (
                            <BlogCard key={blog.slug} blog={blog} />
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
            </div>


        </section>
    );
};

export default BlogSection;
