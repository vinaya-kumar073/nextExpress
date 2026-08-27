"use client";

import { useEffect, useState } from "react";

export default function ChangePassword() {
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [passwordConfirmation, setPasswordConfirmation] =
    useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  // --------------------------------
  // Load user email
  // --------------------------------

  useEffect(() => {
    const savedUser =
      localStorage.getItem("user");

    if (!savedUser) {
      return;
    }

    try {
      const user = JSON.parse(savedUser);

      setEmail(user.email || "");
    } catch (error) {
      console.error(
        "[CHANGE PASSWORD] Failed to read user:",
        error
      );
    }
  }, []);

  // --------------------------------
  // Change password
  // --------------------------------

  const handleChangePassword = async (event) => {
    event.preventDefault();

    console.log(
      "[CHANGE PASSWORD] Form submitted"
    );

    setError("");
    setMessage("");

    // --------------------------------
    // Validation
    // --------------------------------

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!currentPassword) {
      setError("Current password is required");
      return;
    }

    if (!newPassword) {
      setError("New password is required");
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "New password must be at least 8 characters"
      );
      return;
    }

    if (!passwordConfirmation) {
      setError(
        "Please confirm your new password"
      );
      return;
    }

    if (newPassword !== passwordConfirmation) {
      setError("New passwords do not match");
      return;
    }

    setLoading(true);

    try {
      console.log(
        "[CHANGE PASSWORD] Sending request..."
      );

      const response = await fetch(
        "/api/auth/change-password",
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,

            currentpassword:
              currentPassword,

            password:
              newPassword,

            password_confirmation:
              passwordConfirmation,
          }),
        }
      );

      console.log(
        "[CHANGE PASSWORD] HTTP status:",
        response.status
      );

      const contentType = response.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");
      const data = isJson ? await response.json() : null;

      console.log(
        "[CHANGE PASSWORD] Response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Failed to change password (Status: ${response.status})`
        );
      }

      setMessage(
        data.message ||
          "Password changed successfully"
      );

      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setPasswordConfirmation("");
    } catch (error) {
      console.error(
        "[CHANGE PASSWORD] Failed:",
        error
      );

      setError(
        error.message ||
          "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 md:p-10">
        {/* Header */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Change Password
          </h1>

          <p className="mt-2 text-gray-500">
            Update your account password
          </p>
        </div>

        {/* Form */}

        <form
          onSubmit={handleChangePassword}
          className="space-y-5"
        >
          {/* Email */}

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          {/* Current Password */}

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Current Password
            </label>

            <input
              type="password"
              value={currentPassword}
              onChange={(event) =>
                setCurrentPassword(
                  event.target.value
                )
              }
              placeholder="Enter current password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          {/* New Password */}

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(event) =>
                setNewPassword(
                  event.target.value
                )
              }
              placeholder="Enter new password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />

            <p className="mt-2 text-sm text-gray-500">
              Minimum 8 characters
            </p>
          </div>

          {/* Confirm Password */}

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Confirm New Password
            </label>

            <input
              type="password"
              value={passwordConfirmation}
              onChange={(event) =>
                setPasswordConfirmation(
                  event.target.value
                )
              }
              placeholder="Confirm new password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          {/* Error */}

          {error && (
            <div className="p-4 rounded-lg bg-red-100 text-red-800">
              {error}
            </div>
          )}

          {/* Success */}

          {message && (
            <div className="p-4 rounded-lg bg-green-100 text-green-800">
              ✓ {message}
            </div>
          )}

          {/* Submit */}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Changing Password..."
              : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}