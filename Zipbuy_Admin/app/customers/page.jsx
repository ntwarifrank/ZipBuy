"use client";
import { useState, useEffect } from "react";
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

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample customer data
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      const mockCustomers = [
        { id: 1, name: "John Doe", email: "john.doe@example.com", orders: 12, totalSpent: 1249.99, status: "Active", lastOrder: "2 days ago" },
        { id: 2, name: "Jane Smith", email: "jane.smith@example.com", orders: 8, totalSpent: 879.50, status: "Active", lastOrder: "1 week ago" },
        { id: 3, name: "Michael Johnson", email: "michael.j@example.com", orders: 5, totalSpent: 532.25, status: "Active", lastOrder: "2 weeks ago" },
        { id: 4, name: "Sarah Williams", email: "sarah.w@example.com", orders: 3, totalSpent: 329.99, status: "Inactive", lastOrder: "1 month ago" },
        { id: 5, name: "Robert Brown", email: "robert.b@example.com", orders: 7, totalSpent: 815.75, status: "Active", lastOrder: "3 days ago" },
        { id: 6, name: "Emily Davis", email: "emily.d@example.com", orders: 2, totalSpent: 159.98, status: "Inactive", lastOrder: "2 months ago" },
        { id: 7, name: "David Miller", email: "david.m@example.com", orders: 9, totalSpent: 945.50, status: "Active", lastOrder: "5 days ago" },
        { id: 8, name: "Lisa Wilson", email: "lisa.w@example.com", orders: 6, totalSpent: 725.00, status: "Active", lastOrder: "1 week ago" },
      ];
      setCustomers(mockCustomers);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center rounded-xl p-6 shadow-md" style={{ backgroundColor: COLORS.secondary, borderBottom: `1px solid ${COLORS.border}` }}>
          <div>
            <h1 className="text-xl font-semibold" style={{ color: COLORS.text }}>Customers</h1>
            <p className="text-sm mt-1" style={{ color: COLORS.textMuted }}>
              Manage your customer database
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search customers..."
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
            
            <button className="px-4 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center" 
              style={{ 
                backgroundColor: COLORS.primary,
                color: COLORS.text
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Customer
            </button>
          </div>
        </div>

        {/* Customer stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl p-6 shadow-md" style={{ backgroundColor: COLORS.secondary }}>
            <div className="flex items-center">
              <div className="mr-4 p-3 rounded-lg" style={{ backgroundColor: `${COLORS.primary}/20` }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" style={{ color: COLORS.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm" style={{ color: COLORS.textMuted }}>Total Customers</p>
                <p className="text-2xl font-bold" style={{ color: COLORS.text }}>8</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl p-6 shadow-md" style={{ backgroundColor: COLORS.secondary }}>
            <div className="flex items-center">
              <div className="mr-4 p-3 rounded-lg" style={{ backgroundColor: `${COLORS.success}/20` }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" style={{ color: COLORS.success }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm" style={{ color: COLORS.textMuted }}>Active Customers</p>
                <p className="text-2xl font-bold" style={{ color: COLORS.text }}>6</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl p-6 shadow-md" style={{ backgroundColor: COLORS.secondary }}>
            <div className="flex items-center">
              <div className="mr-4 p-3 rounded-lg" style={{ backgroundColor: `${COLORS.warning}/20` }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" style={{ color: COLORS.warning }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm" style={{ color: COLORS.textMuted }}>Total Revenue</p>
                <p className="text-2xl font-bold" style={{ color: COLORS.text }}>$5,638.96</p>
              </div>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2" style={{ borderColor: COLORS.primary }}></div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-md" style={{ backgroundColor: COLORS.secondary }}>
            <table className="min-w-full divide-y" style={{ borderColor: COLORS.border }}>
              <thead>
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
                    Orders
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
                    Spent
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
                    Last Order
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: COLORS.border }}>
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-black/20">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.background }}>
                          <span className="text-sm" style={{ color: COLORS.primary }}>{customer.name.charAt(0)}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium" style={{ color: COLORS.text }}>{customer.name}</div>
                          <div className="text-xs" style={{ color: COLORS.textMuted }}>{customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.text }}>
                      {customer.orders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.text }}>
                      ${customer.totalSpent.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.textMuted }}>
                      {customer.lastOrder}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                        style={{ 
                          backgroundColor: 
                            customer.status === "Active" ? `${COLORS.success}/20` : `${COLORS.danger}/20`,
                          color: 
                            customer.status === "Active" ? COLORS.success : COLORS.danger
                        }}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="p-1 rounded hover:bg-black/20" style={{ color: COLORS.primary }}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button className="p-1 rounded hover:bg-black/20" style={{ color: COLORS.primary }}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button className="p-1 rounded hover:bg-black/20" style={{ color: COLORS.danger }}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-between items-center px-6 py-3 rounded-xl shadow-md" style={{ backgroundColor: COLORS.secondary }}>
          <div className="text-sm" style={{ color: COLORS.textMuted }}>
            Showing <span style={{ color: COLORS.text }}>1</span> to <span style={{ color: COLORS.text }}>8</span> of <span style={{ color: COLORS.text }}>8</span> results
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm rounded" style={{ backgroundColor: COLORS.background, color: COLORS.textMuted }}>
              Previous
            </button>
            <button className="px-3 py-1 text-sm rounded" style={{ backgroundColor: COLORS.primary, color: COLORS.text }}>
              1
            </button>
            <button className="px-3 py-1 text-sm rounded" style={{ backgroundColor: COLORS.background, color: COLORS.textMuted }}>
              Next
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomersPage;
