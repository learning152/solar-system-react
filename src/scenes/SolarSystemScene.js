import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import PlanetMercury from '../components/PlanetMercury';
import PlanetVenus from '../components/PlanetVenus';
import PlanetEarth from '../components/PlanetEarth';
import PlanetMars from '../components/PlanetMars';
import PlanetJupiter from '../components/PlanetJupiter';
import PlanetSaturn from '../components/PlanetSaturn';
import PlanetUranus from '../components/PlanetUranus';
import PlanetNeptune from '../components/PlanetNeptune';
import AsteroidBelt from '../components/AsteroidBelt';
import ControlPanel from '../components/ControlPanel';
import PlanetDetail from '../components/PlanetDetail';
import { planetData } from '../models/PlanetModel';

const handleZoomChange = (cameraRef, setZoom) => (newZoom) => {
  setZoom(newZoom);
  if (cameraRef.current) {
    // 从当前位置到太阳(0,0,0)的方向向量
    const direction = new THREE.Vector3()
      .subVectors(new THREE.Vector3(0, 0, 0), cameraRef.current.position)
      .normalize();
    
    // 计算新的位置
    const distance = 50 / Math.max(0.1, newZoom);
    const newPosition = direction.multiplyScalar(-distance);
    cameraRef.current.position.copy(newPosition);
    cameraRef.current.lookAt(0, 0, 0);
  }
};

export default function SolarSystemScene() {
  const mountRef = useRef(null);
  const [timeScale, setTimeScale] = useState(1);
  const [, setZoom] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const planetsRef = useRef([]);
  const cameraRef = useRef(null);
  const controlsRef = useRef({
    isDragging: false,
    previousMousePosition: { x: 0, y: 0 }
  });

  useEffect(() => {
    const mountNode = mountRef.current;
    if (!mountNode) return;
    
    // 清理之前的渲染器
    while (mountNode.firstChild) {
      mountNode.removeChild(mountNode.firstChild);
    }
    
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    // 初始化场景
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 5000);
    camera.position.set(0, 0, 100); // 初始位置在太阳系外围
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountNode.appendChild(renderer.domElement);

    // 光源设置
    const ambientLight = new THREE.AmbientLight(0x404040);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7);
    scene.add(ambientLight, directionalLight);

    // 创建太阳
    const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // 添加星空背景
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1
    });
    
    const starVertices = [];
    for (let i = 0; i < 5000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starVertices.push(x, y, z);
    }
    
    starGeometry.setAttribute('position', 
      new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    
    // 初始化行星 - 3D圆形布局
    const planets = [
      new PlanetMercury(),
      new PlanetVenus(),
      new PlanetEarth(),
      new PlanetMars(),
      new PlanetJupiter(),
      new PlanetSaturn(),
      new PlanetUranus(),
      new PlanetNeptune()
    ];
    
    // 基于JPL行星历表数据的轨道参数
    const orbitParams = [
      // 水星: 半径(AU), 倾角(度), 初始角度(度)
      { radius: 0.39, inclination: 7.0, initAngle: 28.3 },
      // 金星
      { radius: 0.72, inclination: 3.4, initAngle: 181.2 }, 
      // 地球
      { radius: 1.00, inclination: 0.0, initAngle: 357.1 },
      // 火星
      { radius: 1.52, inclination: 1.9, initAngle: 19.3 },
      // 木星
      { radius: 5.20, inclination: 1.3, initAngle: 20.0 },
      // 土星
      { radius: 9.58, inclination: 2.5, initAngle: 317.7 },
      // 天王星
      { radius: 19.22, inclination: 0.8, initAngle: 141.0 },
      // 海王星
      { radius: 30.05, inclination: 1.8, initAngle: 256.1 }
    ];

    // 转换为3D场景参数 (半径缩小比例1:10亿公里)
    const scaleFactor = 0.1; 
    
    planets.forEach((planet, index) => {
      const { radius, inclination, initAngle } = orbitParams[index];
      const rad = radius * scaleFactor;
      const incl = inclination * Math.PI/180;
      const angle = initAngle * Math.PI/180;
      
      // 3D椭圆轨道位置 (考虑倾角)
      planet.group.position.set(
        rad * Math.cos(angle),
        rad * Math.sin(angle) * Math.sin(incl),
        rad * Math.sin(angle) * Math.cos(incl)
      );
      
      // 设置轨道平面倾角
      planet.group.rotation.x = incl;
      
      // 设置轨道速度 (开普勒第三定律)
      planet.orbitSpeed = 1.0 / Math.sqrt(radius);
      
      scene.add(planet.group);
    });
    
    planetsRef.current = planets;
    const asteroidBelt = new AsteroidBelt();
    scene.add(asteroidBelt.group);

    // 鼠标交互功能
    const handleClick = (event) => {
      // 计算鼠标位置
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // 更新射线
      raycaster.setFromCamera(mouse, camera);
      
      // 检测与行星的交点
      const intersects = raycaster.intersectObjects(
        planetsRef.current.map(p => p.group.children[1])
      );
      
      if (intersects.length > 0) {
        const planetMesh = intersects[0].object;
        const planet = planetsRef.current.find(p => p.mesh === planetMesh);
        if (planet) {
          setSelectedPlanet({
            name: planet.name,
            ...planetData[planet.name.toLowerCase()]
          });
        }
      }
    };

    // 鼠标滚轮缩放
    const handleWheel = (e) => {
      e.preventDefault();
      const currentZoom = cameraRef.current.position.length() / Math.sqrt(20*20 + 30*30);
      const newZoom = Math.min(3, Math.max(0.1, currentZoom - e.deltaY * 0.001));
      handleZoomChange(cameraRef, setZoom)(newZoom);
    };

    // 鼠标拖动控制
    const handleMouseDown = (e) => {
      if (e.button !== 0) return; // 仅左键
      controlsRef.current.isDragging = true;
      controlsRef.current.previousMousePosition = {
        x: e.clientX,
        y: e.clientY
      };
    };

    const handleMouseMove = (e) => {
      if (!controlsRef.current.isDragging) return;
      
      const deltaMove = {
        x: e.clientX - controlsRef.current.previousMousePosition.x,
        y: e.clientY - controlsRef.current.previousMousePosition.y
      };

      cameraRef.current.rotation.y -= deltaMove.x * 0.005;
      cameraRef.current.rotation.x -= deltaMove.y * 0.005;
      cameraRef.current.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, cameraRef.current.rotation.x));
      
      controlsRef.current.previousMousePosition = {
        x: e.clientX,
        y: e.clientY
      };
    };

    const handleMouseUp = () => {
      controlsRef.current.isDragging = false;
    };

    window.addEventListener('click', handleClick);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // 键盘控制
    const handleKeyDown = (e) => {
      const moveSpeed = 2;
      const currentPos = cameraRef.current.position.clone();
      
      switch(e.key) {
        case 'ArrowUp':
          cameraRef.current.position.setY(currentPos.y + moveSpeed);
          break;
        case 'ArrowDown':
          cameraRef.current.position.setY(currentPos.y - moveSpeed);
          break;
        case 'ArrowLeft':
          cameraRef.current.position.setZ(currentPos.z + moveSpeed);
          break;
        case 'ArrowRight':
          cameraRef.current.position.setZ(currentPos.z - moveSpeed);
          break;
        default:
          return;
      }
      
      cameraRef.current.lookAt(0, 0, 0);
    };

    window.addEventListener('keydown', handleKeyDown);

    // 动画循环
    let lastTime = 0;
    const animate = (currentTime) => {
      requestAnimationFrame(animate);
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      
      planetsRef.current.forEach(planet => {
        // 使用基于开普勒定律的轨道速度
        planet.update(deltaTime * planet.orbitSpeed, timeScale);
      });
      
      renderer.render(scene, camera);
    };
    animate(0);

    // 窗口大小调整
    const handleResize = () => {
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
      if (mountNode && renderer.domElement.parentNode === mountNode) {
        renderer.dispose();
        mountNode.removeChild(renderer.domElement);
      }
    };
  }, [timeScale]);

  return (
    <>
      <div 
        ref={mountRef} 
        style={{ cursor: controlsRef.current?.isDragging ? 'grabbing' : 'grab' }}
      />
      {cameraRef.current && (
        <ControlPanel 
          timeScale={timeScale} 
          onTimeScaleChange={setTimeScale}
          onZoomChange={handleZoomChange(cameraRef, setZoom)}
          onPlanetSelect={(planetId) => {
            const planet = planetsRef.current.find(p => 
              p.name.toLowerCase() === planetId
            );
            if (planet) {
              setSelectedPlanet({
                name: planet.name,
                ...planetData[planet.name.toLowerCase()]
              });
            }
          }}
        />
      )}
      <PlanetDetail 
        planet={selectedPlanet}
        onClose={() => setSelectedPlanet(null)} 
      />
    </>
  );
}
