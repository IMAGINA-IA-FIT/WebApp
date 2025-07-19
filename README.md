# 🏋️‍♂️ AI Fitness Coach - MVP

Un coach virtual inteligente para ejercicios usando React, Vite, Tailwind CSS y shadcn/ui.

## 🎯 Descripción del Proyecto

Esta aplicación web responsiva actúa como un coach virtual que detecta la postura de ejercicios usando la cámara del dispositivo y proporciona feedback en tiempo real. Está diseñada específicamente para hackathons con una interfaz moderna y profesional.

## ✨ Características Principales

### 🖥️ Interfaz de Usuario
- **Pantalla dividida**: Cámara del usuario (izquierda) + ilustración de referencia (derecha)
- **Barra de puntaje en tiempo real**: Muestra porcentaje de postura correcta con colores dinámicos
- **Feedback flotante**: Mensajes de corrección en tarjetas semitransparentes
- **Diseño responsive**: Optimizado para móvil y desktop
- **Tema moderno**: Gradientes, blur effects y micro-animaciones

### 🎛️ Controles Principales
- **Botón principal**: "Comenzar/Detener Evaluación" con estados visuales
- **Control de voz**: Toggle para activar/desactivar feedback hablado
- **Botón reset**: Reiniciar sesión de entrenamiento
- **Indicadores visuales**: Estados de cámara y evaluación

### 🏗️ Arquitectura Preparada para IA
- **Hook personalizado**: `useFitnessCoach` para lógica de negocio
- **Interfaces TypeScript**: Definidas para datos de postura y configuración
- **Referencias preparadas**: Para MediaPipe, cámara y Web Speech API
- **Estructura modular**: Fácil integración de librerías de IA

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Componentes**: shadcn/ui
- **Iconos**: Lucide React
- **Futuras integraciones**:
  - MediaPipe (detección de pose)
  - TensorFlow.js (análisis IA)
  - Web Speech API (feedback por voz)

## 🚀 Instalación y Desarrollo

### Prerrequisitos
- Node.js (≥ 18)
- npm o yarn

### Configuración
```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build

# Preview de build
npm run preview
```

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── ui/              # Componentes shadcn/ui
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── progress.tsx
│   └── FitnessCoach.tsx # Componente principal
├── hooks/
│   └── useFitnessCoach.ts # Hook para lógica de IA
├── lib/
│   └── utils.ts         # Utilidades (cn function)
├── App.tsx
├── main.tsx
└── index.css           # Estilos base + variables CSS
```

## 🎨 Componentes Principales

### `FitnessCoach.tsx`
Componente principal que renderiza toda la interfaz:
- Layout responsive con grid
- Estados de evaluación
- Feedback visual y mensajes
- Controles de usuario

### `useFitnessCoach.ts`
Hook personalizado preparado para:
- Inicialización de cámara
- Integración con MediaPipe
- Procesamiento de frames
- Detección de repeticiones
- Feedback por voz
- Gestión de estados

## 🔮 Integraciones Futuras

### 1. Detección de Pose (MediaPipe)
```typescript
// Ejemplo de integración
const initializeMediaPipe = async () => {
  const { Pose } = await import('@mediapipe/pose');
  const pose = new Pose({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
  });
  // Configuración adicional...
};
```

### 2. Análisis de Postura
```typescript
const analyzePosture = (landmarks) => {
  // Calcular ángulos de articulaciones
  // Validar postura según ejercicio
  // Generar score y feedback
};
```

### 3. Feedback por Voz
```typescript
const speakFeedback = (message) => {
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = 'es-ES';
  speechSynthesis.speak(utterance);
};
```

## 🎯 Casos de Uso

1. **Sentadillas**: Análisis de profundidad, alineación de rodillas
2. **Flexiones**: Postura de brazos, alineación corporal
3. **Plancha**: Estabilidad del core, línea recta

## 🎨 Diseño y UX

### Paleta de Colores
- **Primario**: Azul (#2563eb)
- **Éxito**: Verde (#16a34a) 
- **Advertencia**: Amarillo (#eab308)
- **Error**: Rojo (#dc2626)
- **Fondo**: Gradiente gris claro a azul

### Características UX
- **Feedback inmediato**: Colores y mensajes instantáneos
- **Estados claros**: Indicadores visuales de cada acción
- **Accesibilidad**: Contraste y tamaños apropiados
- **Mobile-first**: Diseño prioritario para dispositivos móviles

## 🏆 Optimizaciones para Hackathon

1. **Setup rápido**: Un comando instala todo
2. **Diseño listo**: Interfaz profesional sin configuración adicional
3. **Estructura preparada**: Solo agregar lógica de IA
4. **Demo-friendly**: Placeholders que simulan funcionalidad
5. **Responsive**: Funciona en cualquier dispositivo de demo

## 🔧 Próximos Pasos

1. **Integrar MediaPipe** para detección de pose real
2. **Implementar análisis de ejercicios** específicos
3. **Añadir Web Speech API** para feedback por voz
4. **Crear sistema de repeticiones** y progreso
5. **Optimizar rendimiento** para análisis en tiempo real

## 📱 Screenshots

La aplicación muestra:
- ✅ Interfaz dividida con cámara y referencia
- ✅ Barra de progreso con colores dinámicos
- ✅ Feedback flotante posicionado
- ✅ Botones de control intuitivos
- ✅ Diseño responsive completo

## 🤝 Contribución

Este MVP está listo para desarrollo colaborativo en hackathon:
1. La UI está completa y funcional
2. Los hooks están preparados para IA
3. La estructura es escalable
4. Los TODOs están claramente marcados

¡Perfecto para concentrarse en la lógica de IA sin preocuparse por el frontend!
