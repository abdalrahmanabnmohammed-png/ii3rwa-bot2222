"use client";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6" dir="rtl">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] text-center">
        <h1 className="text-4xl font-black text-white mb-8 text-[#A62DC9]">ii3RwA System</h1>
        <p className="text-gray-400 mb-10">يرجى تسجيل الدخول بحساب ديسكورد للوصول للوحة التحكم</p>
        
        <button 
          onClick={() => signIn('discord', { callbackUrl: '/security' })}
          className="w-full bg-[#5865F2] hover:bg-[#4752C4] py-4 rounded-2xl font-bold text-xl text-white flex items-center justify-center gap-3 transition-all"
        >
          <span>تسجيل الدخول عبر Discord</span>
        </button>
      </div>
    </div>
  );
}
