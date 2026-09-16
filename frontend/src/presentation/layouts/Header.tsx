import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const location = useLocation();
  const { user } = useAuth();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Shorten URL";

      case "/urls":
        return "My URLs";

      default:
        return "Shourl";
    }
  };

  const pageTitle = getPageTitle();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-4 sm:px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          className="rounded-lg p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-base font-semibold text-neutral-900 sm:text-lg">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-neutral-900">
            {user?.name || "User"}
          </p>

          <p className="text-xs text-neutral-500">
            User
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
};

export default Header;
