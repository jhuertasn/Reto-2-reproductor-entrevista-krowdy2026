# 🎬 Reproductor Inteligente - Análisis de Entrevistas

Este proyecto es un reproductor de video avanzado construido con React y Custom Hooks, diseñado para el análisis de entrevistas mediante etiquetas temporales y el salto automático de intervalos "basura".

---

## 🧠 Sustentación del Modelo de Dominio

### 1. ¿Qué es el tiempo virtual?
El **tiempo virtual** es una ilusión matemática generada en el Frontend para el usuario final (el revisor). Es la línea de tiempo resultante de tomar la duración total y real del video y "restarle" los intervalos de tiempo basura (secciones eliminadas). 

Mientras que el elemento `<video>` de HTML avanza en *tiempo real*, nuestra capa de dominio traduce constantemente ese tiempo a *tiempo virtual*. De esta forma, si el video tiene 20 segundos de basura, el usuario percibe un progreso fluido sobre una duración total reducida, sin cortes abruptos en la interfaz gráfica ni en la barra de progreso.

### 2. ¿Cómo definiste los puntos de corte?
Los puntos de corte no se calcularon de forma estática ni manual. Se definieron construyendo una función `obtenerPuntosDeCorteVirtuales()` que realiza el siguiente algoritmo:
1. Recolecta el inicio (`start`) y fin (`end`) de **todas** las etiquetas proporcionadas en los datos crudos.
2. Agrega el inicio del video (`0`) por defecto.
3. Convierte todos estos tiempos reales a **tiempos virtuales**.
4. Elimina duplicados utilizando un `Set` y los ordena cronológicamente de menor a mayor.
*Resultado:* Un array unidimensional perfecto que la navegación por teclado (Flechas Derecha e Izquierda) usa como un "mapa" para saltar inteligentemente.

### 3. ¿Por qué la navegación es correcta incluso con solapamientos?
La navegación no falla al haber solapamientos porque **no iteramos sobre las etiquetas como objetos enteros**, sino sobre sus **límites temporales purificados** (los puntos de corte que calculamos arriba). 

Si la Etiqueta A (Verde) y la Etiqueta B (Amarilla) se solapan, no nos importa a qué etiqueta pertenece el tiempo. Nuestro sistema solo ve "eventos de cambio de estado" en la línea de tiempo virtual. La flecha derecha simplemente busca en el array `puntosDeCorte` el primer valor que sea estrictamente mayor al tiempo actual `(p > tVirtualActual + 0.1)`. Esto garantiza una navegación lineal y libre de bucles, sin importar cuántos tags compartan el mismo segundo.

---

## 📊 Diagrama del Modelo Temporal

```text
[TIEMPO REAL MP4]
0s       5s             15s       25s        28s        35s   40s  42s       45s
|--------[==============]XXXXXXXXXX|---------[==========][====]====|XXXXXXXXXX|
         Liderazgo      (BASURA)             | Comunicación   |    (BASURA)
                                             |___Trabajo_en_Equipo_|

[MOTOR DE DOMINIO - TRANSICIÓN]
⬇ (Extracción de basura y compresión de la línea de tiempo) ⬇

[TIEMPO VIRTUAL PERCIBIDO (UI / BARRA DE PROGRESO)]
0s       5s             15s                  18s        25s   30s  32s
|--------[==============]--------------------[==========][====]====|
         Liderazgo                           Com.         Trabajo E.
```

### 4. 🚀 Instalación y Despliegue

Sigue estos pasos para correr el proyecto localmente:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/jhuertasn/Reto-2-reproductor-entrevista-krowdy2026.git

    ```

2.**Ingresar a la carpeta del proyecto:**
```bash
   cd reproductor-entrevista
```

3.**Instalar Dependencias**
```bash
   npm install
```
4.**Ejecutar el servidor de desarrollo (Vite)**
```bash
   npm run dev
```
5.**Abrir el navegador y navegar a http://localhost:5173**

### Estructura del proyecto

reproductor-entrevista/
├── public/              # Archivos estáticos y videos
├── src/
│   ├── components/      # Componentes de UI (Barra de progreso personalizada)
│   │   └── ProgressBar.jsx
│   ├── hooks/           # Lógica de interacción (Custom Hook para el control del video)
│   │   └── useSmartPlayer.js
│   ├── dominio.js       # Lógica de dominio (Cálculos matemáticos de tiempo virtual y real)
│   ├── App.jsx          # Componente principal (Orquestador de la vista)
│   ├── App.css          # Estilos personalizados del reproductor (Dark Mode)
│   ├── index.css        # Estilos globales base (reset)
│   └── main.jsx         # Punto de entrada de la aplicación
├── index.html           # Plantilla base del proyecto
├── package.json         # Dependencias y scripts del proyecto
└── README.md            # Documentación completa del reto

```
