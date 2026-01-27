"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    // سيتم التحقق من البيانات هنا - حالياً سنضع قيم افتراضية للشرح
    if (username === "admin" && password === "123456") {
      localStorage.setItem("isAdmin", "true");
      router.push('/security');
    } else {
      alert("البيانات خاطئة يا بطل!");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-5" dir="rtl">
      <div className="bg-gray-900 p-8 rounded-3xl border border-purple-500/30 shadow-2xl shadow-purple-500/10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-white text-center mb-2">دخول الإدارة 🔐</h1>
        <p className="text-gray-400 text-center mb-8">لوحة تحكم ii3RwA System</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <input 
            type="text" placeholder="اسم المستخدم"
            className="w-full bg-gray-800 border border-gray-700 p-4 rounded-xl text-white focus:border-purple-500 outline-none transition"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input 
            type="password" placeholder="كلمة المرور"
            className="w-full bg-gray-800 border border-gray-700 p-4 rounded-xl text-white focus:border-purple-500 outline-none transition"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-4 rounded-xl font-bold text-xl hover:scale-105 transition transform active:scale-95">
            دخول للمنصة
          </button>
        </form>
      </div>
    </div>
  );
}
