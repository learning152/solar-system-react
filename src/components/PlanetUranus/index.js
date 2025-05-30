import * as THREE from 'three';

export default class PlanetUranus {
  constructor() {
    this.name = 'uranus';
    this.chineseName = '天王星';
    this.radius = 0.9;
    this.orbitRadius = 287.1;
    this.speed = 0.0007;
    this.angle = 0;
    
    this.group = new THREE.Group();
    
    // 初始化轨迹线
    this.trailPoints = [];
    this.trailLength = 36500; // 统一轨道保留时间3650天
    const trailGeometry = new THREE.BufferGeometry();
    const trailMaterial = new THREE.LineBasicMaterial({ 
      color: 0x7ecdf4, // 天王星浅蓝色
      transparent: true,
      opacity: 0.7
    });
    this.trail = new THREE.Line(trailGeometry, trailMaterial);
    this.group.add(this.trail);
    
    // 行星本体
    const geometry = new THREE.SphereGeometry(this.radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0x7ec4c1,
      roughness: 0.8,
      metalness: 0.1
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.x = Math.PI / 2; // 天王星自转轴倾斜
    this.group.add(this.mesh);
    
    // 添加环系统
    const ringGeometry = new THREE.RingGeometry(this.radius * 1.2, this.radius * 1.5, 32);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0x5e9e9c,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5
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
    
    this.mesh.rotation.y += 0.2 * deltaTime * timeScale;
  }
}
