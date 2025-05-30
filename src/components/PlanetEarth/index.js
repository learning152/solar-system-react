import * as THREE from 'three';

export default class PlanetEarth {
  constructor() {
    this.name = 'Earth';
    this.lsname = "地球";
    this.radius = 1.0;
    this.orbitRadius = 15.0;
    this.speed = 0.01;
    this.angle = 0;
    
    // 创建行星组
    this.group = new THREE.Group();
    
    // 初始化轨迹线
    this.trailPoints = [];
    //this.trailLength = Math.floor(365 * 0.9); // 地球轨道周期365天，保留90%
    this.trailLength = Math.floor(3650); // 地球保留轨道周期3650天
    const trailGeometry = new THREE.BufferGeometry();
    const trailMaterial = new THREE.LineBasicMaterial({ 
      color: 0x3498db,
      transparent: true,
      opacity: 0.7
    });
    this.trail = new THREE.Line(trailGeometry, trailMaterial);
    this.group.add(this.trail);
    
    // 创建行星本体
    const geometry = new THREE.SphereGeometry(this.radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0x3498db,
      roughness: 0.8,
      metalness: 0.2
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.group.add(this.mesh);
    
    // 创建月球
    const moonGeometry = new THREE.SphereGeometry(0.27, 16, 16);
    const moonMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      roughness: 0.9
    });
    this.moon = new THREE.Mesh(moonGeometry, moonMaterial);
    this.moon.position.set(1.5, 0, 0);
    this.mesh.add(this.moon);
  }
  
  update(deltaTime, timeScale = 1) {
    // 轨道运动
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
    
    // 自转
    this.mesh.rotation.y += 0.5 * deltaTime * timeScale;
    
    // 月球公转
    this.moon.rotation.y += 0.8 * deltaTime * timeScale;
  }
}
