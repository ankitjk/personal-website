import { Route, Routes } from 'react-router'
import Layout from './components/Layout.tsx'
import Home from './pages/Home.tsx'
import About from './pages/About.tsx'
import Projects from './pages/Projects.tsx'
import Project from './pages/Project.tsx'
import NotFound from './pages/NotFound.tsx'

// Maps each URL path to a page. Home is a full-screen page on its own;
// every other page renders inside <Layout>, which provides the navbar and footer.
function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route element={<Layout />}>
        <Route path="about" element={<About />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:slug" element={<Project />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
