// src/hooks/useSmartPlayer.js
import { useRef, useState } from 'react';
import { verificarSalto, realAVirtual, calcularDuracionVirtual, virtualAReal } from '../dominio';

export const useSmartPlayer = () => {
  const videoRef = useRef(null);
  
  // Estados del reproductor
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); 
  const [virtualTime, setVirtualTime] = useState(0); 
  const [duration, setDuration] = useState(0);       

  // Acción: Play / Pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Evento: Actualización de tiempo (El corazón del auto-skip)
  const onTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const tiempoActual = video.currentTime;

    // 1. Verificar si hay que saltar (Lógica de Dominio)
    const salto = verificarSalto(tiempoActual);
    if (salto) {
      console.log(`🦘 Salto inteligente: de ${tiempoActual.toFixed(2)}s a ${salto}s`);
      video.currentTime = salto;
      return; 
    }

    // 2. Actualizar estados
    setCurrentTime(tiempoActual);
    setVirtualTime(realAVirtual(tiempoActual));
  };

  // Evento: Carga de metadatos
  const onLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };


  // NUEVA ACCIÓN: Saltar a un tiempo virtual específico
  const seekVirtual = (newVirtualTime) => {
    const video = videoRef.current;
    if (!video) return;
    
    // Traducimos el tiempo virtual al real para decírselo al video
    const realTime = virtualAReal(newVirtualTime);
    video.currentTime = realTime;
    
    // Forzamos la actualización de la UI
    setCurrentTime(realTime);
    setVirtualTime(newVirtualTime);
  };

  // Retornamos todo lo que la UI necesita para funcionar
  return {
    videoRef,
    playerState: {
      isPlaying,
      currentTime,
      virtualTime,
      duration,
      virtualDuration: calcularDuracionVirtual(duration) // Calculado al vuelo
    },
    actions: {
      togglePlay,
      onTimeUpdate,
      onLoadedMetadata,
      seekVirtual
    }
  };
};

