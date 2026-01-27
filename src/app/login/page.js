const handleLogin = (e) => {
  e.preventDefault();
  if (username === "3bood" && password === "22415262044") {
    // تخزين حالة الدخول
    localStorage.setItem("isAdmin", "true");
    
    // محاولة الانتقال عبر Next.js Router
    router.push('/security');
    
    // حل احتياطي إذا لم يعمل الـ Router
    setTimeout(() => {
      window.location.href = '/security';
    }, 500);
  } else {
    alert("البيانات خاطئة!");
  }
};
