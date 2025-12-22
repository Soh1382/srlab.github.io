import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { smoothScroll } from '../utils/smoothScroll';
import { useEffect } from 'react';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname === '/' && location.hash) {
            const id = location.hash.replace('#', '');
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                     // Using smoothScroll logic manually or just native if preferred, 
                     // but smoothScroll utility expects an event. 
                     // Let's use native for hash landing to be safe/simple.
                     element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100); // Small delay to ensure DOM is ready
        }
    }, [location]);

    // Helper to determine if link is active (optional, for future use)
    // const isActive = (path: string) => location.pathname === path;

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    // Smooth scroll for anchor links if on home page
    // Smooth scroll for anchor links if on home page
    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
        e.preventDefault(); // Always prevent default anchor jump
        if (location.pathname === '/') {
            smoothScroll(e, id);
        } else {
            navigate(`/#${id}`);
        }
        setIsMobileMenuOpen(false);
    };
    


    return (
        <nav className="fixed top-6 left-0 right-0 mx-auto max-w-7xl w-[95%] z-50 glass rounded-2xl transition-all duration-300">
            <div className="px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-primary hover:text-white transition">SRLab.</Link>
                
                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-8">
                    {['Home', 'About', 'Blog', 'Contact'].map((item) => (
                        <a 
                            key={item}
                            href={`#${item.toLowerCase()}`} 
                            onClick={(e) => handleScroll(e, item.toLowerCase())}
                            className="relative group hover:text-white transition cursor-pointer text-gray-300"
                        >
                            {item}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                        </a>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-white focus:outline-none" onClick={toggleMobileMenu}>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div id="mobile-menu" className="md:hidden border-t border-gray-700/50 bg-slate-900/90 backdrop-blur-md rounded-b-2xl">
                    <div className="px-6 py-4 space-y-3 flex flex-col">
                        {['Home', 'About', 'Blog', 'Contact'].map((item) => (
                            <a 
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                onClick={(e) => handleScroll(e, item.toLowerCase())}
                                className="hover:text-primary transition py-2 text-gray-300"
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
