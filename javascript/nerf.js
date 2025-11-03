import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";

// ====== Scene, Camera, Renderer ======
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(1, 1, 1);

const canvas = document.getElementById("nerfplay");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// ====== Controls ======
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ====== Lights ======
scene.add(new THREE.AmbientLight(0x00ffff, 0.6));
const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// ====== Helpers ======
scene.add(new THREE.GridHelper(10, 10));
// scene.add(new THREE.AxesHelper(2));

// ====== OBJ Model ======
let model = null;
const loader = new OBJLoader();
loader.load(
  "../assets/blog-images/NGP/nerf_mesh.obj",
  (obj) => {
    obj.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: 0x3388ff,
          metalness: 0.2,
          roughness: 0.6,
        });
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    obj.scale.set(0.6, 0.6, 0.6);
    obj.position.set(0, 0, 0);
    obj.rotation.x = (3 * Math.PI) / 2;

    scene.add(obj);
    model = obj;
  },
  (xhr) => console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`),
  (err) => console.error("Error loading OBJ:", err)
);

// ====== Drop Ball Logic ======
const balls = [];
const gravity = new THREE.Vector3(0, -0.02, 0);
const raycaster = new THREE.Raycaster();

function dropBall() {
  const radius = 0.1 + Math.random() * 0.15;
  const geom = new THREE.SphereGeometry(radius, 32, 32);
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(Math.random(), Math.random(), Math.random()),
  });
  const ball = new THREE.Mesh(geom, mat);

//   ball.position.set(
//     (Math.random() - 0.5) * 2,
//     5 + Math.random() * 1,
//     (Math.random() - 0.5) * 2
//   );

  ball.position.set(
    0,
    5,
    0
  );

  scene.add(ball);
  balls.push({
    mesh: ball,
    velocity: new THREE.Vector3(0, 0, 0),
    radius,
    mass: radius * radius * radius, // approximate volume
  });
}

document.getElementById("dropButton").addEventListener("click", dropBall);

// ====== Simple Ball-Ball Collision Function ======
function handleBallCollisions() {
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      const bi = balls[i];
      const bj = balls[j];

      const delta = new THREE.Vector3().subVectors(bj.mesh.position, bi.mesh.position);
      const dist = delta.length();
      const minDist = bi.radius + bj.radius;

      if (dist < minDist) {
        // normalize direction
        const normal = delta.clone().normalize();

        // move balls apart to prevent overlap
        const overlap = (minDist - dist) / 2;
        bi.mesh.position.addScaledVector(normal, -overlap);
        bj.mesh.position.addScaledVector(normal, overlap);

        // simple elastic collision response
        const relativeVelocity = new THREE.Vector3().subVectors(bj.velocity, bi.velocity);
        const velAlongNormal = relativeVelocity.dot(normal);

        if (velAlongNormal > 0) continue;

        const restitution = 0.6; // bounciness
        const impulseMag =
          -(1 + restitution) * velAlongNormal /
          (1 / bi.mass + 1 / bj.mass);

        const impulse = normal.clone().multiplyScalar(impulseMag);
        bi.velocity.addScaledVector(impulse, -1 / bi.mass);
        bj.velocity.addScaledVector(impulse, 1 / bj.mass);
      }
    }
  }
}

// ====== Animation Loop ======
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  for (const b of balls) {
    // gravity
    b.velocity.add(gravity);
    b.mesh.position.add(b.velocity);

    // check collision with model
    if (model) {
      raycaster.set(b.mesh.position, new THREE.Vector3(0, -1, 0));
      const intersects = raycaster.intersectObject(model, true);
      if (intersects.length > 0) {
        const hit = intersects[0];
        const distance = b.mesh.position.y - hit.point.y;
        if (distance < b.radius) {
          b.mesh.position.y = hit.point.y + b.radius;
          b.velocity.y *= -0.3;
          if (Math.abs(b.velocity.y) < 0.001) b.velocity.y = 0;
        }
      }
    }
  }

  // handle collisions between balls
  handleBallCollisions();

  renderer.render(scene, camera);
}

animate();

// ====== Handle Resize ======
window.addEventListener("resize", () => {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
});
