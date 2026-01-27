"use client";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6" dir="rtl">
      <div className="absolute w-80 h-80 bg-[#A62DC9] opacity-20 blur-[120px] rounded-full"></div>
      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl text-center">
        <h1 className="text-4xl font-black text-white mb-4 animate-fade-in">ii3RwA <span className="text-[#A62DC9]">System</span></h1>
        <p className="text-gray-400 mb-10">سجل دخولك عبر ديسكورد للتحكم بالبوت</p>
        <button 
          onClick={() => signIn('discord', { callbackUrl: '/security' })}
          className="w-full bg-[#5865F2] hover:bg-[#4752C4] py-4 rounded-2xl font-bold text-xl text-white shadow-lg transition-all transform hover:scale-105"
        >
          الدخول عبر Discord 🚀
        </button>
      </div>
    </div>
  );
}
