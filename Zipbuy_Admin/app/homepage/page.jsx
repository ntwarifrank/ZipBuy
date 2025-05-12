"use client"
import { useState, useEffect } from "react";
import "./page.css"
import { useRouter } from "next/navigation";
import DashboardLayout from "../../components/DashboardLayout";

// Dashboard stat card icons
const SuppliersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const StockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const ClientsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const OrdersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const HomePage = () => {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    suppliers: { count: 250, change: 12, new: 25 },
    stock: { count: 1250, change: -4, new: 120 },
    clients: { count: 825, change: 8, new: 58 },
    orders: { count: 432, change: 20, new: 40 }
  });

  // Set current date and fetch user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Set current date
        const today = new Date();
        setDate(today.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }));
        
        // Fetch user data
        const user = await getCurrentUser();
        if (user) {
          setUserData(user);
        } else {
          // If getCurrentUser returns null, use a default name
          setUserData({ name: "Admin" });
        }
        
        // We would fetch real stats here in a production app
        // const statsResponse = await fetch('/api/dashboard/stats');
        // const statsData = await statsResponse.json();
        // setStats(statsData);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  

  return (
    <DashboardLayout>
      {loading ? (
        <div className="flex items-center justify-center h-[80vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-alibabaOrange"></div>
        </div>
      ) : (
          <div className="space-y-6">
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div>
                <h1 className="text-xl font-bold text-darkGray">Dashboard Overview</h1>
                <p className="text-sm text-darkText mt-1 flex items-center">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  Welcome back, <span className="font-semibold text-alibabaOrange">{userData?.name || 'Admin'}</span>
                </p>
              </div>

              <div className="flex items-center mt-4 md:mt-0 space-x-3">
                <div className="flex items-center bg-gray-50 rounded-lg p-2 text-darkText border border-gray-100 shadow-sm">
                  <CalendarIcon />
                  <span className="ml-2 text-xs md:text-sm font-medium">{date}</span>
                </div>
                <button className="bg-alibabaOrange text-darkGray font-medium px-3 py-2 text-sm rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New Report
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Suppliers Card */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group">
                <div className="px-6 py-5 relative overflow-hidden">
                  <div className="absolute right-0 top-0 h-24 w-24 bg-alibabaOrange/10 rounded-bl-full transform translate-x-6 -translate-y-6 group-hover:scale-110 transition-transform duration-500"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-darkText text-sm font-medium flex items-center">
                        <span className="inline-block h-2 w-2 rounded-full bg-alibabaOrange mr-2"></span>
                        Total Suppliers
                      </p>
                      <h2 className="text-2xl font-bold text-darkGray mt-2 flex items-baseline">
                        {stats.suppliers.count}
                        <span className="text-green-500 text-sm ml-2 font-medium">+{stats.suppliers.change}%</span>
                      </h2>
                    </div>
                    <div className="p-3 rounded-lg bg-alibabaOrange/20 text-alibabaOrange group-hover:bg-alibabaOrange group-hover:text-white transition-all duration-300 shadow-sm">
                      <SuppliersIcon />
                    </div>
                  </div>
                  <div className="mt-5 flex items-center border-t border-gray-100 pt-3">
                    <div className="flex-1 text-xs font-medium">
                      <span className="text-darkText">25 new partners</span>
                    </div>
                    <span className="text-green-500 bg-green-50 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      Growing
                    </span>
                  </div>
                </div>
              </div>

              {/* Stock Card */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group">
                <div className="px-6 py-5 relative overflow-hidden">
                  <div className="absolute right-0 top-0 h-24 w-24 bg-green-500/10 rounded-bl-full transform translate-x-6 -translate-y-6 group-hover:scale-110 transition-transform duration-500"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-darkText text-sm font-medium flex items-center">
                        <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                        Total Stock
                      </p>
                      <h2 className="text-3xl font-bold text-darkGray mt-2 flex items-baseline">
                        1,890
                        <span className="text-green-500 text-sm ml-2 font-medium">+23%</span>
                      </h2>
                    </div>
                    <div className="p-3 rounded-lg bg-green-100 text-green-600 group-hover:bg-green-500 group-hover:text-white transition-all duration-300 shadow-sm">
                      <StockIcon />
                    </div>
                  </div>
                  <div className="mt-5 flex items-center border-t border-gray-100 pt-3">
                    <div className="flex-1 text-xs font-medium">
                      <span className="text-darkText">132 items low</span>
                    </div>
                    <span className="text-green-500 bg-green-50 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      Healthy
                    </span>
                  </div>
                </div>
              </div>

              {/* Clients Card */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group">
                <div className="px-6 py-5 relative overflow-hidden">
                  <div className="absolute right-0 top-0 h-24 w-24 bg-blue-500/10 rounded-bl-full transform translate-x-6 -translate-y-6 group-hover:scale-110 transition-transform duration-500"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-darkText text-sm font-medium flex items-center">
                        <span className="inline-block h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                        Total Customers
                      </p>
                      <h2 className="text-3xl font-bold text-darkGray mt-2 flex items-baseline">
                        1,257
                        <span className="text-red-500 text-sm ml-2 font-medium">-5%</span>
                      </h2>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-sm">
                      <ClientsIcon />
                    </div>
                  </div>
                  <div className="mt-5 flex items-center border-t border-gray-100 pt-3">
                    <div className="flex-1 text-xs font-medium">
                      <span className="text-darkText">18 new today</span>
                    </div>
                    <span className="text-red-500 bg-red-50 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                      Declining
                    </span>
                  </div>
                </div>
              </div>

              {/* Orders Card */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group">
                <div className="px-6 py-5 relative overflow-hidden">
                  <div className="absolute right-0 top-0 h-24 w-24 bg-purple-500/10 rounded-bl-full transform translate-x-6 -translate-y-6 group-hover:scale-110 transition-transform duration-500"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-darkText text-sm font-medium flex items-center">
                        <span className="inline-block h-2 w-2 rounded-full bg-purple-500 mr-2"></span>
                        Total Orders
                      </p>
                      <h2 className="text-3xl font-bold text-darkGray mt-2 flex items-baseline">
                        854
                        <span className="text-green-500 text-sm ml-2 font-medium">+18%</span>
                      </h2>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-100 text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300 shadow-sm">
                      <OrdersIcon />
                    </div>
                  </div>
                  <div className="mt-5 flex items-center border-t border-gray-100 pt-3">
                    <div className="flex-1 text-xs font-medium">
                      <span className="text-darkText">45 pending</span>
                    </div>
                    <span className="text-green-500 bg-green-50 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      Trending Up
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tables Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Verified Suppliers Table */}
              <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                <div className="border-b border-gray-200">
                  <div className="flex justify-between items-center p-5">
                    <h3 className="text-lg font-semibold text-darkGray">Verified Suppliers</h3>
                    <button className="text-sm text-alibabaOrange hover:underline">View All</button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="admin-table w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">No</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">Supplier Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[1, 2, 3, 4].map((item) => (
                        <tr key={item} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap font-medium text-darkGray">{item}</td>
                          <td className="px-4 py-4 whitespace-nowrap">Ntwari Frank</td>
                          <td className="px-4 py-4 whitespace-nowrap">ntwarifrank100@gmail.com</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <button className="px-3 py-1 bg-alibabaOrange text-darkGray text-sm font-medium rounded hover:bg-darkGray hover:text-alibabaOrange transition-colors duration-200">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Unverified Suppliers Table */}
              <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                <div className="border-b border-gray-200">
                  <div className="flex justify-between items-center p-5">
                    <div className="flex items-center">
                      <h3 className="text-lg font-semibold text-darkGray">Unverified Suppliers</h3>
                      <span className="ml-2 px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-full">20</span>
                    </div>
                    <button className="text-sm text-alibabaOrange hover:underline">View All</button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="admin-table w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">No</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">Supplier Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[1, 2, 3, 4].map((item) => (
                        <tr key={item} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap font-medium text-darkGray">{item}</td>
                          <td className="px-4 py-4 whitespace-nowrap">Ntwari Frank</td>
                          <td className="px-4 py-4 whitespace-nowrap">ntwarifrank100@gmail.com</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <button className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded hover:bg-green-600 transition-colors duration-200">Check</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
    </DashboardLayout>
  );
}

export default HomePage;
