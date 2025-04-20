import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';



const ThreeDMap = ({ onBuildingClick, selectedBuildingId }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const buildingMeshesRef = useRef>(new Map());
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  // Define campus buildings
  const campusBuildings = [
    // Academic Blocks
    { id'a-block', name'A Block', position[-15, 0, 0], dimensions[10, 8, 10], color'#D04848' },
    { id'b-block', name'B Block', position[-5, 0, 5], dimensions[10, 6, 10], color'#F7B787' },
    { id'c-block', name'C Block', position[5, 0, 5], dimensions[10, 7, 10], color'#F7B787' },
    { id'd-block', name'D Block', position[15, 0, 0], dimensions[10, 8, 10], color'#F7B787' },
    { id'e-block', name'E Block', position[15, 0, -10], dimensions[10, 5, 10], color'#F7B787' },
    { id'h-block', name'H Block', position[5, 0, -10], dimensions[10, 6, 10], color'#F7B787' },
    { id'j-block', name'J Block', position[-5, 0, -10], dimensions[10, 7, 10], color'#F7B787' },
    { id'library', name'Central Library', position[-15, 0, -10], dimensions[10, 10, 10], color'#6499E9' },
    
    // Hostels in a row at the back
    { id'hostel-a', name'Hostel A', position[-30, 0, -30], dimensions[8, 12, 8], color'#A6CF98' },
    { id'hostel-b', name'Hostel B', position[-20, 0, -30], dimensions[8, 12, 8], color'#A6CF98' },
    { id'hostel-c', name'Hostel C', position[-10, 0, -30], dimensions[8, 12, 8], color'#A6CF98' },
    { id'hostel-d', name'Hostel D', position[0, 0, -30], dimensions[8, 12, 8], color'#A6CF98' },
    { id'hostel-e', name'Hostel E', position[10, 0, -30], dimensions[8, 12, 8], color'#A6CF98' },
    { id'hostel-f', name'Hostel F', position[20, 0, -30], dimensions[8, 12, 8], color'#A6CF98' },
    { id'hostel-g', name'Hostel G', position[30, 0, -30], dimensions[8, 12, 8], color'#A6CF98' },
    
    // Other facilities
    { id'cafe', name'Cafeteria', position[0, 0, 15], dimensions[15, 4, 10], color'#FFB996' },
    { id'mess', name'Mess', position[0, 0, 25], dimensions[20, 5, 12], color'#FFCF81' },
    { id'parking', name'Parking Area', position[25, 0, 25], dimensions[30, 1, 20], color'#808080', rotation.PI / 6 },
  ];

  // Initialize the 3D scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#f0f0f0');

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.set(0, 50, 80);
    camera.lookAt(0, 0, 0);

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias });
    rendererRef.current = renderer;
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Setup lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Add ground
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color0x7cad7c,
      roughness0.8,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Add roads
    const roadMaterial = new THREE.MeshStandardMaterial({ color0x333333 });
    
    // Main road
    const mainRoadGeometry = new THREE.PlaneGeometry(10, 150);
    const mainRoad = new THREE.Mesh(mainRoadGeometry, roadMaterial);
    mainRoad.rotation.x = -Math.PI / 2;
    mainRoad.position.y = 0.1; // Slightly above ground to prevent z-fighting
    scene.add(mainRoad);
    
    // Cross road
    const crossRoadGeometry = new THREE.PlaneGeometry(150, 10);
    const crossRoad = new THREE.Mesh(crossRoadGeometry, roadMaterial);
    crossRoad.rotation.x = -Math.PI / 2;
    crossRoad.position.y = 0.1;
    scene.add(crossRoad);

    // Setup controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.maxPolarAngle = Math.PI / 2 - 0.1; // Prevent camera from going below ground
    controls.minDistance = 20;
    controls.maxDistance = 150;

    // Create buildings
    campusBuildings.forEach(building => {
      const { id, position, dimensions, color, rotation } = building;
      const geometry = new THREE.BoxGeometry(dimensions[0], dimensions[1], dimensions[2]);
      const material = new THREE.MeshStandardMaterial({ 
        color,
        roughness0.7,
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(position[0], dimensions[1] / 2, position[2]); // Position Y at half height
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData.id = id; // Store ID for raycasting
      
      if (rotation) {
        mesh.rotation.y = rotation;
      }
      
      buildingMeshesRef.current.set(id, mesh);
      scene.add(mesh);
    });

    // Add labels for buildings
    campusBuildings.forEach(building => {
      const { id, name, position, dimensions } = building;
      
      // Create a div element for the label
      const labelElement = document.createElement('div');
      labelElement.className = 'absolute pointer-events-none bg-black bg-opacity-70 text-white px-2 py-1 text-xs rounded-md whitespace-nowrap';
      labelElement.textContent = name;
      labelElement.id = `label-${id}`;
      labelElement.style.visibility = 'hidden';
      mountRef.current?.appendChild(labelElement);
    });

    // Setup mouse event listeners
    const onMouseMove = (event) => {
      // Calculate mouse position in normalized device coordinates
      const rect = mountRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onClick = () => {
      if (!cameraRef.current || !sceneRef.current) return;
      
      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children);
      
      for (let i = 0; i < intersects.length; i++) {
        const object = intersects[i].object;
        if (object instanceof THREE.Mesh && object.userData.id) {
          onBuildingClick(object.userData.id);
          break;
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    mountRef.current.addEventListener('click', onClick);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      // Update labels
      if (cameraRef.current && mountRef.current) {
        campusBuildings.forEach(building => {
          const mesh = buildingMeshesRef.current.get(building.id);
          if (!mesh) return;
          
          // Get screen position for the label
          const position = new THREE.Vector3(
            mesh.position.x,
            mesh.position.y + building.dimensions[1] / 2 + 1, // Position above the building
            mesh.position.z
          );
          
          position.project(cameraRef.current);
          
          const rect = mountRef.current.getBoundingClientRect();
          const x = (position.x * 0.5 + 0.5) * rect.width;
          const y = (1 - (position.y * 0.5 + 0.5)) * rect.height;
          
          const labelElement = document.getElementById(`label-${building.id}`);
          if (labelElement) {
            labelElement.style.transform = `translate(-50%, -100%) translate(${x}px, ${y}px)`;
            
            // Only show labels for buildings in front of the camera
            const vector = new THREE.Vector3();
            mesh.getWorldPosition(vector);
            vector.project(cameraRef.current);
            
            if (vector.z < 1) {
              labelElement.style.visibility = 'visible';
            } else {
              labelElement.style.visibility = 'hidden';
            }
          }
        });
      }
      
      // Highlight selected building
      buildingMeshesRef.current.forEach((mesh, id) => {
        const material = mesh.material as THREE.MeshStandardMaterial;
        
        if (id === selectedBuildingId) {
          material.emissive.set('#ffff00');
          material.emissiveIntensity = 0.5;
        } else {
          material.emissive.set('#000000');
          material.emissiveIntensity = 0;
        }
      });
      
      // Check for hover
      if (cameraRef.current && sceneRef.current) {
        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
        const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children);
        
        document.body.style.cursor = 'default';
        
        for (let i = 0; i < intersects.length; i++) {
          const object = intersects[i].object;
          if (object instanceof THREE.Mesh && object.userData.id) {
            document.body.style.cursor = 'pointer';
            break;
          }
        }
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (mountRef.current) {
        mountRef.current.removeEventListener('click', onClick);
      }
      
      // Remove all label elements
      campusBuildings.forEach(building => {
        const labelElement = document.getElementById(`label-${building.id}`);
        if (labelElement && labelElement.parentNode) {
          labelElement.parentNode.removeChild(labelElement);
        }
      });
    };
  }, [onBuildingClick, selectedBuildingId]);

  return (
    <div className="relative w-full h-full rounded-lg shadow-lg overflow-hidden">
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
};

export default ThreeDMap;
