const loader = document.getElementById("loader");
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const scrollProgress = document.getElementById("scrollProgress");
const backToTop = document.getElementById("backToTop");
const typingText = document.getElementById("typingText");
const cursor = document.getElementById("cursor");
const cursorOutline = document.getElementById("cursorOutline");

window.addEventListener("load", () => {
  setTimeout(() => {
    loader.classList.add("hide");
  }, 700);
});

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  document.body.classList.toggle("theme-light", savedTheme === "light");
  document.body.classList.toggle("theme-dark", savedTheme !== "light");
}

const updateThemeIcon = () => {
  const isLight = document.body.classList.contains("theme-light");
  themeToggle.querySelector(".theme-toggle-icon").textContent = isLight ? "🌙" : "☀";
};
updateThemeIcon();

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("theme-light");
  document.body.classList.toggle("theme-dark");
  const isLight = document.body.classList.contains("theme-light");
  localStorage.setItem("theme", isLight ? "light" : "dark");
  updateThemeIcon();
});

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll("[data-animate]").forEach((el) => observer.observe(el));

const counters = document.querySelectorAll(".counter");
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      let count = 0;
      const step = Math.max(1, Math.floor(target / 50));
      const tick = () => {
        count += step;
        if (count >= target) {
          el.textContent = target;
          return;
        }
        el.textContent = count;
        requestAnimationFrame(tick);
      };
      tick();
      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.6 }
);

counters.forEach((counter) => counterObserver.observe(counter));

const typingPhrases = [
  "Electronics & Communication Engineering Student",
  "PCB Design & Embedded Systems Enthusiast",
  "Building intelligent electronic systems",
];
let typingIndex = 0;
let charIndex = 0;
let deleting = false;

const typeLoop = () => {
  const currentPhrase = typingPhrases[typingIndex];
  typingText.textContent = currentPhrase.slice(0, charIndex);

  if (!deleting && charIndex < currentPhrase.length) {
    charIndex += 1;
  } else if (deleting && charIndex > 0) {
    charIndex -= 1;
  } else {
    deleting = !deleting;
    if (!deleting) {
      typingIndex = (typingIndex + 1) % typingPhrases.length;
    }
  }

  const delay = deleting ? 50 : 90;
  setTimeout(typeLoop, charIndex === currentPhrase.length ? 1200 : delay);
};

typeLoop();

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const progress = docHeight ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
  backToTop.classList.toggle("show", scrollTop > 400);
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const copyButtons = document.querySelectorAll(".copy-btn");
copyButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.dataset.copy;
    const text = document.getElementById(targetId).textContent.trim();
    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = "Copied";
      setTimeout(() => {
        btn.textContent = "Copy";
      }, 1500);
    });
  });
});

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((button) => button.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    projectCards.forEach((card) => {
      const category = card.dataset.category;
      const show = filter === "all" || filter === category;
      card.style.display = show ? "grid" : "none";
    });
  });
});

const updateCursor = (event) => {
  const { clientX, clientY } = event;
  cursor.style.left = `${clientX}px`;
  cursor.style.top = `${clientY}px`;
  cursorOutline.style.left = `${clientX}px`;
  cursorOutline.style.top = `${clientY}px`;
};

document.addEventListener("mousemove", updateCursor);

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let particles = [];

const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

const initParticles = () => {
  const count = Math.min(120, Math.floor(window.innerWidth / 10));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 1,
    speedX: (Math.random() - 0.5) * 0.6,
    speedY: (Math.random() - 0.5) * 0.6,
  }));
};

const drawParticles = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(56, 189, 248, 0.5)";
  particles.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
    p.x += p.speedX;
    p.y += p.speedY;
    if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
    if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
  });
  requestAnimationFrame(drawParticles);
};

resizeCanvas();
initParticles();
drawParticles();

window.addEventListener("resize", () => {
  resizeCanvas();
  initParticles();
});
