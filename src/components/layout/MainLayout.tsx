import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar, BottomNav } from './Sidebar';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-earth-50">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-3 sm:p-6 lg:p-8 pb-20 lg:pb-8 overflow-x-hidden">
          <div className="animate-fade-in-up">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <BottomNav />
    </div>
  );
}
