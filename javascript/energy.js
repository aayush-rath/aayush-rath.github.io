import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, surface, light, controls, containerEl;


export function initEnergyPlot() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xfffaf4);

  camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.set(6, 6, 6);

  const canvas = document.getElementById('energy-plot');
  if (!canvas) {
    console.error("energy.js: No canvas with id 'energy-plot' found.");
    return;
  }

  renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.setSize(canvas.clientWidth || canvas.width || 700, canvas.clientHeight || canvas.height || 450, false);

  containerEl = document.querySelector('.blog-container') || document.body;
  if (getComputedStyle(containerEl).position === 'static') {
    containerEl.style.position = 'relative';
  }

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  light = new THREE.DirectionalLight(0xffffff, 0.9);
  light.position.set(5, 10, 7).normalize();
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x888888, 0.8));

  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);

  function energyFunction(x, y) {
    return Math.sin(x) * Math.cos(y) + 0.3 * Math.sin(2 * x) - 0.2 * Math.cos(0.8 * y);
  }

  const planeSize = 7;
  const subdivisions = 140;
  const geometry = new THREE.PlaneGeometry(planeSize, planeSize, subdivisions, subdivisions);
  const pos = geometry.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = energyFunction(x, y);
    pos.setZ(i, z);
  }
  geometry.computeVertexNormals();

  const material = new THREE.MeshPhongMaterial({
    color: 0x66ccff,
    side: THREE.DoubleSide,
    shininess: 40,
    transparent: true,
    opacity: 0.95,
  });

  surface = new THREE.Mesh(geometry, material);
  surface.rotation.x = -Math.PI / 2;
  scene.add(surface);

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', onWindowResize, false);
  function onWindowResize() {
    const w = canvas.clientWidth || containerEl.clientWidth || 700;
    const h = canvas.clientHeight || Math.max( Math.round(w * 0.66), 300 );

    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h, false);
  }
  onWindowResize();

  window.sceneReady = true;
  document.dispatchEvent(new Event('sceneReady'));

  const stored = localStorage.getItem('darkMode') === 'enabled';
  updateThreeSceneForDarkMode(stored);
}

window.addEventListener('load', () => initEnergyPlot());

function updateThreeSceneForDarkMode(isDark) {
  if (!scene || !renderer || !surface || !light) return;

  const startBg = (scene.background && scene.background.clone) ? scene.background.clone() : new THREE.Color(0xfffaf4);
  const endBg = new THREE.Color(isDark ? 0x222222 : 0xfffaf4);

  const startMat = surface.material.color.clone();
  const endMat = new THREE.Color(isDark ? 0x9ac5ed : 0x66ccff);

  const startLight = light.intensity;
  const endLight = isDark ? 1.2 : 0.9;

  const duration = 300;
  const t0 = performance.now();

  function step(t) {
    const elapsed = t - t0;
    const u = Math.min(elapsed / duration, 1);

    scene.background = startBg.clone().lerp(endBg, u);

    surface.material.color.copy(startMat.clone().lerp(endMat, u));

    light.intensity = startLight + (endLight - startLight) * u;

    renderer.render(scene, camera);

    if (u < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

export { updateThreeSceneForDarkMode };
window.updateThreeSceneForDarkMode = updateThreeSceneForDarkMode;
window.updateEnergyPlotForDarkMode = updateThreeSceneForDarkMode;
