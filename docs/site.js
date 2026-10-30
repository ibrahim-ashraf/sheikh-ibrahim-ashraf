/**
 * موقع الشيخ إبراهيم أشرف وتطبيقه
 * الوظائف التفاعلية وإمكانية الوصول
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. تحديث السنة الحالية في التذييل
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. القائمة المتنقلة للشاشات الصغيرة
  const navToggle = document.querySelector(".mobile-nav-toggle");
  const siteNav = document.querySelector(".site-nav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", !isExpanded);
      siteNav.classList.toggle("is-open");
    });

    // إغلاق القائمة عند النقر على أي رابط
    siteNav.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    // إغلاق القائمة بمفتاح Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && siteNav.classList.contains("is-open")) {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.focus();
      }
    });
  }

  // 3. تطبيق الإعدادات المركزية إن وُجدت
  if (window.SITE_CONFIG) {
    const cfg = window.SITE_CONFIG;

    // روابط Google Play
    if (cfg.playStoreUrl) {
      document.querySelectorAll(".play-store-link").forEach((link) => {
        link.href = cfg.playStoreUrl;
      });
    }

    // البريد الإلكتروني
    if (cfg.email) {
      document.querySelectorAll(".personal-email-link").forEach((el) => {
        el.href = "mailto:" + cfg.email;
        if (el.classList.contains("display-email")) {
          el.textContent = cfg.email;
        }
      });
    }

    // تيليجرام الشخصي
    if (cfg.personalTelegram) {
      document.querySelectorAll(".personal-telegram-link").forEach((el) => {
        el.href = cfg.personalTelegram;
      });
    }

    // وسائل التواصل الاجتماعي
    if (cfg.social) {
      const socialMap = {
        youtube: "social-link-youtube",
        telegram: "social-link-telegram",
        whatsapp: "social-link-whatsapp",
        facebook: "social-link-facebook",
        x: "social-link-x",
        instagram: "social-link-instagram"
      };

      for (const [key, id] of Object.entries(socialMap)) {
        if (cfg.social[key]) {
          const el = document.getElementById(id);
          if (el) {
            el.href = cfg.social[key];
          }
        }
      }
    }
  }
});
