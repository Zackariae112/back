import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="py-6 px-4 sm:px-6 lg:px-8 mt-16 rounded-l-xl bg-gray-900 shadow-xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

