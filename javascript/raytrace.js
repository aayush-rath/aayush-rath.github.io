import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CameraHelper } from "three";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 50);
camera.position.set(4, 2, 6);

const canvas = document.getElementById("rayTrace");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const grid = new THREE.GridHelper(10, 10);
scene.add(grid);
// scene.add(new THREE.AxesHelper(2));

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

const virtualCam = new THREE.PerspectiveCamera(35, 1.5, 0.1, 0.5);
virtualCam.position.set(0.3, 1, 1.8);
virtualCam.lookAt(0, 0, 0);
const camHelper = new CameraHelper(virtualCam);
scene.add(camHelper);

const rayMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
const rayGeometry = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(),
  new THREE.Vector3()
]);
const rayLine = new THREE.Line(rayGeometry, rayMaterial);
scene.add(rayLine);

const raycaster = new THREE.Raycaster();
const pixelDir = new THREE.Vector3(-0.1, -0.1, -1).normalize();
const rayOrigin = virtualCam.position.clone();
raycaster.set(rayOrigin, pixelDir);

const intersects = raycaster.intersectObject(cube);
const hitPoint = intersects.length > 0
  ? intersects[0].point
  : rayOrigin.clone().add(pixelDir.clone().multiplyScalar(5));

let t = 0, speed = 0.02;
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  t += speed;
  if (t > 1) {
    t = 0;
  }

  const currentEnd = new THREE.Vector3().lerpVectors(rayOrigin, hitPoint, t);
  rayGeometry.setFromPoints([rayOrigin, currentEnd]);

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
