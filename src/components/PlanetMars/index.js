import * as THREE from 'three';

export default class PlanetMars {
  constructor() {
    this.name = 'mars';
    this.chineseName = '火星';
    this.radius = 0.53;
    this.orbitRadius = 22.8;
    this.speed = 0.008;
    this.angle = 0;
    
    this.group = new THREE.Group();
    
    // 初始化轨迹线
    this.trailPoints = [];
    this.trailLength = 3650; // 统一轨道保留时间3650天
    const trailGeometry = new THREE.BufferGeometry();
    const trailMaterial = new THREE.LineBasicMaterial({ 
      color: 0xc1440e, // 火星红色
      transparent: true,
      opacity: 0.7
    });
    this.trail = new THREE.Line(trailGeometry, trailMaterial);
    this.group.add(this.trail);
    
    // 行星本体
    const geometry = new THREE.SphereGeometry(this.radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0xc1440e,
      roughness: 0.9,
      metalness: 0.1
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.group.add(this.mesh);
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
    
    this.mesh.rotation.y += 0.6 * deltaTime * timeScale;
  }
}
