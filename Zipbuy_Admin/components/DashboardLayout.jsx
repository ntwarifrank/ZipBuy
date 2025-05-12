"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

// Define theme colors
const COLORS = {
  primary: "#2563eb", // Blue
  secondary: "#1e293b", // Slate-800
  background: "#0f172a", // Slate-900
  text: "#f8fafc", // Slate-50
  textMuted: "#94a3b8", // Slate-400
  border: "#334155", // Slate-700
  success: "#10b981", // Emerald-500
  danger: "#ef4444", // Red-500
  warning: "#f59e0b", // Amber-500
};

// Dashboard Icon Components
const DashboardIcon = ({ active }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? "text-white" : "text-blue-300"}`} viewBox="0 0 20 20" fill="currentColor">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
);

const ProductsIcon = ({ active }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? "text-white" : "text-blue-300"}`} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
  </svg>
);

const OrdersIcon = ({ active }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? "text-white" : "text-blue-300"}`} viewBox="0 0 20 20" fill="currentColor">
    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
  </svg>
);

const CustomersIcon = ({ active }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? "text-white" : "text-blue-300"}`} viewBox="0 0 20 20" fill="currentColor">
    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
  </svg>
);

const SettingsIcon = ({ active }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? "text-white" : "text-blue-300"}`} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuthentication = async () => {
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        router.push("/login");
      }
    };

    checkAuthentication();
  }, [router]);
  
  // Set sidebar to be open by default
  useEffect(() => {
    setIsSidebarOpen(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  // Navigation links
  const navLinks = [
    { name: "Dashboard", href: "/homepage", icon: DashboardIcon },
    { name: "Products", href: "/products", icon: ProductsIcon },
    { name: "Orders", href: "/orders", icon: OrdersIcon },
    { name: "Customers", href: "/customers", icon: CustomersIcon },
    { name: "Settings", href: "/settings", icon: SettingsIcon },
  ];

  return (
    <div className="h-screen flex overflow-hidden" style={{ backgroundColor: COLORS.background }}>
      {/* Sidebar for desktop */}
      <div 
        className="lg:w-72 hidden lg:block transition-all duration-300 ease-in-out"
      >
        <div className="h-full flex flex-col shadow-lg" style={{ backgroundColor: COLORS.secondary, borderRight: `1px solid ${COLORS.border}` }}>
          {/* Logo */}
          <div className="flex items-center justify-center h-20 px-6" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
            <Link href="/homepage" className="flex items-center">
              <span className={`text-${COLORS.primary} font-bold text-xl ${!isSidebarOpen && "hidden"}`}>
                ZipBuy Admin
              </span>
              {!isSidebarOpen && (
                <span className={`text-${COLORS.primary} font-bold text-xl`}>Z</span>
              )}
            </Link>
          </div>

          {/* Nav Links */}
          <div className="flex-1 flex flex-col overflow-y-auto pt-6 pb-4">
            <nav className="mt-2 flex-1 px-4 space-y-3">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      isActive
                        ? "bg-blue-500/20 text-white border-l-4 border-blue-500"
                        : "text-white hover:bg-blue-500/10 hover:text-white border-l-4 border-transparent"
                    } group flex items-center px-4 py-3.5 text-base font-medium rounded-md transition-all duration-200`}
                  >
                    <item.icon active={isActive} />
                    <span className="ml-3">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4" style={{ borderTop: `1px solid ${COLORS.border}` }}>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-base font-medium rounded-md bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm6.293 11.293a1 1 0 001.414 1.414l4-4a1 1 0 000-1.414l-4-4a1 1 0 00-1.414 1.414L11.586 9H6a1 1 0 100 2h5.586l-2.293 2.293z" clipRule="evenodd" />
              </svg>
              <span className="ml-3 font-semibold">Logout</span>
            </button>
          </div>
          
          {/* Collapse button */}
          <div className="p-4" style={{ borderTop: `1px solid ${COLORS.border}` }}>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-full flex items-center justify-center p-2 rounded-md bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-white transition-colors duration-200"
            >
              <div className="flex items-center">
                {isSidebarOpen ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-2 text-sm font-medium">Collapse Sidebar</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-2 text-sm font-medium">Expand Sidebar</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="lg:hidden fixed inset-0 z-40 flex" style={{ display: isMobileMenuOpen ? "flex" : "none" }}>
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm transition-opacity" 
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>

        {/* Mobile sidebar */}
        <div className="relative flex-1 flex flex-col max-w-xs w-full" style={{ backgroundColor: COLORS.secondary }}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="flex-1 h-0 pt-6 pb-4 overflow-y-auto">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center px-6 py-5 border-b" style={{ borderColor: COLORS.border }}>
              <span className="text-2xl font-bold" style={{ color: "#ffffff" }}>ZipBuy <span style={{ color: COLORS.primary }}>Admin</span></span>
            </div>
            <nav className="mt-6 px-4 space-y-3">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      isActive
                        ? "bg-blue-500/20 text-white border-l-4 border-blue-500"
                        : "text-white hover:bg-blue-500/10 hover:text-white border-l-4 border-transparent"
                    } group flex items-center px-4 py-3.5 text-base font-medium rounded-md`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon active={isActive} />
                    <span className="ml-3">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex p-4" style={{ borderTop: `1px solid ${COLORS.border}` }}>
            <button
              onClick={handleLogout}
              className="flex-shrink-0 group block w-full flex items-center"
            >
              <div className="w-full flex items-center px-4 py-3 text-base font-medium rounded-md bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm6.293 11.293a1 1 0 001.414 1.414l4-4a1 1 0 000-1.414l-4-4a1 1 0 00-1.414 1.414L11.586 9H6a1 1 0 100 2h5.586l-2.293 2.293z" clipRule="evenodd" />
                </svg>
                <span className="ml-3 font-semibold">Logout</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 shadow-md" style={{ backgroundColor: COLORS.secondary, borderBottom: `1px solid ${COLORS.border}` }}>
          <button
            type="button"
            className="lg:hidden px-4 text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex-1 px-6 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-lg font-medium" style={{ color: COLORS.text }}>
                {navLinks.find((link) => link.href === pathname)?.name || "Dashboard"}
              </h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6 space-x-2">
              {/* Quick actions button */}
              <button
                type="button"
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors duration-200"
                style={{ color: COLORS.textMuted }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              
              {/* Profile dropdown */}
              <div className="relative">
                <div>
                  <button
                    type="button"
                    className="flex items-center p-1 rounded-full hover:bg-white/10 transition-colors duration-200"
                  >
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.primary }}>
                      <span className="text-xs font-medium text-white">Admin</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
