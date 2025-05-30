import * as THREE from 'three';

export default class PlanetMercury {
  constructor() {
    this.name = 'mercury';
    this.chineseName = '水星';
    this.radius = 0.38;
    this.orbitRadius = 5.8;
    this.speed = 0.04;
    this.angle = 0;
    
    this.group = new THREE.Group();
    
    // 初始化轨迹线
    this.trailPoints = [];
    //this.trailLength = Math.floor(88 * 0.9); // 水星轨道周期88天，保留90%
    this.trailLength = Math.floor(3650); // 水星轨道周期88天，保留90%
    const trailGeometry = new THREE.BufferGeometry();
    const trailMaterial = new THREE.LineBasicMaterial({ 
      color: 0xb5b5b5, // 水星灰色
      transparent: true,
      opacity: 0.7
    });
    this.trail = new THREE.Line(trailGeometry, trailMaterial);
    this.group.add(this.trail);
    
    // 行星本体
    const geometry = new THREE.SphereGeometry(this.radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0xb5b5b5,
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
