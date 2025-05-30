import * as THREE from 'three';

export default class PlanetSaturn {
  constructor() {
    this.name = 'saturn';
    this.chineseName = '土星';
    this.radius = 1.6;
    this.orbitRadius = 143.4;
    this.speed = 0.001;
    this.angle = 0;
    
    this.group = new THREE.Group();
    
    // 初始化轨迹线
    this.trailPoints = [];
    this.trailLength = 36500; // 统一轨道保留时间3650天
    const trailGeometry = new THREE.BufferGeometry();
    const trailMaterial = new THREE.LineBasicMaterial({ 
      color: 0xd1c7a8, // 土星米色
      transparent: true,
      opacity: 0.7
    });
    this.trail = new THREE.Line(trailGeometry, trailMaterial);
    this.group.add(this.trail);
    
    // 行星本体
    const geometry = new THREE.SphereGeometry(this.radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0xe3d9b0,
      roughness: 0.7,
      metalness: 0.2
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.group.add(this.mesh);
    
    // 添加土星环
    const ringGeometry = new THREE.RingGeometry(this.radius * 1.5, this.radius * 2.5, 32);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0xc2b280,
      side: THREE.DoubleSide
    });
    this.ring = new THREE.Mesh(ringGeometry, ringMaterial);
    this.ring.rotation.x = Math.PI / 2;
    this.mesh.add(this.ring);
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
    this.ring.rotation.z += 0.1 * deltaTime * timeScale;
  }
}
