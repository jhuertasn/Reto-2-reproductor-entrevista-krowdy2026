// src/dominio.js

export const VIDEO_URL = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

// Zonas "basura" que el video DEBE saltarse
export const TRAMOS_OCULTOS = [
  { start: 15, end: 25 }, // Salto 1
  { start: 45, end: 55 }  // Salto 2
];

export const ETIQUETAS = [
  { id: 1, title: 'Liderazgo', start: 5, end: 12, color: '#ef4444' },
  { id: 2, title: 'Buena Comunicación', start: 28, end: 40, color: '#22c55e' },
  { id: 3, title: 'Trabajo en Equipo', start: 35, end: 42, color: '#eab308' },
  { id: 4, title: 'Resolución de Problemas', start: 60, end: 75, color: '#3b82f6' }
];

// --- LÓGICA PURA (El Cerebro) ---

// 1. Calcula la duración TOTAL del video restando la basura
// Si el video dura 120s y quitamos 20s, la duración virtual es 100s.
export const calcularDuracionVirtual = (duracionReal) => {
  if (!duracionReal) return 0;
  const tiempoBorrado = TRAMOS_OCULTOS.reduce((acc, tramo) => acc + (tramo.end - tramo.start), 0);
  return duracionReal - tiempoBorrado;
};

// 2. Convierte Tiempo Real -> Tiempo Virtual
// Sirve para pintar la barra de progreso correctamente.
export const realAVirtual = (tiempoReal) => {
  let tiempoDescontado = 0;
  
  for (let tramo of TRAMOS_OCULTOS) {
    if (tiempoReal >= tramo.end) {
      // Si ya pasamos este tramo, restamos su duración completa
      tiempoDescontado += (tramo.end - tramo.start);
    } else if (tiempoReal > tramo.start && tiempoReal < tramo.end) {
      // Si estamos DENTRO de un tramo oculto (caso raro visualmente), restamos lo que llevamos
      tiempoDescontado += (tiempoReal - tramo.start);
    }
  }
  
  return tiempoReal - tiempoDescontado;
};

// 3. Detecta si estamos en una zona prohibida y nos dice a dónde saltar
export const verificarSalto = (tiempoActual) => {
  const tramoActual = TRAMOS_OCULTOS.find(
    tramo => tiempoActual >= tramo.start && tiempoActual < tramo.end
  );
  
  // Si encontramos un tramo, devolvemos a dónde debe saltar (tramo.end)
  return tramoActual ? tramoActual.end : null;
};