import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Lessons from "./pages/Lessons.jsx";
import LessonDetail from "./pages/LessonDetail.jsx";
import Labs from "./pages/Labs.jsx";
import LabDetail from "./pages/LabDetail.jsx";
import Tools from "./pages/Tools.jsx";
import Networking from "./pages/Networking.jsx";
import Roadmap from "./pages/Roadmap.jsx";
import Terminal from "./pages/Terminal.jsx";
import LabSetup from "./pages/LabSetup.jsx";
import Resources from "./pages/Resources.jsx";
import Cheatsheets from "./pages/Cheatsheets.jsx";
import Login from "./pages/Login.jsx";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-shell">
      <Navbar onMenu={() => setSidebarOpen((o) => !o)} />
      <div className="app-body">
        <Sidebar open={sidebarOpen} onNavigate={closeSidebar} />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/lessons/:id" element={<LessonDetail />} />
            <Route path="/labs" element={<Labs />} />
            <Route path="/labs/:id" element={<LabDetail />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/networking" element={<Networking />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/terminal" element={<Terminal />} />
            <Route path="/lab-setup" element={<LabSetup />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/cheatsheets" element={<Cheatsheets />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Home />} />
          </Routes>
          <Footer />
        </main>
      </div>
    </div>
  );
}
