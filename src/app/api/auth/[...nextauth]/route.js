import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // هذه الخطوة ضرورية لنقل الـ ID من ديسكورد إلى الموقع
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub; 
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
// أضف هذا الجزء داخل callbacks في ملف التعديل السابق
callbacks: {
  async session({ session, token }) {
    session.user.id = token.sub;
    
    // جلب بيانات الإداري من قاعدة البيانات (اختياري لزيادة الأمان)
    // session.user.role = await getAdminRole(token.sub); 
    
    return session;
  },
},
