import { useState } from 'react';
import { useRipple } from '../hooks/useRipple';

const Contact = () => {
    useRipple();
    const [formData, setFormData] = useState({ name: '', message: '' });

    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const subject = encodeURIComponent(`Contact from Portfolio: ${formData.name}`);
        const body = encodeURIComponent(`Name: ${formData.name}\n\nMessage:\n${formData.message}`);
        // REPLACE THE EMAIL BELOW WITH YOUR ACTUAL EMAIL ADDRESS
        window.location.href = `mailto:your-email@example.com?subject=${subject}&body=${body}`;
        
        setStatus('success');
        setFormData({ name: '', message: '' });
    };

    return (
        <section id="contact" className="py-20 px-6 relative z-10">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold mb-8 text-center">Let's Work Together</h2>
                <p className="text-xl text-gray-400 mb-12 text-center">Have a project in mind? Send me a message!</p>
                
                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* Contact Form */}
                    <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl space-y-6">
                        <div>
                            <label className="block text-gray-400 mb-2 text-sm">Your Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary outline-none transition" 
                                placeholder="John Doe" 
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 mb-2 text-sm">Message</label>
                            <textarea 
                                name="message" 
                                rows={4} 
                                value={formData.message}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary outline-none transition" 
                                placeholder="Tell me about your project..."
                            ></textarea>
                        </div>
                        <button 
                            type="submit" 
                            disabled={status === 'sending'}
                            className="btn w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition shadow-lg disabled:opacity-50"
                        >
                            {status === 'sending' ? 'Sending...' : 'Send Message'}
                        </button>
                        {status === 'success' && <p className="text-green-400 text-center">Message sent successfully!</p>}
                        {status === 'error' && <p className="text-red-400 text-center">Failed to send message. Try again.</p>}
                    </form>

                    {/* Social / Info */}
                    <div className="flex flex-col justify-center gap-6 h-full">
                        <div className="glass p-6 rounded-2xl flex items-center gap-4">
                            <span className="text-3xl">📍</span>
                            <div>
                                <h3 className="font-bold text-lg">Location</h3>
                                <p className="text-gray-400">London, UK</p>
                            </div>
                        </div>
                        <a href="https://github.com/Soh1382" target="_blank" rel="noopener noreferrer" className="btn glass p-6 rounded-2xl flex items-center gap-4 hover:border-primary transition group">
                            <span className="text-3xl group-hover:scale-110 transition">🐙</span>
                            <div>
                                <h3 className="font-bold text-lg text-white">GitHub</h3>
                                <p className="text-gray-400">@Soh1382</p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
