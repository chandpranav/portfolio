let camera, scene, renderer, material;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let particles, lines;
let isDarkMode = localStorage.getItem('theme') === 'dark';

init();
animate();

document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);  // always reset to top on reload
});

/* =============================
   1. INITIAL THREE.JS SETUP
============================= */
function init() {
  // 1. Camera
  camera = new THREE.PerspectiveCamera(
    50, 
    window.innerWidth / window.innerHeight, 
    1, 
    2000
  );
  camera.position.z = 500;

  // 2. Scene + optional Fog
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(isDarkMode ? 0x000000 : 0xffffff, 0.001);

  // Create both particle systems
  createParticles();
  createLines();

  // Set initial visibility based on theme
  updateParticleSystem(isDarkMode);

  // 6. Renderer
  renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true 
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  // 7. Insert the canvas into the DOM
  document.body.appendChild(renderer.domElement);

  // 8. Interaction + resize events
  document.body.style.touchAction = 'none';
  document.addEventListener('pointermove', onPointerMove);
  window.addEventListener('resize', onWindowResize);
}

function createParticles() {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const size = 2000;

  for (let i = 0; i < 2000; i++) {
    const x = (Math.random() - 0.5) * size;
    const y = (Math.random() - 0.5) * size;
    const z = (Math.random() - 0.5) * size;
    vertices.push(x, y, z);
  }

  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(vertices, 3)
  );

  material = new THREE.PointsMaterial({
    size: 3,
    color: isDarkMode ? 0xffffff : 0x000000
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);
}

function updateParticleColors(isDark) {
  if (material) {
    color: isDarkMode ? 0xffffff : 0x000000  
  }
}

// Then call this within your slider event listener:
themeSlider.addEventListener('input', function() {
  const value = parseInt(this.value, 10);
  const isDarkMode = value > 50;
  
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
  }

  updateParticleColors(isDarkMode);
});

function createLines() {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const size = 1500;
  const lineCount = 100;
  
  // Create line vertices
  for (let i = 0; i < lineCount; i++) {
    const x1 = (Math.random() - 0.5) * size;
    const y1 = (Math.random() - 0.5) * size;
    const z1 = (Math.random() - 0.5) * size;
    
    const x2 = x1 + (Math.random() - 0.5) * 200;
    const y2 = y1 + (Math.random() - 0.5) * 200;
    const z2 = z1 + (Math.random() - 0.5) * 200;
    
    vertices.push(x1, y1, z1);
    vertices.push(x2, y2, z2);
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x000000,
    opacity: 0.5,
    transparent: true
  });

  lines = new THREE.LineSegments(geometry, lineMaterial);
  scene.add(lines);
}

function updateParticleSystem(isDark) {
  if (particles && lines) {
    // Update particle visibility and color
    particles.visible = isDark;
    material.color.setHex(isDark ? 0xffffff : 0x000000);
    
    // Update line visibility and color
    lines.visible = !isDark;
    lines.material.color.setHex(isDark ? 0xffffff : 0x000000);
    
    // Update fog
    scene.fog.color.setHex(isDark ? 0x000000 : 0xffffff);
  }
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onPointerMove(event) {
  if (event.isPrimary === false) return;
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  camera.position.x += (mouseX * 0.05 - camera.position.x) * 0.01;
  camera.position.y += (-mouseY * 0.05 - camera.position.y) * 0.01;
  
  if (particles) {
    particles.rotation.y += 0.001;
    particles.rotation.x += 0.0005;
  }
  
  if (lines) {
    lines.rotation.y += 0.0005;
    lines.rotation.x += 0.0002;
  }
  
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
}

/* =============================
   2. OTHER JS (NO THEME TOGGLE)
============================= */

/**
 * If you have any additional JS for fade-ins,
 * experience tabs, etc., keep it here.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Fade-in on Scroll for Elements
  const faders = document.querySelectorAll('.fade-in-up');
  const options = { threshold: 0.1 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, options);
  faders.forEach((el) => observer.observe(el));

  // Experience Tabs
  const expButtons = document.querySelectorAll('.exp-btn');
  const expContents = document.querySelectorAll('.exp-content');
  expButtons.forEach((button) => {
    button.addEventListener('click', () => {
      expButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      expContents.forEach((content) => content.classList.remove('active'));
      const targetId = button.getAttribute('data-target');
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  // Contact Form Validation
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        alert('Please fill in all fields.');
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }
      alert('Message sent successfully!');
      contactForm.reset();
    });
  }

  
});

document.addEventListener('DOMContentLoaded', function() {
  const themeSlider = document.getElementById('themeSlider');
  const body = document.body;

  // Correct initialization
  let isDarkMode = localStorage.getItem('theme') === 'dark';

  if (isDarkMode) {
    body.classList.add('dark-mode');
    themeSlider.value = 100;
  } else {
    body.classList.remove('dark-mode');
    themeSlider.value = 0;
  }

  // Call update particle color on load
  updateParticleColors(isDarkMode);

  themeSlider.addEventListener('input', () => {
    const sliderValue = parseInt(themeSlider.value, 10);
    const darkModeEnabled = sliderValue > 50;

    if (darkModeEnabled !== isDarkMode) {
      isDarkMode = darkModeEnabled;

      if (isDarkMode) {
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
      } else {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
      }

      updateParticleColors(isDarkMode);
    }
  });
});

// Function to update particle colors
function updateParticleColors(isDark) {
  if (material) {
    material.color.setHex(isDark ? 0xffffff : 0x000000);
  }
}

