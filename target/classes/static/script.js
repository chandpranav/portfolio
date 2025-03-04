let camera, scene, renderer, material;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

init();
animate();

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
  scene.fog = new THREE.FogExp2(0x0000ff, 0.001); 
  // ^ Adjust color (0x0000ff) & density (0.001) to your preference,
  // or remove if you don't want fog.

  // 3. Geometry + Vertices
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const size = 2000; // how spread out the particles are

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

  // 4. Points Material
  // Default to black particles for light mode
  material = new THREE.PointsMaterial({
    size: 2,
    color: 0x000000 // Black particles by default (light mode)
  });

  // 5. Create the particle Points & add to scene
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // 6. Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 7. Insert the canvas into the DOM
  document.body.appendChild(renderer.domElement);

  // 8. Interaction + resize events
  document.body.style.touchAction = 'none';
  document.addEventListener('pointermove', onPointerMove);
  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onPointerMove(event) {
  // If you only want pointermove for the primary pointer
  if (event.isPrimary === false) return;

  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  // Add constant slow motion to particles even without mouse movement
  camera.position.x += (mouseX * 0.05 - camera.position.x) * 0.01;
  camera.position.y += (-mouseY * 0.05 - camera.position.y) * 0.01;
  
  // Add a slight rotation to the scene for constant movement
  scene.rotation.y += 0.001;
  scene.rotation.x += 0.0005;
  
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
}

// Detect dark mode and update particles
function updateParticleColor(sliderValue) {
  // For light mode (sliderValue near 0): black particles (0x000000)
  // For dark mode (sliderValue near 100): white particles (0xFFFFFF)
  
  if (sliderValue <= 50) {
    // Light mode: black particles
    material.color.setHex(0x000000);
  } else {
    // Dark mode: white particles
    material.color.setHex(0xFFFFFF);
  }
}

// Listen for theme changes
document.addEventListener('DOMContentLoaded', function() {
  const themeSlider = document.getElementById('themeSlider');
  if (themeSlider) {
    // Initial color update based on stored theme
    if (localStorage.getItem('theme') === 'dark') {
      updateParticleColor(100);
    } else {
      updateParticleColor(0);
    }
    
    // Update on slider movement
    themeSlider.addEventListener('input', function() {
      const sliderValue = parseInt(themeSlider.value);
      
      // Update particle color based on slider position
      updateParticleColor(sliderValue);
      
      // Apply smooth transition effect to the body
      document.body.style.transition = 'background 0.3s ease, color 0.3s ease';
      
      // Calculate background transition
      const darkPercentage = sliderValue / 100;
      
      // Apply gradual CSS changes based on slider position
      if (sliderValue > 50) {
        // Transition to dark mode
        document.documentElement.style.setProperty('--bg-opacity', darkPercentage.toFixed(2));
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
      } else {
        // Transition to light mode
        document.documentElement.style.setProperty('--bg-opacity', '0');
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
      }
    });
  }
});
