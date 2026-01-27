"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SecurityPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const OWNER_IDS = ["123456789012345678", "000000000000000000"]; 
  const isOwner = session?.user?.id && OWNER_IDS.includes(session.user.id);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login');
    }
  }, [status, router]);

  if (status === "loading") return <div className="min-h-screen bg-black flex items-center justify-center text-[#A62DC9]">جاري الفحص...</div>;
  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-10 bg-white/5 p-5 rounded-3xl border border-white/10">
          <div className="flex items-center gap-4">
            <img src={session.user.image} className="w-12 h-12 rounded-full border-2 border-[#A62DC9]" alt="avatar" />
            <div>
              <p className="font-bold">{session.user.name}</p>
              <p className="text-[10px] text-[#A62DC9] font-black">{isOwner ? "👑 OWNER" : "🛡️ ADMIN"}</p>
            </div>
          </div>
          <button onClick={() => signOut()} className="text-red-500 text-sm font-bold bg-red-500/10 px-4 py-2 rounded-xl">خروج</button>
        </header>

        {isOwner && (
          <section className="mb-10 p-8 bg-white/5 border-2 border-[#A62DC9]/20 rounded-[2.5rem] animate-fade-in">
            <h2 className="text-xl font-black mb-4 text-[#A62DC9]">إدارة طاقم الإدارة</h2>
            <div className="flex gap-4">
              <input type="text" placeholder="Discord User ID" className="flex-1 bg-black/40 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#A62DC9]" />
              <button className="bg-[#A62DC9] px-10 rounded-2xl font-black">إضافة إداري</button>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] hover:border-[#A62DC9]/50 transition-all">
            <h3 className="text-xl font-black mb-4 italic">منع الروابط 🔗</h3>
            <button className="w-full py-4 rounded-xl font-bold bg-[#A62DC9]/10 text-[#A62DC9] border border-[#A62DC9]">تحكم بالخاصية</button>
          </div>
        </div>
      </div>
    </div>
  );
}
