import React, { useState, useEffect } from 'react';
import './styles.css';

export default function ControlPanel({ 
  timeScale, 
  onTimeScaleChange,
  onZoomChange,
  onPlanetSelect // 新增props，用于处理行星选择
}) {
  const [isPaused, setIsPaused] = useState(false);
  const [zoom, setZoom] = useState(1);

  const handlePlayPause = () => {   // 暂停/播放
    const newPausedState = !isPaused;
    setIsPaused(newPausedState);
    onTimeScaleChange(newPausedState ? 0 : timeScale || 1);
  };

  const handleTimeScaleChange = (e) => {
    const newScale = parseFloat(e.target.value);
    // 确保速度可以双向调节
    if (newScale >= 0.1 && newScale <= 10) {
      onTimeScaleChange(newScale);
      if (isPaused) {
        setIsPaused(false);
      }
    }
  };

  const handleZoomChange = (e) => {
    const newZoom = parseFloat(e.target.value);
    setZoom(newZoom);
    onZoomChange(newZoom);
  };

  // 添加鼠标滚轮支持
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomDelta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.min(Math.max(zoom + zoomDelta, 0.1), 3);
    setZoom(newZoom);
    onZoomChange(newZoom);
  };

  // 设置初始视角
  useEffect(() => {
    onZoomChange(1.5); // 初始放大一点
  }, []);

  // 行星数据
  const planets = [
    { name: '水星', id: 'mercury' },
    { name: '金星', id: 'venus' },
    { name: '地球', id: 'earth' },
    { name: '火星', id: 'mars' },
    { name: '木星', id: 'jupiter' },
    { name: '土星', id: 'saturn' },
    { name: '天王星', id: 'uranus' },
    { name: '海王星', id: 'neptune' }
  ];

  return (
    <div className="control-panel" onWheel={handleWheel}>
      <div className="planet-buttons">
        {planets.map(planet => (
          <button 
            key={planet.id}
            className="planet-button"
            onClick={() => onPlanetSelect(planet.id)}
          >
            {planet.name}
          </button>
        ))}
      </div>
      <div className="time-controls">
        {/* { <button onClick={handlePlayPause}
          className="control-button" >
          {isPaused ? '▶' : '⏸'}
        </button> } */}
        <div className="slider-container">
          <label className="control-label">速度: {timeScale.toFixed(1)}x</label>
          <input
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={timeScale}
            onChange={handleTimeScaleChange}
            className="control-slider"
          />
        </div>
      </div>
      <div className="zoom-controls">
        <div className="slider-container">
          <label>缩放: {zoom}x</label>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={zoom}
            onChange={handleZoomChange}
          />
        </div>
      </div>
    </div>
  );
}
