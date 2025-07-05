import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xfffaf4);

// 2. Camera
const camera = new THREE.PerspectiveCamera(
  75,
  1,
  0.1,
  1000
);
camera.position.z = 9;

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
renderer.setSize(600, 600);
renderer.setPixelRatio(window.devicePixelRatio);

window.addEventListener('resize', () => {
  const width = container.clientWidth;
  const height = container.clientHeight;

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

const container = document.getElementById('canvas-container');
if (container) {
  container.appendChild(renderer.domElement);
} else {
  console.error("No #canvas-container found");
}

// 6. Controls
const controls = new OrbitControls(camera, renderer.domElement);

// 7. Animation loop
function animate() {
  requestAnimationFrame(animate);

  torusKnot.rotation.x += 0.01;
  torusKnot.rotation.y += 0.01;

  controls.update();
  renderer.render(scene, camera);
}
animate();
