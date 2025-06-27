import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // const response = await fetch("https://teamservicesbackend.up.railway.app/login", {
      const response = await fetch("https://teamservices-backend.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      login(data.email, data.role);
      navigate("/Team-Service-UI/", { replace: true });
    } 
    catch (error) {
      setError(error.message);
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-black to-gray-900">
      <div className="absolute inset-0 bg-opacity-20 bg-black backdrop-blur-md"></div>
      <div className="relative bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-600 max-w-sm w-full transform transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-white mb-6 tracking-wide">
          Welcome Back
        </h2>
        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <p className="text-red-400 bg-red-900 bg-opacity-40 p-2 rounded-md text-center">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="email" className="block text-gray-300 text-sm mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 outline-none transition-all duration-200"
              required
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-gray-300 text-sm mb-2">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 outline-none transition-all duration-200 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-gray-400 hover:text-white hover:duration-200"
            >
              {showPassword ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
            </button>
          </div>
          <button
            type="submit" disabled={loading}
            className={`w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg 
              ${loading ? "opacity-50 cursor-not-allowed" : "hover:from-blue-600 hover:to-indigo-600"}`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;