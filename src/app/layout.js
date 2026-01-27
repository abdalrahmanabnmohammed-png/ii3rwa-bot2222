import './globals.css'

export const metadata = {
  title: 'ii3RwA System | لوحة التحكم',
  description: 'لوحة تحكم احترافية لإدارة حماية وتفاعل سيرفرات الديسكورد',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-[#0a0a0a] text-white antialiased">
        {children}
      </body>
    </html>
  )
}
