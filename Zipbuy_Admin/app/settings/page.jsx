"use client";
import DashboardLayout from "../../components/DashboardLayout";

// Colors matching our dark theme
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

const SettingsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center rounded-xl p-6 shadow-md" style={{ backgroundColor: COLORS.secondary, borderBottom: `1px solid ${COLORS.border}` }}>
          <div>
            <h1 className="text-xl font-semibold" style={{ color: COLORS.text }}>Settings</h1>
            <p className="text-sm mt-1" style={{ color: COLORS.textMuted }}>
              Manage your account and system settings
            </p>
          </div>

          <button className="px-4 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center" 
            style={{ 
              backgroundColor: COLORS.primary,
              color: COLORS.text
            }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="rounded-xl shadow-md overflow-hidden" style={{ backgroundColor: COLORS.secondary }}>
              <div className="p-4" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <h2 className="text-lg font-medium" style={{ color: COLORS.text }}>Settings Menu</h2>
              </div>
              <div className="p-2">
                <ul>
                  {[
                    { name: "Account Settings", icon: "user" },
                    { name: "Appearance", icon: "eye" },
                    { name: "Notifications", icon: "bell" },
                    { name: "Security", icon: "shield-check" },
                    { name: "API Keys", icon: "key" }
                  ].map((item, index) => (
                    <li key={index}>
                      <button 
                        className={`w-full text-left px-4 py-3 rounded-md flex items-center ${index === 0 ? 'bg-blue-500/20 text-blue-500' : ''}`}
                        style={{ color: index === 0 ? COLORS.primary : COLORS.text }}
                      >
                        <span className="w-5 h-5 mr-3 flex items-center justify-center">
                          {item.icon === "user" && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          )}
                          {item.icon === "eye" && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                          {item.icon === "bell" && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                          )}
                          {item.icon === "shield-check" && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          )}
                          {item.icon === "key" && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                          )}
                        </span>
                        {item.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Settings Form */}
            <div className="rounded-xl shadow-md" style={{ backgroundColor: COLORS.secondary }}>
              <div className="p-4 border-b" style={{ borderColor: COLORS.border }}>
                <h2 className="text-lg font-medium" style={{ color: COLORS.text }}>Account Settings</h2>
              </div>
              <div className="p-6 space-y-6">
                {/* Profile Section */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold" style={{ backgroundColor: COLORS.primary }}>
                    <span style={{ color: COLORS.text }}>A</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium" style={{ color: COLORS.text }}>Admin User</h3>
                    <p className="text-sm" style={{ color: COLORS.textMuted }}>admin@zipbuy.com</p>
                  </div>
                  <button className="px-3 py-1 rounded text-sm ml-auto" style={{ backgroundColor: COLORS.background, color: COLORS.text, border: `1px solid ${COLORS.border}` }}>
                    Change
                  </button>
                </div>
                
                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: COLORS.textMuted }}>Full Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 rounded-lg" 
                      style={{ backgroundColor: COLORS.background, color: COLORS.text, border: `1px solid ${COLORS.border}` }}
                      defaultValue="Admin User"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: COLORS.textMuted }}>Email Address</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-2 rounded-lg" 
                      style={{ backgroundColor: COLORS.background, color: COLORS.text, border: `1px solid ${COLORS.border}` }}
                      defaultValue="admin@zipbuy.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: COLORS.textMuted }}>Role</label>
                    <select 
                      className="w-full px-4 py-2 rounded-lg" 
                      style={{ backgroundColor: COLORS.background, color: COLORS.text, border: `1px solid ${COLORS.border}` }}
                    >
                      <option>Administrator</option>
                      <option>Store Manager</option>
                      <option>Support Staff</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: COLORS.textMuted }}>Time Zone</label>
                    <select 
                      className="w-full px-4 py-2 rounded-lg" 
                      style={{ backgroundColor: COLORS.background, color: COLORS.text, border: `1px solid ${COLORS.border}` }}
                    >
                      <option>(GMT+01:00) Central European Time</option>
                      <option>(GMT+00:00) Greenwich Mean Time</option>
                      <option>(GMT-05:00) Eastern Time (US & Canada)</option>
                      <option>(GMT-08:00) Pacific Time (US & Canada)</option>
                    </select>
                  </div>
                  
                  <div className="pt-4">
                    <button className="px-4 py-2 rounded-lg text-sm font-medium" 
                      style={{ backgroundColor: COLORS.primary, color: COLORS.text }}>
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
