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

const Orders = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center rounded-xl p-6 shadow-md" style={{ backgroundColor: COLORS.secondary, borderBottom: `1px solid ${COLORS.border}` }}>
          <div>
            <h1 className="text-xl font-semibold" style={{ color: COLORS.text }}>Orders</h1>
            <p className="text-sm mt-1" style={{ color: COLORS.textMuted }}>
              Manage your customer orders
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders..."
                className="px-4 py-2 pr-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                style={{ 
                  backgroundColor: COLORS.background, 
                  color: COLORS.text,
                  borderColor: COLORS.border,
                  focusRing: COLORS.primary
                }}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3" style={{ color: COLORS.textMuted }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="px-3 py-2 rounded-lg text-sm font-medium flex items-center" 
                style={{ 
                  backgroundColor: COLORS.background,
                  color: COLORS.textMuted,
                  border: `1px solid ${COLORS.border}`
                }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter
              </button>
              <button className="px-3 py-2 rounded-lg text-sm font-medium flex items-center" 
                style={{ 
                  backgroundColor: COLORS.background,
                  color: COLORS.textMuted,
                  border: `1px solid ${COLORS.border}`
                }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Unverified Orders */}
        <div className="rounded-xl shadow-md overflow-hidden" style={{ backgroundColor: COLORS.secondary }}>
          <div className="p-4 border-b" style={{ borderColor: COLORS.border }}>
            <h2 className="text-lg font-medium" style={{ color: COLORS.text }}>Unverified Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y" style={{ borderColor: COLORS.border }}>
              <thead>
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
                    No
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
                    Client Name
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
                    Client Email
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
                    Products
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: COLORS.border }}>
                {[1, 2, 3].map((index) => (
                  <tr key={index} className="hover:bg-black/20">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold" style={{ color: COLORS.text }}>
                      {index}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.text }}>
                      Ntwari Frank
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.textMuted }}>
                      ntwarifrank100@gmail.com
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.text }}>
                      5
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.text }}>
                      $82
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" 
                        style={{ backgroundColor: `${COLORS.warning}/20`, color: COLORS.warning }}>
                        Unverified
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="px-3 py-1 text-xs rounded" style={{ backgroundColor: COLORS.primary, color: COLORS.text }}>
                        Check
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Verified Orders */}
        <div className="rounded-xl shadow-md overflow-hidden" style={{ backgroundColor: COLORS.secondary }}>
          <div className="p-4 border-b" style={{ borderColor: COLORS.border }}>
            <h2 className="text-lg font-medium" style={{ color: COLORS.text }}>Verified Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y" style={{ borderColor: COLORS.border }}>
              <thead>
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
                    No
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
                    Client Name
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
                    Client Email
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
                    Products
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: COLORS.border }}>
                {[1, 2, 3].map((index) => (
                  <tr key={index} className="hover:bg-black/20">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold" style={{ color: COLORS.text }}>
                      {index}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.text }}>
                      Ntwari Frank
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.textMuted }}>
                      ntwarifrank100@gmail.com
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.text }}>
                      5
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.text }}>
                      $82
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" 
                        style={{ backgroundColor: `${COLORS.success}/20`, color: COLORS.success }}>
                        Verified
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="px-3 py-1 text-xs rounded" style={{ backgroundColor: COLORS.primary, color: COLORS.text }}>
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Orders;
