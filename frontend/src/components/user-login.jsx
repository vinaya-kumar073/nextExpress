"use client";

import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [user, setUser] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();

    console.log("[LOGIN FRONTEND] Login started");

    setError("");
    setSuccess("");

    // -----------------------------
    // Validate email
    // -----------------------------

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    // -----------------------------
    // Validate password
    // -----------------------------

    if (!password) {
      setError("Password is required");
      return;
    }

    setLoading(true);

    try {
      console.log("[LOGIN FRONTEND] Sending request");

      const response = await fetch("/api/auth/user-login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        // Important for cookies
        credentials: "include",

        body: JSON.stringify({
          email,
          password,
        }),
      });

      console.log("[LOGIN FRONTEND] Response status:", response.status);

      const contentType = response.headers.get("content-type");
    //   const isJson = contentType && contentType.includes("application/json");
      const data = await response.json();

      console.log("[LOGIN FRONTEND] Response data:", data);

      // -----------------------------
      // Handle error
      // -----------------------------

      if (!response.ok) {
        throw new Error(data?.message || `Login failed (Status: ${response.status})`);
      }

      // -----------------------------
      // Login successful
      // -----------------------------

      console.log("[LOGIN FRONTEND] Login successful");

      setUser(data.user);

      setSuccess(data.message || "Login successful");

      // Clear password
      setPassword("");
    } catch (error) {
      console.error("[LOGIN FRONTEND] Login failed:", error);

      setError(error.message || "Unable to login");
    } finally {
      setLoading(false);

      console.log("[LOGIN FRONTEND] Login request completed");
    }
  };

  const handleLogout = async () => {
    console.log("[LOGOUT FRONTEND] Logout started");

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      console.log("[LOGOUT FRONTEND] Sending logout request");

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      console.log("[LOGOUT FRONTEND] Response status:", response.status);

      const data = await response.json();

      console.log("[LOGOUT FRONTEND] Response data:", data);

      if (!response.ok) {
        throw new Error(data.message || "Logout failed");
      }

      console.log("[LOGOUT FRONTEND] Logout successful");

      // Clear frontend authentication state
      setUser(null);

      setEmail("");
      setPassword("");

      setSuccess("");
    } catch (error) {
      console.error("[LOGOUT FRONTEND] Logout failed:", error);

      setError(error.message || "Unable to logout");
    } finally {
      setLoading(false);

      console.log("[LOGOUT FRONTEND] Logout request completed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Login</h1>

          <p className="text-gray-500 mt-2">Login to your account</p>
        </div>

        {!user ? (
          <form onSubmit={handleLogin}>
            {/* Email */}

            <div className="mb-5">
              <label className="block mb-2 font-semibold text-gray-700">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
            </div>

            {/* Password */}

            <div className="mb-5">
              <label className="block mb-2 font-semibold text-gray-700">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
            </div>

            {/* Error */}

            {error && (
              <div className="mb-5 p-4 rounded-lg bg-red-100 border border-red-200 text-red-700">
                {error}
              </div>
            )}

            {/* Login button */}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          <div>
            {/* Success */}

            <div className="p-4 rounded-lg bg-green-100 border border-green-200 text-green-700 mb-6">
              ✓ {success || "Login successful"}
            </div>

            {/* User information */}

            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                User Information
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between gap-4 py-3 border-b">
                  <span className="font-semibold text-gray-700">Name</span>

                  <span className="text-gray-600">{user.name || "N/A"}</span>
                </div>

                <div className="flex justify-between gap-4 py-3 border-b">
                  <span className="font-semibold text-gray-700">Email</span>

                  <span className="text-gray-600">{user.email || "N/A"}</span>
                </div>

                <div className="flex justify-between gap-4 py-3 border-b">
                  <span className="font-semibold text-gray-700">Role</span>

                  <span className="text-gray-600">
                    {Array.isArray(user.roles)
                      ? user.roles.join(", ")
                      : user.roles || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between gap-4 py-3">
                  <span className="font-semibold text-gray-700">User ID</span>

                  <span className="text-gray-600 break-all">
                    {user.userId || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Authentication status */}

            <div className="p-4 rounded-lg bg-gray-100 mb-5">
              <div className="flex justify-between">
                <span className="font-semibold">Authentication</span>

                <span className="text-green-700 font-bold">Authenticated</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loading}
              className="w-full py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging out..." : "Logout"}
            </button>

            <p className="text-sm text-gray-500 text-center">
              JWT is stored securely in an HttpOnly cookie.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
