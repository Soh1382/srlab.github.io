import matter from 'gray-matter';
import type { Blog } from '../types';

export const getAllBlogs = (): Blog[] => {
    const modules = import.meta.glob('../content/blogs/*.md', { eager: true, as: 'raw' });
    
    const blogs: Blog[] = Object.keys(modules).map((path) => {
        const slug = path.split('/').pop()?.replace('.md', '') || '';
        const { data, content } = matter(modules[path]);
        
        return {
            slug,
            title: data.title || 'Untitled',
            date: data.date || new Date().toISOString(),
            description: data.description || '',
            content
        };
    });

    // Sort by date descending
    return blogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getBlogBySlug = (slug: string): Blog | undefined => {
    const blogs = getAllBlogs();
    return blogs.find((blog) => blog.slug === slug);
};
