import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xfffaf4);

// 3. Torus
const geometry = new THREE.TorusKnotGeometry( 3, 1, 100, 16 ); 
const material = new THREE.MeshStandardMaterial( { color: 0x9ac5ed, wireframe: true} ); 
const torusKnot = new THREE.Mesh( geometry, material ); scene.add( torusKnot );
scene.add(torusKnot);

// 4. Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

// 5. Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
const container = document.getElementById('canvas-container');
if (container) {
  container.appendChild(renderer.domElement);
} else {
  console.error("No #canvas-container found");
}
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(container.devicePixelRatio);

// 2. Camera
const camera = new THREE.PerspectiveCamera(
  75,
  container.clientWidth/container.clientHeight,
  0.1,
  1000
);
camera.position.z = 10;

window.addEventListener('resize', () => {
  const width = container.clientWidth;
  const height = container.clientHeight;

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

window.sceneReady = true;
window.updateThreeSceneForDarkMode = updateThreeSceneForDarkMode;

document.dispatchEvent(new Event("sceneReady"));

function updateThreeSceneForDarkMode(isDark) {
  const startColor = scene.background.clone();
  const endColor = new THREE.Color(isDark ? 0x222222 : 0xfffaf4);
  const duration = 250;
  const startTime = performance.now();

  torusKnot.material.color.set(isDark ? 0xffffff : 0x9ac5ed);
  light.intensity = isDark ? 1.0 : 0.8;

  function animateBackground(time) {
    const elapsed = time - startTime;
    const t = Math.min(elapsed / duration, 1);

    const lerped = startColor.clone().lerp(endColor, t);
    scene.background = lerped;
    renderer.render(scene, camera);

    if (t < 1) {
      requestAnimationFrame(animateBackground);
    }
  }

  requestAnimationFrame(animateBackground);
}

window.updateThreeSceneForDarkMode = updateThreeSceneForDarkMode;

// 6. Controls
const controls = new OrbitControls(camera, renderer.domElement);

// 7. Animation loop
function animate() {
  requestAnimationFrame(animate);

  torusKnot.rotation.x += 0.002;
  torusKnot.rotation.y += 0.002;

  controls.update();
  renderer.render(scene, camera);
}
animate();
