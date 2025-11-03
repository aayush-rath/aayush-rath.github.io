import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CameraHelper } from "three";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 50);
camera.position.set(4, 2, 6);

const canvas = document.getElementById("rayTraceMulti");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

scene.add(new THREE.GridHelper(10, 10));

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0x00aaff })
);
cube.position.set(0, 0.5, -3);
scene.add(cube);

scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

const virtualCameras = [];
const camHelpers = [];
const rays = [];
const numCams = 8;
const radius = 3.0;
const cubeCenter = cube.position.clone();

for (let i = 0; i < numCams; i++) {
  const theta = (i / numCams) * Math.PI * 2;
  const phi = (Math.PI / 4) + (Math.random() - 0.5) * 0.6;

  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  const vCam = new THREE.PerspectiveCamera(35, 1.5, 0.1, 0.5);
  const pos = new THREE.Vector3(x, y, z).add(cubeCenter);
  vCam.position.copy(pos);

  vCam.lookAt(cubeCenter);
  const jitter = new THREE.Euler(
    (Math.random() - 0.5) * 0.15,
    (Math.random() - 0.5) * 0.15,
    (Math.random() - 0.5) * 0.08,
    "ZYX"
  );
  const qJitter = new THREE.Quaternion().setFromEuler(jitter);
  vCam.quaternion.multiply(qJitter);

  vCam.updateMatrixWorld(true);

  const helper = new CameraHelper(vCam);
  scene.add(helper);

  virtualCameras.push(vCam);
  camHelpers.push(helper);

  const color = new THREE.Color().setHSL(i / numCams, 0.9, 0.5);
  const rayMaterial = new THREE.LineBasicMaterial({ color });
  const rayGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
  const rayLine = new THREE.Line(rayGeometry, rayMaterial);
  scene.add(rayLine);
  rays.push({ geometry: rayGeometry, camera: vCam, helper: helper });
}

let t = 0;
const speed = 0.02;

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  t += speed;
  if (t > 1) t = 0;

  rays.forEach(({ geometry, camera: vCam, helper }) => {
    const rayOrigin = vCam.position.clone();
    const pixelDir = new THREE.Vector3(0, 0, -1).applyQuaternion(vCam.quaternion).normalize();

    const raycaster = new THREE.Raycaster(rayOrigin, pixelDir);
    const intersects = raycaster.intersectObject(cube);
    const hitPoint = intersects.length > 0
      ? intersects[0].point
      : rayOrigin.clone().add(pixelDir.clone().multiplyScalar(6));

    const currentEnd = new THREE.Vector3().lerpVectors(rayOrigin, hitPoint, t);
    geometry.setFromPoints([rayOrigin, currentEnd]);

    helper.update();
  });

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
});
