import * as THREE from 'three';

export default class AsteroidBelt {
  constructor() {
    this.innerRadius = 28;
    this.outerRadius = 32;
    this.count = 2000;
    
    this.group = new THREE.Group();
    
    // 创建小行星带几何体
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.count * 3);
    const colors = new Float32Array(this.count * 3);
    const sizes = new Float32Array(this.count);
    
    const color = new THREE.Color();
    
    for (let i = 0; i < this.count; i++) {
      // 随机位置(环形区域)
      const radius = THREE.MathUtils.randFloat(this.innerRadius, this.outerRadius);
      const angle = THREE.MathUtils.randFloat(0, Math.PI * 2);
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = THREE.MathUtils.randFloat(-0.5, 0.5);
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      
      // 随机颜色(灰褐色系)
      color.setHSL(0.1, 0.1, THREE.MathUtils.randFloat(0.2, 0.5));
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // 随机大小
      sizes[i] = THREE.MathUtils.randFloat(0.01, 0.1);
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // 创建材质
    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });
    
    this.mesh = new THREE.Points(geometry, material);
    this.group.add(this.mesh);
  }
  
  update(deltaTime, timeScale = 1) {
    // 小行星带缓慢旋转
    this.mesh.rotation.y += 0.01 * deltaTime * timeScale;
  }
}
