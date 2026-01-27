"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SecurityPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login');
    }
  }, [status, router]);

  if (status === "loading") return <p className="text-white text-center mt-20">جاري التحقق...</p>;
  if (!session) return null;

  // هنا تضع كود الأزرار والـ API الخاص بك
  return (
    <div className="text-white p-10">
      <h1>مرحباً {session.user.name}</h1>
      {/* باقي كود اللوحة... */}
    </div>
  );
}
