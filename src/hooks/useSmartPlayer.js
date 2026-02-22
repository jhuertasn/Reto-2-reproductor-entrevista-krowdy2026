// src/hooks/useSmartPlayer.js
import { useRef, useState, useEffect, useCallback } from 'react';
import { verificarSalto, realAVirtual, calcularDuracionVirtual, virtualAReal, obtenerPuntosDeCorteVirtuales } from '../dominio';

export const useSmartPlayer = () => {
  const videoRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); 
  const [virtualTime, setVirtualTime] = useState(0); 
  const [duration, setDuration] = useState(0);       

  // Función para forzar Play/Pause leyendo el estado nativo del video
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  }, []);

  const seekVirtual = useCallback((newVirtualTime) => {
    const video = videoRef.current;
    if (!video) return;
    
    const realTime = virtualAReal(newVirtualTime);
    video.currentTime = realTime;
    setCurrentTime(realTime);
    setVirtualTime(newVirtualTime);
  }, []);

  const onTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const tiempoActual = video.currentTime;
    const salto = verificarSalto(tiempoActual);
    
    if (salto) {
      video.currentTime = salto;
      return; 
    }

    setCurrentTime(tiempoActual);
    setVirtualTime(realAVirtual(tiempoActual));
    // Sincronizamos el estado isPlaying por si el video termina
    setIsPlaying(!video.paused);
  };

  const onLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // --- NUEVO: NAVEGACIÓN INTELIGENTE POR TECLADO ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      const video = videoRef.current;
      if (!video) return;

      // Barra Espaciadora: Play/Pause
      if (e.code === 'Space') {
        e.preventDefault(); // Evita que la página haga scroll hacia abajo
        togglePlay();
      }

      // Flecha Derecha: Siguiente punto de corte
      if (e.code === 'ArrowRight') {
        e.preventDefault();
        const tVirtualActual = realAVirtual(video.currentTime);
        const cortes = obtenerPuntosDeCorteVirtuales();
        
        // Buscamos el primer corte que sea mayor al tiempo actual (+ un pequeño margen de 0.1s)
        const siguientePunto = cortes.find(p => p > tVirtualActual + 0.1);
        if (siguientePunto !== undefined) {
          seekVirtual(siguientePunto);
        }
      }

      // Flecha Izquierda: Punto de corte anterior
      if (e.code === 'ArrowLeft') {
        e.preventDefault();
        const tVirtualActual = realAVirtual(video.currentTime);
        const cortes = obtenerPuntosDeCorteVirtuales();
        
        // Invertimos el array para buscar el primer corte que sea menor al tiempo actual
        // se modifico de 0.5 a 1.5 para que el usuario pueda saltar a un punto de corte anterior
        const puntoAnterior = [...cortes].reverse().find(p => p < tVirtualActual - 1.5);
        if (puntoAnterior !== undefined) {
          seekVirtual(puntoAnterior);
        } else {
          seekVirtual(0); // Si no hay anterior, volvemos al inicio
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [seekVirtual, togglePlay]); 

  return {
    videoRef,
    playerState: {
      isPlaying,
      currentTime,
      virtualTime,
      duration,
      virtualDuration: calcularDuracionVirtual(duration)
    },
    actions: { togglePlay, onTimeUpdate, onLoadedMetadata, seekVirtual }
  };
};