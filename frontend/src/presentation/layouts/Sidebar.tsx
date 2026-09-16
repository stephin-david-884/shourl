import {
  Link,
  List,
  LogOut,
  X,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({
  isSidebarOpen,
  toggleSidebar,
}: SidebarProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login");
    }
  };

  const navigationItems = [
    {
      label: "Shorten URL",
      path: "/dashboard",
      icon: Link,
    },
    {
      label: "My URLs",
      path: "/urls",
      icon: List,
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={toggleSidebar}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex w-64 flex-col
          border-r border-neutral-200 bg-white
          transition-transform duration-300
          lg:static lg:translate-x-0
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-5">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-sm">
              S
            </div>

            <span className="text-lg font-bold tracking-tight text-neutral-900">
              Shourl
            </span>
          </button>

          <button
            type="button"
            onClick={toggleSidebar}
            className="rounded-lg p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Workspace
          </p>

          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    toggleSidebar();
                  }
                }}
                className={({ isActive }) =>
                  `
                    group flex items-center gap-3 rounded-xl px-3 py-2.5
                    text-sm font-medium transition-all
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                    }
                  `
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`
                        h-5 w-5
                        ${
                          isActive
                            ? "text-blue-600"
                            : "text-neutral-400 group-hover:text-neutral-600"
                        }
                      `}
                    />

                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-neutral-200 p-3">
          <div className="mb-2 rounded-xl bg-neutral-50 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-neutral-900">
                  {user?.name || "User"}
                </p>

                <p className="truncate text-xs text-neutral-500">
                  {user?.email || ""}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-5 w-5" />

            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;