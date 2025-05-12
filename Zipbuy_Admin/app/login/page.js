"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";
import Cookies from "js-cookie";
import axios from "axios";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if user is already logged in
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      router.push("/homepage");
    }
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      // Use the login utility function from auth.js
      const response = axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}//adminlogin`, {email, password}) // true for admin login
      
      // Redirect to homepage on success
      if(response.status == 201){
        router.push("/homepage");
      }
      else{
        console.log(response)
      }
      
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lightGray to-white p-4">
      <div className="w-full max-w-md mx-auto overflow-hidden rounded-xl shadow-xl bg-white admin-card p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-darkGray">ZipBuy Admin</h1>
          <p className="text-darkText mt-2">Log in to your admin account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-form space-y-5">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-darkGray">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@zipbuy.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-alibabaOrange focus:ring-2 focus:ring-alibabaOrange focus:ring-opacity-50 transition-colors"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-darkGray">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-alibabaOrange focus:ring-2 focus:ring-alibabaOrange focus:ring-opacity-50 transition-colors"
              required
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 px-6 bg-alibabaOrange hover:bg-darkGray text-darkGray hover:text-alibabaOrange font-medium rounded-lg transition-all duration-300 flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <ClipLoader color="#333333" size={20} />
              ) : (
                "Log In"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
