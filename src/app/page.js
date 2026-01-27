export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-5" dir="rtl">
      <h1 className="text-4xl font-bold text-purple-500 mb-8">لوحة تحكم بوتات ii3RwA 🚀</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        
        {/* بطاقة بوت الحماية */}
        <a href="/security" className="p-8 bg-gray-800 border border-gray-700 rounded-2xl hover:border-purple-500 transition-all group">
          <h2 className="text-2xl font-bold mb-3 group-hover:text-purple-400">🛡️ بوت الحماية</h2>
          <p className="text-gray-400">إدارة أنظمة منع الروابط، السبام، وسجلات السيرفر.</p>
        </a>

        {/* بطاقة بوت التفاعل - سنبرمجها لاحقاً */}
        <div className="p-8 bg-gray-800 border border-gray-700 rounded-2xl opacity-50 cursor-not-allowed">
          <h2 className="text-2xl font-bold mb-3">📢 بوت التفاعل</h2>
          <p className="text-gray-400">إشعارات اليوتيوب، نظام الليفل، والترحيب (قريباً).</p>
        </div>

      </div>
    </div>
  );
}
