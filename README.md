<div align="center">

# 🫖 بهونه

**بهانه‌ساز ایرانی با هوش مصنوعی**

یه بهانه ایرانی‌پسند برای هر موقعیتی — دیر رسیدن، نرفتن به مهمونی، جواب ندادن تلفن، و هر چیز دیگه‌ای که فکرش رو بکنی.

[**دمو زنده →**](https://amirfeqhi.github.io/bahouneh/) &nbsp;·&nbsp; [گزارش باگ](https://github.com/amirfeqhi/bahaneh/issues) &nbsp;·&nbsp; [پیشنهاد ویژگی](https://github.com/amirfeqhi/bahaneh/issues)

![HTML](https://img.shields.io/badge/HTML-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-F38020?style=flat&logo=cloudflare&logoColor=white)
![OpenRouter](https://img.shields.io/badge/OpenRouter-6467F2?style=flat)

</div>

---

## ✨ ویژگی‌ها

- 🎭 **۸ موقعیت آماده** — دیر رسیدن، نرفتن به مهمونی، پس ندادن قرض، فراموش کردن تولد و...
- ✍️ **موقعیت دلخواه** — هر چیزی که داری بنویس
- 🔥 **کنترل شدت** — از ساده و معقول تا کاملاً پرت و باورنکردنی
- 🎭 **سبک‌های مختلف** — خنده‌دار، مظلوم‌نمایی، غمگین، رسمی
- 💡 **نکته کاربردی** — راهنمای استفاده از بهانه
- 📱 **اشتراک‌گذاری** — مستقیم به واتساپ و تلگرام
- 📜 **تاریخچه** — ۵ بهانه آخر ذخیره میشه
- ⚡ **پاسخ streaming** — بهانه حرف به حرف ظاهر میشه

---

## 🏗️ معماری

```
کاربر → index.html → Cloudflare Worker → OpenRouter API → مدل AI
                            ↑
                کلید API فقط اینجاست
                (هرگز به مرورگر نمی‌رسه)
```

پروژه از دو فایل تشکیل شده:

| فایل | نقش |
|------|-----|
| `index.html` | فرانت‌اند کامل — HTML، CSS، JS در یک فایل |
| `worker.js` | Cloudflare Worker — پروکسی امن بین فرانت و API |

---

## 📁 ساختار پروژه

```
bahaneh/
├── index.html      ← فرانت‌اند (vanilla HTML/CSS/JS)
├── worker.js       ← Cloudflare Worker
├── .gitignore
└── README.md
```

---

<div align="center">

اگه خوشت اومد، یه ⭐️ بالا سمت راست بده.

</div>