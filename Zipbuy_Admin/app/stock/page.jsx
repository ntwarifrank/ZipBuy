"use client";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";

// Search icon component
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

// Function to truncate text
const truncateText = (text, maxLength) => {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

const CheckStock = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fetch products data
  async function fetchProducts() {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/allproducts`);
      const productsData = response.data.productsData || [];
      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
      setErrorMessage(error?.response?.data?.message || "Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = products.filter(product => 
      product.productName?.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  return (
    <div>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white rounded-xl p-6 shadow-md">
            <div>
              <h1 className="text-2xl font-bold text-darkGray">Inventory Management</h1>
              <p className="text-darkText mt-1">Manage your product stock</p>
            </div>

            <div className="mt-4 sm:mt-0 flex items-center space-x-2">
              <Link href="/create">
                <button className="px-4 py-2 bg-alibabaOrange text-darkGray font-medium rounded-lg hover:bg-darkGray hover:text-alibabaOrange transition-colors duration-200 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Product
                </button>
              </Link>
            </div>
          </div>

          {/* Search and Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2 bg-white rounded-xl shadow-md p-5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:border-alibabaOrange focus:ring-2 focus:ring-alibabaOrange focus:ring-opacity-50 transition-colors"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-5 flex flex-col justify-center">
              <p className="text-darkText text-sm">Total Products</p>
              <p className="text-3xl font-bold text-darkGray">{products.length}</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-5 flex flex-col justify-center">
              <p className="text-darkText text-sm">Low Stock Items</p>
              <p className="text-3xl font-bold text-red-500">{products.filter(p => parseInt(p.productQuantity) < 10).length}</p>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-darkGray">Products in Stock</h2>
              <span className="px-3 py-1 bg-alibabaOrange/20 text-darkGray rounded-full text-sm font-medium">
                {filteredProducts.length} items
              </span>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-alibabaOrange"></div>
              </div>
            ) : errorMessage ? (
              <div className="p-8 text-center">
                <p className="text-red-500">{errorMessage}</p>
                <button 
                  onClick={fetchProducts} 
                  className="mt-4 px-4 py-2 bg-alibabaOrange text-darkGray rounded-lg hover:bg-darkGray hover:text-alibabaOrange transition-colors duration-200"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="admin-table w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">Image</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-10 text-center text-darkText">
                          {searchQuery ? "No products match your search" : "No products available"}
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product, index) => (
                        <tr key={product._id || index} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-darkGray">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4">
                            <div className="max-w-xs">
                              <p className="font-medium text-darkGray">{truncateText(product.productName, 40)}</p>
                              <p className="text-xs text-darkText mt-1">{product.productCategory}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {product.productImages && product.productImages[0] && (
                              <div className="relative h-16 w-16 rounded-md overflow-hidden">
                                <Image
                                  src={product.productImages[0]}
                                  alt={product.productName}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${parseInt(product.productQuantity) < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                              {product.productQuantity || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium">
                            ${product.productPrice || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex space-x-2">
                              <Link href={`/product/${product._id}`}>
                                <button className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors duration-200">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </button>
                              </Link>
                              
                              <Link href={`/product/edit/${product._id}`}>
                                <button className="p-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-700 transition-colors duration-200">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                              </Link>
                              
                              <Link href={`/product/delete/${product._id}`}>
                                <button className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 transition-colors duration-200">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default CheckStock;
