import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ScrollToTop from './components/ScrollToTop';
import AllBlogs from './pages/AllBlogs';
import BlogPost from './pages/BlogPost';
import Admin from './pages/Admin';
import './index.css';

function App() {
  return (
    <Router basename="/srlab.github.io">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<AllBlogs />} />
        <Route path="/blogs/:id" element={<BlogPost />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
