"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // تنظيف أي محاولة دخول سابقة عند فتح الصفحة
  useEffect(() => {
    localStorage.removeItem("isAdmin");
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // بيانات الدخول (تأكد من كتابتها هكذا حالياً للتجربة)
    const ADMIN_USER = "admin";
    const ADMIN_PASS = "123456";

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      // 1. تخزين حالة الدخول في المتصفح
      localStorage.setItem("isAdmin", "true");
      
      // 2. إظهار رسالة نجاح بسيطة
      console.log("تم تسجيل الدخول بنجاح، جاري التحويل...");

      // 3. التحويل لصفحة الحماية (محاولتين لضمان العمل)
      router.push('/security'); 
      setTimeout(() => {
        window.location.href = '/security';
      }, 800);
      
    } else {
      setError("❌ اسم المستخدم أو كلمة المرور غير صحيحة");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 relative overflow-hidden" dir="rtl">
      
      {/* دوائر ضوئية في الخلفية للتصميم الجبار */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-[#A62DC9] opacity-20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-blue-600 opacity-20 blur-[120px] rounded-full"></div>

      <div className="relative z-10 w-full max-w-md animate-fade-in">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl shadow-black">
          
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-white mb-2">تسجيل الدخول</h1>
            <p className="text-gray-400 font-medium">لوحة تحكم ii3RwA System</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-400 mb-2 mr-2 text-sm">اسم المستخدم</label>
              <input 
                type="text" 
                required
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:border-[#A62DC9] focus:ring-1 focus:ring-[#A62DC9] outline-none transition-all duration-300"
                placeholder="أدخل اليوزر"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2 mr-2 text-sm">كلمة المرور</label>
              <input 
                type="password" 
                required
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:border-[#A62DC9] focus:ring-1 focus:ring-[#A62DC9] outline-none transition-all duration-300"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-red-500 text-center text-sm font-bold animate-bounce">
                {error}
              </p>
            )}

            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-black text-xl text-white shadow-lg transition-all transform active:scale-95 ${
                loading 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-[#A62DC9] to-[#6a1b9a] hover:shadow-[#A62DC9]/40 hover:scale-[1.02]'
              }`}
            >
              {loading ? 'جاري التحقق...' : 'دخول للمنصة 🚀'}
            </button>
          </form>

          <p className="text-center mt-8 text-gray-500 text-xs">
            حميع الحقوق محفوظة لـ ii3RwA System &copy; 2026
          </p>
        </div>
      </div>
    </div>
  );
}
