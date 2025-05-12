"use client";
import { useState, useEffect } from "react";
import axios from "axios";
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

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/allproducts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        }
      });
      
      console.log('Product response:', response.data);
      
      // Check if productsData exists in the response
      if (response.data && response.data.productsData) {
        setProducts(response.data.productsData);
      } else if (Array.isArray(response.data)) {
        // If response.data is directly an array
        setProducts(response.data);
      } else {
        console.error('Unexpected data format:', response.data);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      // Show a more user-friendly error message
      alert(error.response?.data?.message || 'Failed to fetch products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

 

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center rounded-xl p-6 shadow-md" style={{ backgroundColor: COLORS.secondary, borderBottom: `1px solid ${COLORS.border}` }}>
          <div>
            <h1 className="text-xl font-semibold" style={{ color: COLORS.text }}>Products</h1>
            <p className="text-sm mt-1" style={{ color: COLORS.textMuted }}>
              Manage your product inventory
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
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
            
            <button 
              onClick={fetchProducts}
              className="px-4 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center mr-2" 
              style={{ 
                backgroundColor: COLORS.background,
                color: COLORS.text
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            
            <button className="px-4 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center" 
              style={{ 
                backgroundColor: COLORS.primary,
                color: COLORS.text
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Product
            </button>
          </div>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2" style={{ borderColor: COLORS.primary }}></div>
            <span className="ml-3 text-white">Loading products...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-black/25 p-4 rounded-lg text-center">
            <p className="text-white text-lg">No products found</p>
            <button 
              onClick={fetchProducts}
              className="mt-4 px-4 py-2 rounded" 
              style={{ backgroundColor: COLORS.primary, color: 'white' }}
            >
              Refresh Products
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-md" style={{ backgroundColor: COLORS.secondary }}>
            <table className="min-w-full divide-y" style={{ borderColor: COLORS.border }}>
              <thead>
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
                    Image
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
                    Product
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
                    Category
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
                    Price
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
                    Stock
                  </th>

                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: COLORS.border }}>
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-black/20">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-14 w-14 rounded-md flex items-center justify-center overflow-hidden" style={{ backgroundColor: COLORS.background }}>
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `/placeholder.jpg`;
                              console.log('Image failed to load:', product.image);
                            }}
                          />
                        ) : (
                          <span className="text-lg font-bold" style={{ color: COLORS.primary }}>{product.name ? product.name.substring(0, 2).toUpperCase() : 'PR'}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium" style={{ color: "#ffffff" }}>{product.name}</div>
                          <div className="text-xs" style={{ color: COLORS.textMuted }}>ID: {product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: "#ffffff" }}>
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: "#ffffff" }}>
                      ${product.price ? (typeof product.price === 'number' ? product.price.toFixed(2) : product.price) : '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: "#ffffff" }}>
                      {product.stock}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
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

export default ProductsPage;
