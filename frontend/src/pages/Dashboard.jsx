import React, { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Bell, Settings, LogOut, Layout, Menu } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import KanbanBoard from "../components/kanban/KanbanBoard";
import CreateProjectModal from "../components/modals/CreateProjectModal";
import NotificationPanel from "../components/NotificationPanel";
import TeamsView from "../components/views/TeamsView";
import CalendarView from "../components/views/CalendarView";
import ProjectsView from "../components/views/ProjectsView";
import { useAuth } from "../context/AuthContext";
import useSocket from "../hooks/useSocket";
import { useInvitations } from "../hooks/useInvitations";

const VALID_VIEWS = ["board", "projects", "teams", "calendar"];

function SelectProjectMessage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="bg-indigo-50 p-6 rounded-[2.5rem] mb-6">
        <Layout className="text-indigo-600" size={48} />
      </div>
      <h3 className="text-2xl font-black text-gray-900 mb-2">Ready to work?</h3>
      <p className="text-gray-500 max-w-xs font-medium">Select a project from the sidebar to view your tasks and start collaborating.</p>
    </div>
  );
}

function ViewButton({ label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${isActive
        ? "bg-white text-indigo-600 shadow-sm border border-gray-100"
        : "text-gray-400 hover:text-gray-600 hover:bg-white/50"
        }`}
    >
      {label}
    </button>
  );
}

export default function ProjectManagementDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const projectId = searchParams.get("project");
  const viewParam = searchParams.get("view");
  const selectedView = VALID_VIEWS.includes(viewParam) ? viewParam : "projects";

  const setSelectedView = (view) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("view", view);
      return next;
    });
  };

  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const bellRef = useRef(null);
  const { user, logout } = useAuth();
  const { invitations } = useInvitations();

  useSocket(projectId, user?.id ?? user?._id);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        selectedView={selectedView}
        setSelectedView={setSelectedView}
        onAddProject={() => setShowCreateProject(true)}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50/50 min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-4 md:px-10 py-5 sticky top-0 z-10 transition-all flex-shrink-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
            <div className="flex items-center gap-4 md:gap-8">
              <button
                className="md:hidden text-gray-500 hover:text-indigo-600 focus:outline-none"
                onClick={() => setIsMobileSidebarOpen(true)}
              >
                <Menu size={24} />
              </button>
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  {projectId ? "Project Space" : "Overview"}
                </h2>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                  {projectId ? "Active Project Tasks" : "Select a project to start"}
                </p>
              </div>
              <div className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                <ViewButton
                  label="Board"
                  isActive={selectedView === "board"}
                  onClick={() => setSelectedView("board")}
                />
                <ViewButton
                  label="Teams"
                  isActive={selectedView === "teams"}
                  onClick={() => setSelectedView("teams")}
                />
                <ViewButton
                  label="Calendar"
                  isActive={selectedView === "calendar"}
                  onClick={() => setSelectedView("calendar")}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6 pb-2 md:pb-0 flex-wrap md:flex-nowrap">
              <div className="relative group hidden lg:block flex-shrink-0">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Find anything..."
                  className="pl-12 pr-6 py-2.5 bg-gray-50 border border-transparent rounded-[1.25rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 focus:bg-white w-72 transition-all placeholder:text-gray-400 placeholder:font-medium text-sm"
                />
              </div>

              <div className="flex items-center gap-2 md:gap-3 pr-4 md:pr-6 border-r border-gray-100 flex-shrink-0">
                <div className="relative" ref={bellRef}>
                  <button
                    type="button"
                    onClick={() => setShowNotifications((v) => !v)}
                    className="p-2 md:p-2.5 hover:bg-gray-50 text-gray-500 hover:text-indigo-600 rounded-xl transition-all relative border border-transparent hover:border-gray-100"
                    aria-label="Notifications"
                  >
                    <Bell size={20} />
                    {invitations?.length > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 flex items-center justify-center bg-indigo-600 text-white text-[10px] font-black rounded-full ring-4 ring-white">
                        {invitations.length}
                      </span>
                    )}
                  </button>
                  <NotificationPanel
                    isOpen={showNotifications}
                    onClose={() => setShowNotifications(false)}
                    anchorRef={bellRef}
                  />
                </div>
                <button className="p-2 md:p-2.5 hover:bg-gray-50 text-gray-500 hover:text-indigo-600 rounded-xl transition-all border border-transparent hover:border-gray-100">
                  <Settings size={20} />
                </button>
              </div>

              <div className="flex items-center gap-2 md:gap-3 pl-2 flex-shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-gray-900 leading-none">{user?.name}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Admin Account</p>
                </div>
                <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-indigo-100 cursor-pointer transform hover:scale-105 transition-transform active:scale-95">
                  <div className="w-full h-full rounded-[0.875rem] bg-white flex items-center justify-center text-indigo-600 font-black text-lg">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 md:p-2.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-xl transition-all border border-transparent hover:border-red-100"
                  title="Sign Out"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-hidden p-4 md:p-8 overflow-y-auto">
          {selectedView === "projects" && <ProjectsView onAddProject={() => setShowCreateProject(true)} />}
          {selectedView === "board" && (projectId ? <KanbanBoard projectId={projectId} /> : <SelectProjectMessage />)}
          {selectedView === "teams" && (projectId ? <TeamsView projectId={projectId} /> : <SelectProjectMessage />)}
          {selectedView === "calendar" && (projectId ? <CalendarView projectId={projectId} /> : <SelectProjectMessage />)}
        </div>
      </div>

      {showCreateProject && (
        <CreateProjectModal onClose={() => setShowCreateProject(false)} />
      )}
    </div>
  );
}
