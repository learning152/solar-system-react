import React from 'react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import SolarSystemScene from '../scenes/SolarSystemScene';

// 设置Three.js模拟
jest.mock('three', () => {
  const THREE = jest.requireActual('three');
  return {
    ...THREE,
    Scene: jest.fn().mockImplementation(() => ({
      add: jest.fn(),
      remove: jest.fn()
    })),
    WebGLRenderer: jest.fn().mockImplementation(() => ({
      setSize: jest.fn(),
      domElement: document.createElement('div'),
      render: jest.fn()
    })),
    PerspectiveCamera: jest.fn().mockImplementation(() => ({
      position: { set: jest.fn() },
      lookAt: jest.fn(),
      updateProjectionMatrix: jest.fn()
    })),
    SphereGeometry: jest.fn(),
    MeshBasicMaterial: jest.fn(),
    Mesh: jest.fn().mockImplementation(() => ({
      position: { set: jest.fn() },
      rotation: { set: jest.fn() }
    })),
    Points: jest.fn(),
    PointsMaterial: jest.fn(),
    BufferGeometry: jest.fn(),
    Float32BufferAttribute: jest.fn(),
    AmbientLight: jest.fn(),
    DirectionalLight: jest.fn()
  };
});

describe('Solar System Integration Test', () => {
  beforeAll(() => {
    // Mock Three.js渲染器
    jest.spyOn(THREE, 'WebGLRenderer').mockImplementation(() => ({
      setSize: jest.fn(),
      domElement: document.createElement('div')
    }));
  });

  test('initializes solar system scene', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    
    act(() => {
      createRoot(container).render(<SolarSystemScene />);
    });
    
    // 验证基础Three.js对象创建
    expect(THREE.Scene).toHaveBeenCalled();
    expect(THREE.PerspectiveCamera).toHaveBeenCalled();
    expect(THREE.WebGLRenderer).toHaveBeenCalled();
    
    // 验证光源创建
    expect(THREE.AmbientLight).toHaveBeenCalled();
    expect(THREE.DirectionalLight).toHaveBeenCalled();
    
    // 验证星空背景创建
    expect(THREE.Points).toHaveBeenCalled();
  });

  test('sets up animation system', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    
    act(() => {
      createRoot(container).render(<SolarSystemScene />);
    });
    
    // 验证渲染循环设置
    expect(THREE.WebGLRenderer().render).toHaveBeenCalled();
    
    // 验证窗口resize事件监听
    expect(window.addEventListener).toHaveBeenCalledWith(
      'resize', expect.any(Function)
    );
  });
});
