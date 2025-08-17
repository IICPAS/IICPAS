import { useState } from "react";
import { FaBars, FaSignOutAlt, FaUserCircle, FaTimes } from "react-icons/fa";

const Header = ({ 
  center, 
  onLogout, 
  onToggleSidebar, 
  sidebarOpen, 
  setSidebarOpen 
}) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    onLogout();
    setShowMobileMenu(false);
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:flex items-center justify-between bg-white shadow-sm px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FaBars className="text-xl text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Center Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Welcome back, {center?.name || "Center"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">
              {center?.name || "Center"}
            </p>
            <p className="text-xs text-gray-500">{center?.email}</p>
          </div>
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <FaUserCircle className="text-green-600 text-xl" />
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden bg-white shadow-sm px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FaBars className="text-xl text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">
                Dashboard
              </h1>
              <p className="text-xs text-gray-500">
                {center?.name || "Center"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <FaUserCircle className="text-green-600 text-sm" />
            </div>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {showMobileMenu ? (
                <FaTimes className="text-xl text-gray-600" />
              ) : (
                <FaBars className="text-xl text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-b border-gray-200 z-50">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-800">
                {center?.name || "Center"}
              </p>
              <p className="text-xs text-gray-500">{center?.email}</p>
            </div>
            <div className="px-4 py-2">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
