// src/components/ProgressBar.jsx
import React, { useState } from 'react';
import { ETIQUETAS, calcularPosicionVirtual } from '../dominio';

export const ProgressBar = ({ virtualTime, virtualDuration, onSeek }) => {
  const progressPercent = virtualDuration ? (virtualTime / virtualDuration) * 100 : 0;
  
  // Estado para saber qué etiqueta está siendo apuntada por el mouse
  const [hoveredTag, setHoveredTag] = useState(null);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left; 
    const percent = clickX / rect.width;
    const newVirtualTime = percent * virtualDuration;
    onSeek(newVirtualTime); 
  };

  return (
    <div style={{ marginTop: '20px', paddingBottom: '10px' }}>
      <div 
        onClick={handleClick}
        style={{
          position: 'relative',
          height: '14px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)', 
          borderRadius: '8px',
          cursor: 'pointer',
          // overflow: 'visible' es clave aquí para que el tooltip pueda salir de la barra
          overflow: 'visible',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
        }}
      >
        {/* 1. Indicador de Progreso (El velo blanco que avanza) */}
        <div 
          style={{
            position: 'absolute',
            top: 0, left: 0, bottom: 0,
            width: `${progressPercent}%`,
            backgroundColor: 'rgba(255, 255, 255, 0.25)', 
            borderRadius: '8px',
            transition: 'width 0.1s linear',
            zIndex: 1
          }}
        />

        {/* 2. Las Etiquetas (Tags) de Competencias */}
        {ETIQUETAS.map(tag => {
          const { left, width } = calcularPosicionVirtual(tag.start, tag.end, virtualDuration);
          
          // Lógica de UX: ¿El video está pasando por aquí?
          const isActive = virtualTime >= (left / 100 * virtualDuration) && 
                           virtualTime <= ((left + width) / 100 * virtualDuration);
          
          // ¿El mouse está encima?
          const isHovered = hoveredTag === tag.id;

          return (
            <div 
              key={tag.id}
              onMouseEnter={() => setHoveredTag(tag.id)}
              onMouseLeave={() => setHoveredTag(null)}
              style={{
                position: 'absolute',
                // Si está activa o con hover, se hace un poco más alta
                top: isActive || isHovered ? '-2px' : '0px',       
                bottom: isActive || isHovered ? '-2px' : '0px',    
                left: `${left}%`,
                width: `${width}%`,
                backgroundColor: tag.color,
                opacity: isActive || isHovered ? 1 : 0.6,     
                borderRadius: '4px',
                transition: 'all 0.2s ease',
                zIndex: isActive || isHovered ? 10 : 5
              }}
            >
              {/* 3. TOOLTIP CUSTOMIZADO (Aparece solo al hacer hover) */}
              {isHovered && (
                <div style={{
                  position: 'absolute',
                  bottom: '24px', // Lo empujamos hacia arriba de la barra
                  left: '50%',
                  transform: 'translateX(-50%)', // Para centrarlo exactamente en el tag
                  backgroundColor: '#17171b', // Color de tu panel oscuro
                  border: `1px solid ${tag.color}`, // Borde del color de la competencia
                  color: '#f0ede8',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap', // Evita que el texto se rompa en dos líneas
                  pointerEvents: 'none', // Evita bugs si el mouse toca el tooltip
                  boxShadow: '0 8px 16px rgba(0,0,0,0.8)',
                  zIndex: 20
                }}>
                  {tag.title}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};