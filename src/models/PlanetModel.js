import * as THREE from 'three';

export class Planet {
  constructor(name, data) {
    this.name = name;
    this.chineseName = data.chineseName; // 添加中文名字
    this.Diameter = data.Diameter; // 添加直径
    this.Period = data.Period; // 添加公转周期
    this.Revolution = data.Revolution; // 添加自转周期
    this.temperature_range = data.temperature_range; // 添加温度范围
    this.Mass = data.Mass; // 添加质量
    this.Gravity  = data.Gravity; // 添加重力加速度

    this.radius = data.radius;    // 添加半径
    this.orbitRadius = data.orbitRadius; // 添加轨道半径
    this.orbitSpeed = data.orbitSpeed; // 添加轨道速度
    this.textureUrl = data.textureUrl; // 添加纹理路径
    this.mesh = null; // 添加mesh属性
    this.orbitGroup = new THREE.Group(); // 添加轨道组
    this.angle = 0; // 添加角度属性
  }

  async loadTexture() {
    const textureLoader = new THREE.TextureLoader();
    const texture = await new Promise((resolve) => {
      textureLoader.load(this.textureUrl, resolve);
    });
    return texture;
  }

  async createMesh() {
    const texture = await this.loadTexture();
    const geometry = new THREE.SphereGeometry(this.radius, 32, 32);
    const material = new THREE.MeshPhongMaterial({ map: texture });
    this.mesh = new THREE.Mesh(geometry, material);
    this.orbitGroup.add(this.mesh);
    return this.orbitGroup;
  }

  update(deltaTime, timeScale) {
    this.angle += deltaTime * this.orbitSpeed * timeScale;
    this.mesh.position.x = Math.cos(this.angle) * this.orbitRadius;
    this.mesh.position.z = Math.sin(this.angle) * this.orbitRadius;
  }
}

export const planetData = {
  sun: {
    chineseName: '太阳',
    radius: 2,
    textureUrl: 'https://solarsystem.nasa.gov/resources/2352/sun-3d-model/',
    color: 0xffff00,
    facts: [
      "太阳是太阳系的中心，也是最大的恒星",
      "太阳系中99.86%的质量集中在太阳",
      "太阳的年龄约为46亿年",
      "太阳系中8个行星围绕其旋转",
      "太阳系中最大的恒星"
    ]
  },
  mercury: {
    chineseName: '水星',
    radius: 0.38,
    orbitRadius: 5.79,
    orbitSpeed: 0.0041,
    textureUrl: 'https://solarsystem.nasa.gov/resources/2133/mercury-3d-model/',
    facts: [
      "太阳系最小的行星(直径4,880km)",
      "公转最快：88天绕太阳一周",
      "昼夜温差最大：-173°C到427°C",
      "表面布满撞击坑",
      "没有真正的大气层"
    ],
    Diameter : 4880, // 直径(千米),
    Period: 87.97, // 公转周期(天),
    Revolution: 58.6, // 自转周期(小时),
    temperature_range:[-173,427], // 温度范围(摄氏度),
    Mass: 0.055, // 质量(地球的1/10),
    Gravity: 0.38, // 重力加速度(地球的1/4)
  },
  venus: {
    chineseName: '金星',
    radius: 0.95,
    orbitRadius: 10.82,
    orbitSpeed: 0.0015,
    textureUrl: 'https://solarsystem.nasa.gov/resources/2343/venus-3d-model/',
    facts: [
      "最热的行星(平均462°C)",
      "自转方向相反且最慢(243天/转)",
      "大气压力是地球的92倍",
      "被硫酸云层覆盖",
      "没有天然卫星"
    ],
    Diameter : 12104, // 直径(千米),
    Period: 224.70, // 公转周期(天),
    Revolution: 5832.0, // 自转周期(小时)（逆向自转，约243天）,
    temperature_range:[462,462], // 温度范围(摄氏度)（表面均温约462℃）,
    Mass: 0.815, // 质量(地球的1/10),
    Gravity: 0.904, // 重力加速度(地球的1/4)
  },
  earth: {
    chineseName: '地球',
    radius: 1.0,
    orbitRadius: 15.00,
    orbitSpeed: 0.01,
    textureUrl: 'https://solarsystem.nasa.gov/resources/2393/earth-3d-model/',
    facts: [
      "唯一已知有生命的行星",
      "表面71%被水覆盖",
      "板块持续移动(1-10cm/年)", 
      "拥有强大的保护磁场",
      "自转速度正在减慢"
    ],
    Diameter : 12742, // 直径(千米),
    Period: 365.24, // 公转周期(天),
    Revolution: 23.93, // 自转周期(小时)（约23小时56分）,
    temperature_range:[-89,56.7], // 温度范围(摄氏度)（极端记录）,
    Mass: 1.0, // 质量(地球的1/10)（基准值）,
    Gravity: 1.0, // 重力加速度(地球的1/4)（基准值）
  },
  mars: {
    chineseName: '火星',
    radius:1.52,
    orbitRadius: 22.79,
    orbitSpeed: 0.0005,
    textureUrl: 'https://solarsystem.nasa.gov/resources/2372/mars-3d-model/',
    facts: [
      "拥有太阳系最高的火山(奥林匹斯山,21km)",
      "两个不规则形状的卫星(火卫一、火卫二)",
      "一天长度24.6小时(与地球相近)",
      "大气中95%是二氧化碳",
      "表面有古代河床痕迹"
    ],
    Diameter : 6779, // 直径(千米),
    Period: 687.0, // 公转周期(天),
    Revolution: 24.62, // 自转周期(小时)（约24小时37分）,
    temperature_range:[-143,35], // 温度范围(摄氏度),
    Mass: 0.107, // 质量(地球的1/10),
    Gravity: 0.377, // 重力加速度(地球的1/4)
  },
  jupiter: {
    chineseName: '木星',
    radius: 1.52,
    orbitRadius: 30.07,
    orbitSpeed: 0.00008,
    textureUrl: 'https://solarsystem.nasa.gov/resources/2395/jupiter-3d-model/',
    facts: [
      "最大的行星(可装下1300个地球)",
      "拥有92颗已知卫星",
      "大红斑风暴已持续400年",
      "磁场强度是地球的20,000倍",
      "自转最快(9.9小时/转)"
    ],
    Diameter : 139820, // 直径(千米),
    Period: 4332.5, // 公转周期(天),
    Revolution: 9.93, // 自转周期(小时)（约9小时55分）,
    temperature_range:[-148,"N/A"], // 温度范围(摄氏度)（无固体表面，为云顶温度）,
    Mass: 317.8, // 质量(地球的1/10)（约为地球的317.8倍）,
    Gravity: 2.479, // 重力加速度(地球的1/4)（云顶重力）
  },
  saturn: {
    chineseName: '土星',
    radius: 1.21,
    orbitRadius: 39.48,
    orbitSpeed: 0.00003,
    textureUrl: 'https://solarsystem.nasa.gov/resources/2396/saturn-3d-model/',
    facts: [
      "密度最低(可浮在水上)",
      "环系统跨度达282,000km",
      "拥有83颗已知卫星",
      "风速可达1800公里/小时",
      "一天仅10.7小时"
    ],
    Diameter : 116460, // 直径(千米),
    Period: 10759.2, // 公转周期(天)（约29.5年）,
    Revolution: 10.66, // 自转周期(小时)（约10小时40分）,
    temperature_range:[-178,"N/A"], // 温度范围(摄氏度)（无固体表面，为云顶温度）,
    Mass: 95.16, // 质量(地球的1/10)（约为地球的95.16倍）,
    Gravity: 1.065, // 重力加速度(地球的1/4)（云顶重力）
  },
  uranus: {
    chineseName: '天王星',
    radius: 0.91,
    orbitRadius: 50.07,
    orbitSpeed: 0.00001,
    textureUrl: 'https://solarsystem.nasa.gov/resources/2354/uranus-3d-model/',
    facts: [
      "自转轴倾斜98度(躺着旋转)",
      "大气中甲烷使其呈蓝色",
      "有13个暗淡的环系统",
      "最冷的行星(-224°C)",
      "27颗已知卫星都以莎士比亚人物命名"
    ],
    Diameter : 50724, // 直径(千米),
    Period: 30687.0, // 公转周期(天)（约84年）,
    Revolution: 17.24, // 自转周期(小时)（约17小时14分，轴向倾斜98°）,
    temperature_range:[-224,"N/A"], // 温度范围(摄氏度)（无固体表面，为云顶温度）,
    Mass: 14.54, // 质量(地球的1/10)（约为地球的14.54倍）,
    Gravity: 0.886, // 重力加速度(地球的1/4)（云顶重力）
  },
  neptune: {
    chineseName: '海王星',
    radius: 0.82,
    orbitRadius: 60.19,
    orbitSpeed: 0.000006,
    textureUrl: 'https://solarsystem.nasa.gov/resources/2364/neptune-3d-model/',
    facts: [
      "风速最快(2100km/h)",
      "唯一通过数学预测发现的行星",
      "有6个主要环系统",
      "14颗卫星，海卫一有冰火山",
      "内部热源使天气活跃"
    ],
    Diameter : 49244, // 直径(千米),
    Period: 60190.0, // 公转周期(天)（约164.8年）,
    Revolution: 16.11, // 自转周期(小时)（约16小时6分）,
    temperature_range:[-221,"N/A"], // 温度范围(摄氏度)（无固体表面，为云顶温度）,
    Mass: 17.15, // 质量(地球的1/10)（约为地球的17.15倍）,
    Gravity: 1.140, // 重力加速度(地球的1/4)（云顶重力）
  }
};
