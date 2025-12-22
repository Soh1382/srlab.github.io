import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import BlogSection from '../components/BlogSection';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import ParticleBackground from '../components/ParticleBackground';

const Home = () => {
    return (
        <>
            <ParticleBackground />
            <Navbar />
            <main>
                <Hero />
                <About />
                <BlogSection />
                <Contact />
            </main>
            <Footer />
        </>
    );
};

export default Home;
