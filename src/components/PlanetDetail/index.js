import React from 'react';
import './styles.css';


export default function PlanetDetail({ planet, onClose }) {
  if (!planet) return null;

  return (
    <div className="planet-detail">
      <button className="close-btn" onClick={onClose}>×</button>
      <h2> <span>{planet.chineseName || planet.name}</span> / <span>{planet.name.toUpperCase()}</span>  </h2>
      
      

      <div className="planet-info">
        <div className="planet-stats">
          <h3>行星参数</h3>
          <ul>
            <li>直径: {planet.Diameter} km</li>
            <li>公转周期: {planet.Period} 天</li>
            <li>自转周期: { planet.Revolution} 小时</li>
            <li>质量: {planet.Mass}</li>
            <li>温度范围: {planet.temperature_range[0]}~{planet.temperature_range[1]}℃ </li>
            <li>重力加速度: {planet.Gravity} </li>
          </ul>
        </div>

        <div className="planet-facts">
          <h3>趣味知识</h3>
          <ul>
            {planet.facts.map((fact, index) => (
              <li key={index}>{fact}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
