import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js'; 

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000 
);

camera.position.set(1.64, -0.78, -0.32);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.localClippingEnabled = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 0.1; 

controls.target.set(1.61, -2.56, -0.25);
controls.update(); 

controls.addEventListener('end', () => {
    console.log(`Camera Position: camera.position.set(${camera.position.x.toFixed(2)}, ${camera.position.y.toFixed(2)}, ${camera.position.z.toFixed(2)});`);
    console.log(`Controls Target: controls.target.set(${controls.target.x.toFixed(2)}, ${controls.target.y.toFixed(2)}, ${controls.target.z.toFixed(2)});`);
    console.log('---');
});

//Basic Lighting (To see the model)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

const roofCutPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), -1.5);

const mtlLoader = new MTLLoader();

// Load the materials first
mtlLoader.load(
    './model.mtl', 
    (materials) => {
        materials.preload(); 

        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials); 

        objLoader.load(
            './model.obj',
            (obj) => {
                obj.traverse((child) => {
                    if (child.isMesh) {
                        child.material.clippingPlanes = [roofCutPlane]; 
                        child.material.clipShadows = true; 
                        child.material.side = THREE.DoubleSide; 
                    }
                });

                scene.add(obj);
                
                console.log("Cave .obj, .mtl, and textures loaded successfully.");
            },
            (xhr) => console.log((xhr.loaded / xhr.total * 100) + '% loaded OBJ'),
            (error) => console.error("Error loading OBJ:", error)
        );
    },
    (xhr) => console.log((xhr.loaded / xhr.total * 100) + '% loaded MTL'),
    (error) => console.error("Error loading MTL:", error)
);


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

//The Render Loop
function animate() {
    requestAnimationFrame(animate); 
    
    controls.update(); 
    
    renderer.render(scene, camera);
}

// Start the loop
animate();