// Fades in each ".reveal" element the first time it scrolls into view
const els = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

els.forEach(el => io.observe(el));

// Generate a twinkling, clickable star field in the hero background
const starField = document.getElementById('stars');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function createStar() {
  const star = document.createElement('div');
  const isBig = Math.random() < 0.12;
  const size = isBig ? (Math.random() * 2 + 2.5) : (Math.random() * 1.5 + 1);
  const duration = (Math.random() * 3 + 2).toFixed(2);
  const delay = (Math.random() * 5).toFixed(2);

  star.className = isBig ? 'star big' : 'star';
  star.style.top = Math.random() * 100 + '%';
  star.style.left = Math.random() * 100 + '%';
  star.style.width = size + 'px';
  star.style.height = size + 'px';
  star.style.animationDuration = duration + 's';
  star.style.animationDelay = delay + 's';
  return star;
}

function burstSparkles(x, y, isBig) {
  const count = isBig ? 14 : 9;
  for (let i = 0; i < count; i++) {
    const spark = document.createElement('div');
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const dist = Math.random() * 36 + 26;
    spark.className = 'spark';
    spark.style.left = x + 'px';
    spark.style.top = y + 'px';
    spark.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
    spark.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
    spark.style.background = isBig ? 'var(--accent-2)' : 'var(--white)';
    starField.appendChild(spark);
    spark.addEventListener('animationend', () => spark.remove());
  }
}

if (starField) {
  const STAR_COUNT = 90;
  for (let i = 0; i < STAR_COUNT; i++) {
    starField.appendChild(createStar());
  }

  // Tap/click a star to make it burst into sparkles, then respawn elsewhere
  starField.addEventListener('click', (e) => {
    const star = e.target.closest('.star');
    if (!star) return;

    const starRect = star.getBoundingClientRect();
    const fieldRect = starField.getBoundingClientRect();
    const x = starRect.left - fieldRect.left + starRect.width / 2;
    const y = starRect.top - fieldRect.top + starRect.height / 2;

    if (!prefersReducedMotion) {
      burstSparkles(x, y, star.classList.contains('big'));
    }
    star.remove();

    setTimeout(() => {
      if (starField.isConnected) starField.appendChild(createStar());
    }, Math.random() * 1500 + 400);
  });
}