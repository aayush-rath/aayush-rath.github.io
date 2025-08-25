// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 15;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Light
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

// Soma (cell body)
const somaGeometry = new THREE.SphereGeometry(2, 32, 32);
const somaMaterial = new THREE.MeshStandardMaterial({ color: 0x44aa88 });
const soma = new THREE.Mesh(somaGeometry, somaMaterial);
scene.add(soma);

// Dendrites (lines or cylinders)
const dendrites = [];
for (let i = 0; i < 6; i++) {
    const geom = new THREE.CylinderGeometry(0.05, 0.1, 4);
    const mat = new THREE.MeshStandardMaterial({ color: 0x8888ff });
    const dend = new THREE.Mesh(geom, mat);
    dend.position.set(Math.cos(i) * 3, Math.sin(i) * 3, 0);
    dend.lookAt(soma.position);
    scene.add(dend);
    dendrites.push(dend);
}

// Axon
const axonGeometry = new THREE.CylinderGeometry(0.1, 0.1, 8);
const axonMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
const axon = new THREE.Mesh(axonGeometry, axonMaterial);
axon.position.set(0, -6, 0);
axon.rotation.x = Math.PI / 2;
scene.add(axon);

// Axon terminals
const terminals = new THREE.SphereGeometry(0.3, 16, 16);
const terminalMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
for (let i = -1; i <= 1; i++) {
    const terminal = new THREE.Mesh(terminals, terminalMat);
    terminal.position.set(i, -10, 0);
    scene.add(terminal);
}

// Signal Particle (invisible initially)
const signalGeometry = new THREE.SphereGeometry(0.2, 16, 16);
const signalMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffff00 });
const signal = new THREE.Mesh(signalGeometry, signalMaterial);
signal.visible = false;
scene.add(signal);

// Signal path (hardcoded path for now)
let signalPath = [];
let signalIndex = 0;
let signalActive = false;

function createSignalPath() {
    signalPath = [];
    for (let y = 3; y >= -10; y -= 0.2) {
        signalPath.push(new THREE.Vector3(0, y, 0));
    }
    signalIndex = 0;
    signal.position.copy(signalPath[0]);
    signal.visible = true;
    signalActive = true;
}

document.getElementById('fireBtn').addEventListener('click', createSignalPath);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Move signal if active
    if (signalActive && signalIndex < signalPath.length - 1) {
        signal.position.lerpVectors(signalPath[signalIndex], signalPath[signalIndex + 1], 0.5);
        signalIndex++;
    } else if (signalIndex >= signalPath.length - 1) {
        signalActive = false;
        signal.visible = false;
    }

    renderer.render(scene, camera);
}
animate();
