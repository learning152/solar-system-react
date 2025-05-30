import * as THREE from 'three';

export default class PlanetJupiter {
  constructor() {
    this.name = 'jupiter';
    this.chineseName = '木星';
    this.radius = 1.9;
    this.orbitRadius = 77.8;
    this.speed = 0.002;
    this.angle = 0;
    
    this.group = new THREE.Group();
    
    // 初始化轨迹线
    this.trailPoints = [];
    this.trailLength = 36500; // 统一轨道保留时间3650天
    const trailGeometry = new THREE.BufferGeometry();
    const trailMaterial = new THREE.LineBasicMaterial({ 
      color: 0xb07f35, // 木星棕色
      transparent: true,
      opacity: 0.7
    });
    this.trail = new THREE.Line(trailGeometry, trailMaterial);
    this.group.add(this.trail);
    
    // 行星本体
    const geometry = new THREE.SphereGeometry(this.radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0xc88b3a,
      roughness: 0.8,
      metalness: 0.3
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.group.add(this.mesh);
    
    // 添加条纹纹理
    const stripeMaterial = new THREE.MeshStandardMaterial({
      color: 0x9d6b29,
      roughness: 0.7
    });
    const stripeGeometry = new THREE.SphereGeometry(this.radius * 1.01, 32, 32);
    const stripeMesh = new THREE.Mesh(stripeGeometry, stripeMaterial);
    stripeMesh.scale.set(1, 0.9, 1);
    this.mesh.add(stripeMesh);
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
    
    this.mesh.rotation.y += 0.4 * deltaTime * timeScale;
  }
}
