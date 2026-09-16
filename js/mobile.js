// ===================================================
//  MOBILE.JS - Logic riêng cho thiết bị di động
//  Portfolio - Pham Ngoc Hung
// ===================================================

(function () {
  'use strict';

  // --- Kiểm tra thiết bị mobile ---
  const isMobile = () => window.innerWidth <= 768;
  const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // --- iOS Viewport Height Fix ---
  // Sửa lỗi 100vh không đúng trên Safari iOS (thanh địa chỉ ẩn/hiện)
  function setVhVariable() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  setVhVariable();
  window.addEventListener('resize', setVhVariable);
  window.addEventListener('orientationchange', () => {
    setTimeout(setVhVariable, 300);
  });

  // --- Bottom Navigation Active State ---
  const bottomNav = document.getElementById('mobile-bottom-nav');
  const mobNavItems = bottomNav ? bottomNav.querySelectorAll('.mob-nav-item') : [];

  // Cập nhật item active dựa theo section đang hiển thị
  function updateBottomNav() {
    if (!isMobile() || !bottomNav) return;
    const scrollPos = window.scrollY + window.innerHeight / 2;
    const sections = ['hero', 'about', 'skills', 'featured-project', 'contact'];
    let activeSection = 'hero';

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollPos) {
        activeSection = id;
      }
    });

    mobNavItems.forEach(item => {
      item.classList.toggle('active', item.dataset.section === activeSection);
    });
  }

  // Smooth scroll khi bấm bottom nav
  mobNavItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionId = item.dataset.section;
      const target = document.getElementById(sectionId);
      if (!target) return;

      // Haptic feedback (nếu browser hỗ trợ)
      if (navigator.vibrate) navigator.vibrate(8);

      const offset = sectionId === 'hero' ? 0 : 70;
      window.scrollTo({
        top: target.offsetTop - offset,
        behavior: 'smooth'
      });

      // Cập nhật active ngay lập tức
      mobNavItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // Lắng nghe scroll để cập nhật bottom nav
  let navScrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!navScrollTicking) {
      requestAnimationFrame(() => {
        updateBottomNav();
        navScrollTicking = false;
      });
      navScrollTicking = true;
    }
  }, { passive: true });

  // --- Swipe Gesture cho Modal (Bottom Sheet) ---
  function initModalSwipe() {
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
      const box = modal.querySelector('.modal-box');
      if (!box) return;

      let startY = 0;
      let currentY = 0;
      let isDragging = false;

      box.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        const boxRect = box.getBoundingClientRect();
        if (touch.clientY - boxRect.top > 80) return;
        startY = touch.clientY;
        isDragging = true;
        box.style.transition = 'none';
      }, { passive: true });

      box.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentY = e.touches[0].clientY;
        const diff = currentY - startY;
        if (diff > 0) {
          box.style.transform = `translateY(${diff}px)`;
        }
      }, { passive: true });

      box.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        box.style.transition = '';
        const diff = currentY - startY;
        if (diff > 120) {
          box.style.transform = 'translateY(100%)';
          setTimeout(() => {
            modal.classList.remove('active');
            document.body.classList.remove('modal-open');
            box.style.transform = '';
          }, 300);
        } else {
          box.style.transform = '';
        }
      });
    });
  }

  // --- Swipe Ngang để Cuộn Ảnh ---
  function initImageSwipe() {
    const thumbRow = document.querySelector('.screenshot-thumb-row');
    if (!thumbRow) return;

    let startX = 0;
    let scrollLeft = 0;
    let isDown = false;

    thumbRow.addEventListener('touchstart', (e) => {
      isDown = true;
      startX = e.touches[0].pageX - thumbRow.offsetLeft;
      scrollLeft = thumbRow.scrollLeft;
    }, { passive: true });

    thumbRow.addEventListener('touchend', () => { isDown = false; }, { passive: true });

    thumbRow.addEventListener('touchmove', (e) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - thumbRow.offsetLeft;
      const walk = (startX - x) * 1.5;
      thumbRow.scrollLeft = scrollLeft + walk;
    }, { passive: true });
  }

  // --- Touch Feedback cho Cards ---
  function addTouchFeedback() {
    const touchElements = document.querySelectorAll(
      '.skill-card, .cert-card, .project-card, .info-card, .course-chip, .cv-action-item'
    );
    touchElements.forEach(el => {
      el.addEventListener('touchstart', () => {
        el.style.opacity = '0.85';
        el.style.transform = 'scale(0.98)';
      }, { passive: true });

      const resetStyle = () => {
        el.style.opacity = '';
        el.style.transform = '';
      };

      el.addEventListener('touchend', resetStyle, { passive: true });
      el.addEventListener('touchcancel', resetStyle, { passive: true });
    });
  }

  // --- Ẩn/Hiện Bottom Nav khi Scroll ---
  let lastScrollY = window.scrollY;
  let hideNavTimeout;

  function handleNavVisibility() {
    if (!isMobile() || !bottomNav) return;
    const currentScrollY = window.scrollY;
    const diff = currentScrollY - lastScrollY;

    clearTimeout(hideNavTimeout);

    if (diff > 8 && currentScrollY > 200) {
      bottomNav.style.transform = 'translateY(100%)';
    } else if (diff < -8 || currentScrollY < 100) {
      bottomNav.style.transform = 'translateY(0)';
    }

    hideNavTimeout = setTimeout(() => {
      if (bottomNav) bottomNav.style.transform = 'translateY(0)';
    }, 2000);

    lastScrollY = currentScrollY;
  }

  window.addEventListener('scroll', handleNavVisibility, { passive: true });

  // --- Cải thiện Contact Form trên Mobile ---
  function optimizeFormForMobile() {
    const textareas = document.querySelectorAll('textarea.form-control');
    textareas.forEach(ta => {
      ta.addEventListener('input', () => {
        ta.style.height = 'auto';
        ta.style.height = Math.min(ta.scrollHeight, 200) + 'px';
      }, { passive: true });
    });

    const formInputs = document.querySelectorAll('.form-control');
    formInputs.forEach(input => {
      input.addEventListener('focus', () => {
        if (isMobile()) {
          setTimeout(() => {
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 400);
        }
      }, { passive: true });
    });
  }

  // --- Skills Tab: Cuộn ngang ---
  function initSkillTabsSwipe() {
    const tabsWrapper = document.querySelector('.skills-tabs');
    if (!tabsWrapper) return;

    tabsWrapper.style.overflowX = 'auto';
    tabsWrapper.style.scrollbarWidth = 'none';
    tabsWrapper.style.webkitOverflowScrolling = 'touch';
    tabsWrapper.style.flexWrap = 'nowrap';
    tabsWrapper.style.paddingBottom = '4px';

    const activeTab = tabsWrapper.querySelector('.skill-tab.active');
    if (activeTab) {
      activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }

    document.querySelectorAll('.skill-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        setTimeout(() => {
          tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }, 100);
      }, { passive: true });
    });
  }

  // --- Lazy Load Images ---
  function initLazyImages() {
    if (!('IntersectionObserver' in window)) return;
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (!lazyImages.length) return;

    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    lazyImages.forEach(img => imgObserver.observe(img));
  }

  // --- Bottom Nav CSS Transition ---
  if (bottomNav) {
    bottomNav.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  }

  // --- Khởi động tất cả tính năng mobile ---
  function init() {
    if (isTouchDevice() || isMobile()) {
      initModalSwipe();
      initImageSwipe();
      addTouchFeedback();
      optimizeFormForMobile();
      initSkillTabsSwipe();
    }
    initLazyImages();
    updateBottomNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Khởi động lại khi resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateBottomNav();
    }, 250);
  });

})();
