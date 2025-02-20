import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await fetch("https://teamservicesbackend.up.railway.app/login", {
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
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-black to-gray-900">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-opacity-20 bg-black backdrop-blur-md"></div>

      {/* Login Box */}
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

          <div>
            <label htmlFor="password" className="block text-gray-300 text-sm mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 outline-none transition-all duration-200"
              required
            />
          </div>

          {/* Animated Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg "
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
