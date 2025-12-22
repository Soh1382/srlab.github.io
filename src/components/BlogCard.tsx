import { Link } from 'react-router-dom';
import type { Blog } from '../types';

interface BlogCardProps {
    blog: Blog;
    // onClick prop is no longer needed but kept optional to avoid strict breaking if passed elsewhere
    onClick?: (blog: Blog) => void;
}

const BlogCard = ({ blog }: BlogCardProps) => {
    return (
        <Link 
            to={`/blogs/${blog._id}`}
            className="glass p-6 rounded-xl hover:-translate-y-2 transition duration-300 flex flex-col h-full cursor-pointer block text-left"
        >
            <span className="text-xs text-primary font-bold tracking-wider">
                {new Date(blog.createdAt).toLocaleDateString()}
            </span>
            <h3 className="text-xl font-bold mt-2 mb-3 text-white">{blog.title}</h3>
            <p className="text-gray-400 text-sm line-clamp-3 mb-4 flex-grow">{blog.content}</p>
            <span className="text-primary text-sm font-semibold hover:underline mt-auto">Read more →</span>
        </Link>
    );
};

export default BlogCard;
