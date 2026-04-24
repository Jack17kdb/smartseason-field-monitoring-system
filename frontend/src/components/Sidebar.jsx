import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Rows3, LogOut, Sprout, ChevronLeft, ChevronRight } from 'lucide-react';
import useAuthStore from '../stores/useAuthStore';

const NavItem = ({ to, end, icon, label, collapsed }) => (
  <NavLink
    to={to}
    end={end}
    title={collapsed ? label : undefined}
    className={({ isActive }) =>
      `flex items-center gap-2.5 rounded-xl text-sm font-medium transition-colors duration-150 border ${
        isActive
          ? 'bg-forest-400/10 text-forest-300 border-forest-400/20'
          : 'text-ink-secondary border-transparent hover:bg-forest-800 hover:text-ink-primary'
      }`
    }
    style={{ padding: '10px 12px', justifyContent: collapsed ? 'center' : 'flex-start' }}
  >
    <span className="shrink-0">{icon}</span>
    {!collapsed && <span className="truncate">{label}</span>}
  </NavLink>
);

const Sidebar = ({ collapsed, onToggle }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  const handleLogout = async () => { await logout(); navigate('/login'); };

  const W = collapsed ? 64 : 240;

  return (
    <aside
      style={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        width: W, transition: 'width 0.2s ease',
        overflow: 'hidden',
      }}
      className="bg-forest-850 border-r border-border-subtle flex flex-col py-6 z-50"
    >
      <div
        style={{ padding: collapsed ? '0 8px' : '0 16px', marginBottom: 36 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-forest-500 to-forest-300 flex items-center justify-center shrink-0">
            <Sprout size={15} color="#0a1510" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-display font-bold text-sm text-ink-primary tracking-wide truncate">SMARTSEASON</p>
              <p className="text-[10px] text-ink-muted uppercase tracking-widest">{isAdmin ? 'Coordinator' : 'Field Agent'}</p>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            onClick={onToggle}
            title="Collapse sidebar"
            className="flex items-center justify-center w-7 h-7 rounded-lg text-ink-muted border border-border-subtle bg-forest-800 hover:text-ink-primary hover:border-border-mid transition-all cursor-pointer shrink-0"
          >
            <ChevronLeft size={13} />
          </button>
        )}
      </div>

      {collapsed && (
        <div className="flex justify-center mb-5" style={{ padding: '0 8px' }}>
          <button
            onClick={onToggle}
            title="Expand sidebar"
            className="flex items-center justify-center w-7 h-7 rounded-lg text-ink-muted border border-border-subtle bg-forest-800 hover:text-ink-primary hover:border-border-mid transition-all cursor-pointer"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      )}

      <nav
        style={{ padding: collapsed ? '0 8px' : '0 16px' }}
        className="flex flex-col gap-1 flex-1"
      >
        {!collapsed && (
          <p className="text-[10px] text-ink-muted uppercase tracking-widest px-3 mb-2">Navigation</p>
        )}
        {isAdmin ? (
          <>
            <NavItem to="/admin" end icon={<LayoutDashboard size={15} />} label="Dashboard" collapsed={collapsed} />
            <NavItem to="/admin/fields" icon={<Rows3 size={15} />} label="All Fields" collapsed={collapsed} />
          </>
        ) : (
          <NavItem to="/dashboard" icon={<LayoutDashboard size={15} />} label="My Fields" collapsed={collapsed} />
        )}
      </nav>

      <div
        style={{ padding: collapsed ? '16px 8px 0' : '16px 16px 0' }}
        className="border-t border-border-subtle"
      >
        {!collapsed ? (
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-forest-800 mb-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-forest-600 to-forest-400 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-ink-primary truncate">{user?.username}</p>
              <p className="text-[11px] text-ink-muted truncate">{user?.email}</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-2">
            <div
              title={user?.username}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-forest-600 to-forest-400 flex items-center justify-center text-xs font-bold text-white"
            >
              {user?.username?.[0]?.toUpperCase()}
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          title={collapsed ? 'Sign out' : undefined}
          style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-ink-muted rounded-xl border border-transparent transition-all duration-150 hover:text-red-400 hover:bg-red-500/8 hover:border-red-500/20 cursor-pointer"
        >
          <LogOut size={14} className="shrink-0" />
          {!collapsed && 'Sign out'}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
