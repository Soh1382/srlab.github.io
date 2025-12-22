import { motion } from 'framer-motion';
import { smoothScroll } from '../utils/smoothScroll';

const Hero = () => {
    return (
        <section id="home" className="min-h-screen flex items-center justify-center pt-16 px-6 relative z-10">
            <div className="text-center max-w-3xl">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-bold mb-6 animate-float"
                >
                    Hi, I'm <span className="text-primary">Soheil</span>
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-xl md:text-2xl text-gray-400 mb-8"
                >
                    Software Engineer | UI/UX Enthusiast | Creative Thinker
                </motion.p>
                <motion.a 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    href="#contact"
                    onClick={(e) => smoothScroll(e, 'contact')}
                    className="btn bg-primary hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg inline-block"
                >
                    Get In Touch
                </motion.a>
            </div>
        </section>
    );
};

export default Hero;
