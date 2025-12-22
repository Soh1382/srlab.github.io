

const About = () => {
    return (
        <section id="about" className="py-20 px-6 relative z-10">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl font-bold mb-12 text-center">
                    <span className="border-b-4 border-primary pb-2">About Me</span>
                </h2>
                <div className="max-w-4xl mx-auto">
                    <div className="glass p-8 md:p-12 rounded-2xl flex flex-col items-center text-center">
                        <p className="text-gray-300 leading-relaxed text-lg mb-8 max-w-3xl">
                            I engineer distinct, high-performance web and mobile applications that stand out. 
                            With a relentless focus on clean architecture and immersive user experiences, 
                            I build robust digital solutions that seamlessly bridge the gap between complex 
                            functionality and stunning design.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            {['JavaScript', 'React', 'React Native', 'Node.js', 'MongoDB', 'Tailwind CSS'].map(skill => (
                                <span key={skill} className="bg-gray-800 px-4 py-2 rounded-full text-sm text-primary">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
