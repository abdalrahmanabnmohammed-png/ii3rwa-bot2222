"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // البيانات الافتراضية للتجربة (يمكنك تغييرها لاحقاً)
    if (username === "admin" && password === "123456") {
      localStorage.setItem("isAdmin", "true");
      window.location.href = '/security'; // استخدام التحويل المباشر لضمان النجاح
    } else {
      alert("البيانات خاطئة!");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6" dir="rtl">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-2xl">
        <h1 className="text-3xl font-black text-white text-center mb-8">دخول الإدارة 🔐</h1>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <input 
            type="text" 
            placeholder="اسم المستخدم"
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#A62DC9]"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="كلمة المرور"
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#A62DC9]"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-[#A62DC9] py-4 rounded-xl font-bold text-xl hover:scale-105 transition shadow-lg shadow-[#A62DC9]/20">
            دخول للمنصة 🚀
          </button>
        </form>
      </div>
    </div>
  );
}
