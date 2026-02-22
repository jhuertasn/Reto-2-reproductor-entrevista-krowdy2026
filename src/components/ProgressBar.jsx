// src/components/ProgressBar.jsx
import React from 'react';
import { ETIQUETAS, calcularPosicionVirtual } from '../dominio';

export const ProgressBar = ({ virtualTime, virtualDuration, onSeek }) => {
  // Calculamos qué tan llena debe verse la barra
  const progressPercent = virtualDuration ? (virtualTime / virtualDuration) * 100 : 0;

  // Manejar el clic en la barra para saltar en el tiempo
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left; // Dónde hizo clic relativo a la barra
    const percent = clickX / rect.width;
    const newVirtualTime = percent * virtualDuration;
    onSeek(newVirtualTime); // Le decimos al reproductor que salte a este tiempo virtual
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <div 
        onClick={handleClick}
        style={{
          position: 'relative',
          height: '24px',
          backgroundColor: '#333', // Fondo de la barra
          borderRadius: '4px',
          cursor: 'pointer',
          overflow: 'hidden',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
        }}
      >
        {/* 1. Indicador de Progreso (La parte que se va llenando) */}
        <div 
          style={{
            position: 'absolute',
            top: 0, left: 0, bottom: 0,
            width: `${progressPercent}%`,
            backgroundColor: 'rgba(255, 255, 255, 0.2)', // Blanco semitransparente
            transition: 'width 0.1s linear',
            zIndex: 10
          }}
        />

        {/* 2. Las Etiquetas (Tags) de Competencias */}
        {ETIQUETAS.map(tag => {
          const { left, width } = calcularPosicionVirtual(tag.start, tag.end, virtualDuration);
          
          // Lógica de UX: Resaltar la etiqueta si el tiempo actual está dentro de ella
          const isActive = virtualTime >= (left / 100 * virtualDuration) && 
                           virtualTime <= ((left + width) / 100 * virtualDuration);

          return (
            <div 
              key={tag.id}
              title={tag.title}
              style={{
                position: 'absolute',
                top: isActive ? 0 : '4px',       // Crece si está activa
                bottom: isActive ? 0 : '4px',    // Crece si está activa
                left: `${left}%`,
                width: `${width}%`,
                backgroundColor: tag.color,
                opacity: isActive ? 1 : 0.6,     // Más brillante si está activa
                borderLeft: '1px solid #1a1a1a',
                borderRight: '1px solid #1a1a1a',
                transition: 'all 0.2s ease',
                zIndex: 5
              }}
            />
          );
        })}
      </div>
    </div>
  );
};