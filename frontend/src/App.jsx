import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './hooks/useAuth.jsx';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Library from './pages/Library.jsx';
import StudyMaterials from './pages/StudyMaterials';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCourses from './pages/admin/AdminCourses';
import AdminLibrary from './pages/admin/AdminLibrary';
import AdminStudyMaterials from './pages/admin/AdminStudyMaterials';
import AdminArticles from './pages/admin/AdminArticles';
import AdminContacts from './pages/admin/AdminContacts';
import AdminAdmissions from './pages/admin/AdminAdmissions';
import ProtectedRoute from './components/ProtectedRoute';
import { HelmetProvider } from 'react-helmet-async';
import ArticleDetail from './pages/ArticleDetail.jsx';
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/courses/:id" element={<CourseDetail />} />
                  <Route path="/library" element={<Library />} />
                  <Route path="/articles/:id" element={<ArticleDetail />} />
                  <Route path="/study-materials" element={<StudyMaterials />} />
                  <Route path="/contact" element={<Contact />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/courses" element={
                    <ProtectedRoute>
                      <AdminCourses />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/library" element={
                    <ProtectedRoute>
                      <AdminLibrary />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/study-materials" element={
                    <ProtectedRoute>
                      <AdminStudyMaterials />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/articles" element={
                    <ProtectedRoute>
                      <AdminArticles />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/contacts" element={
                    <ProtectedRoute>
                      <AdminContacts />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/admissions" element={
                    <ProtectedRoute>
                      <AdminAdmissions />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;

