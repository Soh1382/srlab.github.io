import type { Blog } from '../types';

interface BlogModalProps {
    blog: Blog | null;
    isOpen: boolean;
    onClose: () => void;
}

const BlogModal = ({ blog, isOpen, onClose }: BlogModalProps) => {
    if (!isOpen || !blog) return null;

    return (
        <div className="fixed inset-0 z-[60] overflow-y-auto" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm" onClick={onClose}></div>
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-2xl glass text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl border border-gray-700 bg-slate-800">
                    <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                <h3 className="text-3xl font-semibold leading-6 text-white mb-4">{blog.title}</h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-400 mb-4">{new Date(blog.date).toLocaleDateString()}</p>
                                    <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">{blog.content}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-700/50 mt-4">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="btn w-full inline-flex justify-center rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 sm:ml-3 sm:w-auto"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogModal;
