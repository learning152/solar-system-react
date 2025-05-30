import * as THREE from 'three';

export default class PlanetVenus {
  constructor() {
    this.name = 'venus';
    this.chineseName = '金星';
    this.radius = 0.95;
    this.orbitRadius = 10.8;
    this.speed = 0.015;
    this.angle = 0;
    
    this.group = new THREE.Group();
    
    // 初始化轨迹线
    this.trailPoints = [];
    // this.trailLength = Math.floor(225 * 0.9); // 金星轨道周期225天，保留90%
    this.trailLength = Math.floor(3650); // 金星轨道周期225天，保留90%
    const trailGeometry = new THREE.BufferGeometry();
    const trailMaterial = new THREE.LineBasicMaterial({ 
      color: 0xe6b35c, // 金星黄色
      transparent: true,
      opacity: 0.7
    });
    this.trail = new THREE.Line(trailGeometry, trailMaterial);
    this.group.add(this.trail);
    
    // 行星本体
    const geometry = new THREE.SphereGeometry(this.radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0xe6b35c,
      roughness: 0.8,
      metalness: 0.2
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
    
    this.mesh.rotation.y += 0.2 * deltaTime * timeScale;
  }
}
