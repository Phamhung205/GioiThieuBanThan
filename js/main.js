// ===== PORTFOLIO MAIN JS - Pham Ngoc Hung =====

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// ===== TYPING EFFECT =====
const typingTexts = [
  'Sinh viên Công nghệ Thông tin',
  'Web Developer',
  'Frontend Developer',
  'Lập trình viên',
  'IT Developer'
];

let typingIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingEl = document.getElementById('typing-text');

function typeEffect() {
  const current = typingTexts[typingIndex];
  if (isDeleting) {
    typingEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let speed = isDeleting ? 60 : 100;
  if (!isDeleting && charIndex === current.length) {
    speed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    typingIndex = (typingIndex + 1) % typingTexts.length;
    speed = 400;
  }
  setTimeout(typeEffect, speed);
}

if (typingEl) setTimeout(typeEffect, 800);

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
  toggleScrollTop();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollPos >= top && scrollPos < bottom);
    }
  });
}

// ===== SCROLL TO TOP =====
const scrollTopBtn = document.getElementById('scroll-top');

function toggleScrollTop() {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
}

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== REVEAL ON SCROLL =====
const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, { threshold: 0.1 });

revealElements.forEach(el => observer.observe(el));

// ===== SKILLS TABS =====
const skillTabs = document.querySelectorAll('.skill-tab');
const skillCards = document.querySelectorAll('.skill-card');

skillTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    skillTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const category = tab.dataset.category;
    skillCards.forEach(card => {
      if (category === 'all' || card.dataset.category === category) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ===== SKILL BAR ANIMATION =====
const skillBarsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-level-fill').forEach(bar => {
        bar.style.width = bar.dataset.level;
      });
    }
  });
}, { threshold: 0.3 });

const skillsSection = document.getElementById('skills');
if (skillsSection) skillBarsObserver.observe(skillsSection);

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, suffix = '') {
  let current = 0;
  const increment = target / 60;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + suffix;
  }, 25);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
      });
      entry.target.querySelectorAll('.hero-stat-num[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stats-bar, #hero').forEach(el => {
  statsObserver.observe(el);
});

// ===== MODAL =====
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
    document.body.classList.add('modal-open');
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
  }
}

document.querySelectorAll('.modal-overlay').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.classList.remove('modal-open');
    }
  });
});

document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.modal-overlay').classList.remove('active');
    document.body.classList.remove('modal-open');
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(m => {
      m.classList.remove('active');
      document.body.classList.remove('modal-open');
    });
  }
});

// ===== LIGHTBOX =====
function openLightbox(src) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay active';
  overlay.style.flexDirection = 'column';
  overlay.innerHTML = `
    <button class="lightbox-close" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
    <img src="${src}" alt="Preview" class="lightbox-img">
  `;
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
  document.body.classList.add('modal-open');
}

document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('click', () => {
    const img = card.querySelector('img');
    if (img) openLightbox(img.src);
  });
});

document.querySelectorAll('.screenshot-thumb').forEach(thumb => {
  thumb.addEventListener('click', () => {
    const img = thumb.querySelector('img');
    const mainImg = document.querySelector('.screenshot-main img');
    if (img && mainImg) mainImg.src = img.src;
  });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const name = document.getElementById('cf-name');
    const email = document.getElementById('cf-email');
    const subject = document.getElementById('cf-subject');
    const message = document.getElementById('cf-message');

    // Clear errors
    document.querySelectorAll('.form-error').forEach(el => el.classList.remove('show'));

    if (!name.value.trim()) {
      showError('err-name', 'Vui lòng nhập họ tên'); valid = false;
    }
    if (!email.value.match(/^[^@]+@[^@]+\.[^@]+$/)) {
      showError('err-email', 'Email không hợp lệ'); valid = false;
    }
    if (!subject.value.trim()) {
      showError('err-subject', 'Vui lòng nhập tiêu đề'); valid = false;
    }
    if (!message.value.trim() || message.value.trim().length < 10) {
      showError('err-message', 'Nội dung phải có ít nhất 10 ký tự'); valid = false;
    }

    if (valid) {
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        showStatus('success', '✓ Tin nhắn đã được gửi! Tôi sẽ phản hồi sớm nhất có thể.');
        contactForm.reset();
      }, 1500);
    }
  });
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.classList.add('show'); }
}

function showStatus(type, msg) {
  const status = document.getElementById('form-status');
  if (status) {
    status.className = 'form-status ' + type;
    status.textContent = msg;
    setTimeout(() => { status.className = 'form-status'; status.textContent = ''; }, 5000);
  }
}

// ===== PROJECT DETAIL MODAL =====
const projectDetails = {
  'shop': {
    title: 'Website Bán Hàng Online',
    desc: 'Hệ thống bán hàng trực tuyến được xây dựng trong quá trình học tập môn Hệ thống thương mại điện tử.',
    tech: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
    features: ['Quản lý sản phẩm', 'Giỏ hàng', 'Tìm kiếm', 'Admin panel', 'Đăng ký/Đăng nhập']
  },
  'java': {
    title: 'Ứng dụng Java Quản lý Sinh viên',
    desc: 'Ứng dụng desktop quản lý thông tin sinh viên xây dựng bằng Java Swing.',
    tech: ['Java', 'Java Swing', 'MySQL', 'JDBC'],
    features: ['CRUD sinh viên', 'Tìm kiếm', 'Xếp loại', 'Xuất PDF', 'Bảo mật']
  },
  'sql': {
    title: 'Hệ thống Cơ sở Dữ liệu Quản lý',
    desc: 'Dự án thiết kế và triển khai CSDL phục vụ quản lý thư viện.',
    tech: ['SQL Server', 'T-SQL', 'Stored Procedures', 'Views', 'Triggers'],
    features: ['Schema design', 'Stored procedures', 'Triggers', 'Báo cáo', 'Tối ưu truy vấn']
  }
};

function openProjectDetail(key) {
  const data = projectDetails[key];
  if (!data) return;
  const modal = document.getElementById('project-detail-modal');
  modal.querySelector('.modal-title').textContent = data.title;
  modal.querySelector('#pd-desc').textContent = data.desc;
  modal.querySelector('#pd-tech').innerHTML = data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
  modal.querySelector('#pd-features').innerHTML = data.features.map(f => `<li>${f}</li>`).join('');
  openModal('project-detail-modal');
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.offsetTop - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  updateActiveNav();
  toggleScrollTop();
});

// ===== SKILL BARS ON SCROLL =====
const skillsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-level-fill').forEach(bar => {
        const level = bar.getAttribute('data-level');
        if (level) bar.style.width = level;
      });
      skillsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

const skillsSection = document.getElementById('skills');
if (skillsSection) skillsObserver.observe(skillsSection);

// ===== PROJECT DETAILS DATA =====
const projectDetails = {
  shop: {
    title: 'Website Ban Hang Online',
    desc: 'He thong thuong mai dien tu xay dung trong mon Hoc phan Web. Cho phep nguoi dung duyet san pham, them gio hang, dat hang. Admin co the quan ly toan bo san pham va don hang.',
    tech: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
    features: ['Hien thi & tim kiem san pham', 'Gio hang va dat hang', 'Quan ly san pham (Admin)', 'Dang ky / Dang nhap nguoi dung', 'Lich su don hang']
  },
  java: {
    title: 'Ung Dung Quan Ly Sinh Vien - Java',
    desc: 'Ung dung desktop xay dung bang Java Swing ket noi MySQL. Cho phep quan ly toan dien thong tin sinh vien, diem so va xep loai hoc luc.',
    tech: ['Java', 'Java Swing', 'MySQL', 'JDBC'],
    features: ['CRUD thong tin sinh vien', 'Tinh GPA tu dong', 'Xep loai: Xuat sac / Gioi / Kha / TB', 'Tim kiem theo nhieu tieu chi', 'Xuat bao cao dang table']
  },
  sql: {
    title: 'He Thong CSDL Quan Ly Thu Vien',
    desc: 'Du an chuyen sau ve thiet ke va xay dung co so du lieu quan ly thu vien su dung SQL Server. Tap trung vao toi uu hoa truy van va bao mat du lieu.',
    tech: ['SQL Server', 'T-SQL', 'Stored Procedures', 'Triggers', 'Views'],
    features: ['Thiet ke schema chuan 3NF', 'Stored Procedures cho nghiep vu', 'Triggers tu dong cap nhat', 'View bao cao thong ke', 'Index toi uu hoa truy van']
  }
};

function openProjectDetail(key) {
  const data = projectDetails[key];
  if (!data) return;
  const modal = document.getElementById('project-detail-modal');
  if (!modal) return;
  modal.querySelector('.modal-title').textContent = data.title;
  document.getElementById('pd-desc').textContent = data.desc;
  document.getElementById('pd-tech').innerHTML = data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
  document.getElementById('pd-features').innerHTML = data.features.map(f => `<li>${f}</li>`).join('');
  openModal('project-detail-modal');
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    }
  });
});

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  updateActiveNav();
  toggleScrollTop();
  // Animate stats bar counters
  document.querySelectorAll('.stats-bar .stat-number[data-count]').forEach(el => {
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animateCounter(el, parseInt(el.dataset.count), el.dataset.suffix || '');
        io.disconnect();
      }
    }, { threshold: 0.8 });
    io.observe(el);
  });
});