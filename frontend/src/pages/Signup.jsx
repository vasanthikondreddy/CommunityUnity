import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import { User, Mail, Lock, UserCheck } from "lucide-react";

// ✅ Validation Schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required").min(3),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required(),
  role: yup.string().oneOf(["volunteer", "organizer", "admin"]),
});

const Signup = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, data);
      toast.success("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          Create Your Account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div className="flex flex-col">
            <div className="flex items-center border px-3 py-2 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500">
              <User className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type="text"
                placeholder="Full Name"
                {...register("name")}
                className="w-full bg-transparent outline-none text-gray-700"
              />
            </div>
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <div className="flex items-center border px-3 py-2 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500">
              <Mail className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type="email"
                placeholder="Email Address"
                {...register("email")}
                className="w-full bg-transparent outline-none text-gray-700"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <div className="flex items-center border px-3 py-2 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500">
              <Lock className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type="password"
                placeholder="Password"
                {...register("password")}
                className="w-full bg-transparent outline-none text-gray-700"
              />
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Role */}
          <div className="flex flex-col">
            <div className="flex items-center border px-3 py-2 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500">
              <UserCheck className="text-gray-400 w-5 h-5 mr-2" />
              <select
                {...register("role")}
                className="w-full bg-transparent outline-none text-gray-700"
              >
                <option value="volunteer">Volunteer</option>
                <option value="organizer">Organizer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
              isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        
      </motion.div>
    </div>
  );
};

export default Signup;
