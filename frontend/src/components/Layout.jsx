import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-forest-900">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <main
        style={{ marginLeft: collapsed ? 64 : 240, transition: 'margin-left 0.2s ease' }}
        className="flex-1 min-h-screen p-8 overflow-y-auto"
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
