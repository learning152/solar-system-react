import * as THREE from 'three';

export default class PlanetNeptune {
  constructor() {
    this.name = 'neptune';
    this.chineseName = '海王星';
    this.radius = 0.85;
    this.orbitRadius = 449.8;
    this.speed = 0.0005;
    this.angle = 0;
    
    this.group = new THREE.Group();
    
    // 初始化轨迹线
    this.trailPoints = [];
    this.trailLength = 36500; // 统一轨道保留时间3650天
    const trailGeometry = new THREE.BufferGeometry();
    const trailMaterial = new THREE.LineBasicMaterial({ 
      color: 0x4169e1, // 海王星深蓝色
      transparent: true,
      opacity: 0.7
    });
    this.trail = new THREE.Line(trailGeometry, trailMaterial);
    this.group.add(this.trail);
    
    // 行星本体
    const geometry = new THREE.SphereGeometry(this.radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0x4b70dd,
      roughness: 0.7,
      metalness: 0.3
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.group.add(this.mesh);
    
    // 添加大气层效果
    const atmosphereGeometry = new THREE.SphereGeometry(this.radius * 1.05, 32, 32);
    const atmosphereMaterial = new THREE.MeshStandardMaterial({
      color: 0x4b70dd,
      transparent: true,
      opacity: 0.3
    });
    this.atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    this.mesh.add(this.atmosphere);
  }
  
  update(deltaTime, timeScale = 1) {
    this.angle += this.speed * deltaTime * timeScale;
    const x = Math.cos(this.angle) * this.orbitRadius;
    const z = Math.sin(this.angle) * this.orbitRadius;
    this.mesh.position.set(x, 0, z);
    
    // 更新轨迹
    this.trailPoints.push(new THREE.Vector3(x, 0, z));
    if (this.trailPoints.length > this.trailLength) {
      this.trailPoints.shift();
    }
    this.trail.geometry.setFromPoints(this.trailPoints);
    this.trail.geometry.attributes.position.needsUpdate = true;
    
    this.mesh.rotation.y += 0.3 * deltaTime * timeScale;
  }
}
