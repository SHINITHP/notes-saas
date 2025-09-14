"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginPage from "@/components/login";

export default function Login() {
  

  return (
    // <div className="flex items-center justify-center min-h-screen">
    //   <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md">
    //     <h2 className="text-2xl mb-4">Login</h2>
    //     {error && <p className="text-red-500">{error}</p>}
    //     <input
    //       type="email"
    //       value={email}
    //       onChange={(e) => setEmail(e.target.value)}
    //       placeholder="Email"
    //       className="border p-2 mb-4 w-full"
    //       required
    //     />
    //     <input
    //       type="password"
    //       value={password}
    //       onChange={(e) => setPassword(e.target.value)}
    //       placeholder="Password"
    //       className="border p-2 mb-4 w-full"
    //       required
    //     />
    //     <button type="submit" className="bg-blue-500 text-white p-2 w-full">
    //       Login
    //     </button>
    //   </form>
    // </div>
    <LoginPage />
  );
}
