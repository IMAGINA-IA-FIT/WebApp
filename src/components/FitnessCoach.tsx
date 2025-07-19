import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Square, ArrowLeft, Camera, Download } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  emoji: string;
}

const FitnessCoach = () => {
  // Estados principales
  const [currentView, setCurrentView] = useState<'selection' | 'workout'>('selection');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [hasRecording, setHasRecording] = useState(false);
  const [coachFeedback, setCoachFeedback] = useState<string>("");

  // Referencias
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Ejercicios disponibles - minimalista
  const exercises: Exercise[] = [
    { id: 'squat', name: 'Sentadillas', emoji: '🏋️‍♀️' },
    { id: 'pushup', name: 'Flexiones', emoji: '💪' },
    { id: 'plank', name: 'Plancha', emoji: '🧘‍♂️' }
  ];

  // Consejos específicos por ejercicio
  const getExerciseTips = (exerciseId: string | undefined): string[] => {
    switch (exerciseId) {
      case 'squat':
        return [
          'Pies separados al ancho de los hombros',
          'Mantén la espalda recta y el pecho arriba',
          'Baja como si te sentaras en una silla',
          'Peso distribuido en los talones',
          'Rodillas alineadas con los pies'
        ];
      case 'pushup':
        return [
          'Manos ligeramente más anchas que los hombros',
          'Cuerpo en línea recta de cabeza a talones',
          'Baja hasta que el pecho casi toque el suelo',
          'Mantén el core contraído',
          'Empuja con fuerza hacia arriba'
        ];
      case 'plank':
        return [
          'Apóyate en antebrazos y pies',
          'Mantén el cuerpo completamente recto',
          'Contrae los músculos abdominales',
          'No dejes que las caderas se eleven',
          'Respira de manera constante'
        ];
      default:
        return ['Selecciona un ejercicio para ver los consejos'];
    }
  };

  // Inicializar cámara (frontal en mobile, trasera en desktop)
  const initCamera = async () => {
    try {
      const isMobile = window.innerWidth < 768;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 720, max: 1280 },
          height: { ideal: 480, max: 720 },
          facingMode: isMobile ? 'user' : 'user' // Siempre frontal para verse a sí mismo
        },
        audio: true
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        await videoRef.current.play();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('No se pudo acceder a la cámara');
    }
  };

  // Iniciar grabación y coach IA
  const startRecording = () => {
    if (!streamRef.current) return;

    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: 'video/webm;codecs=vp9'
    });

    mediaRecorderRef.current = mediaRecorder;
    setRecordedChunks([]);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks(prev => [...prev, event.data]);
      }
    };

    mediaRecorder.onstop = () => {
      setHasRecording(true);
      setCoachFeedback("");
    };

    mediaRecorder.start();
    setIsRecording(true);
    
    // Iniciar feedback del coach IA
    startCoachFeedback();
  };

  // Simular feedback del coach IA en tiempo real
  const startCoachFeedback = () => {
    const feedbackMessages = [
      "Perfecto, mantén esa postura",
      "Baja un poco más la cadera",
      "Excelente, espalda bien recta",
      "Peso en los talones",
      "Muy bien, sigue así",
      "Controla la velocidad al subir",
      "Rodillas alineadas, perfecto"
    ];

    // Feedback inicial
    setTimeout(() => {
      setCoachFeedback("Comenzamos... mantén la postura");
      speakFeedback("Comenzamos, mantén la postura");
    }, 1000);

    // Feedback periódico cada 3-5 segundos
    const interval = setInterval(() => {
      if (!isRecording) {
        clearInterval(interval);
        return;
      }
      
      const randomFeedback = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];
      setCoachFeedback(randomFeedback);
      speakFeedback(randomFeedback);
    }, 4000);

    return interval;
  };

  // Detener grabación y coach IA
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setCoachFeedback("Ejercicio completado. ¡Buen trabajo!");
      speakFeedback("Ejercicio completado. ¡Buen trabajo!");
    }
  };

  // Descargar video (placeholder para Google Cloud)
  const downloadVideo = () => {
    if (recordedChunks.length === 0) return;

    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedExercise?.name}-${Date.now()}.webm`;
    a.click();
    URL.revokeObjectURL(url);

    // TODO: Aquí enviarías a Google Cloud Storage
    console.log('Video listo para enviar a Google Cloud:', blob);
  };

  // Función para reproducir feedback por voz (preparada para agente IA)
  const speakFeedback = (message: string) => {
    // TODO: Integrar con agente de IA para feedback por voz personalizado
    console.log('🤖 Coach IA dice:', message);
    
    // Web Speech API funcional mientras se integra el agente
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Seleccionar ejercicio e ir a workout
  const selectExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setCurrentView('workout');
    setHasRecording(false);
    setRecordedChunks([]);
    setCoachFeedback("");
  };

  // Regresar a selección
  const goBack = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setCurrentView('selection');
    setSelectedExercise(null);
    setIsRecording(false);
    setHasRecording(false);
    setRecordedChunks([]);
    setCoachFeedback("");
  };

  // Inicializar cámara al entrar a workout
  useEffect(() => {
    if (currentView === 'workout') {
      initCamera();
    } else {
      // Limpiar feedback al salir del workout
      setCoachFeedback("");
    }
  }, [currentView]);

  // Limpiar feedback automáticamente después de unos segundos
  useEffect(() => {
    if (coachFeedback && !isRecording) {
      const timeout = setTimeout(() => {
        setCoachFeedback("");
      }, 5000); // Limpia después de 5 segundos si no está grabando

      return () => clearTimeout(timeout);
    }
  }, [coachFeedback, isRecording]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Vista de selección de ejercicios
  if (currentView === 'selection') {
    return (
      <div className="h-screen w-screen bg-white overflow-hidden flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-sm md:max-w-md">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-2xl md:text-3xl font-light text-gray-900 mb-2">Fitia Coach</h1>
            <p className="text-sm md:text-base text-gray-500">Selecciona tu ejercicio</p>
          </div>

          {/* Ejercicios */}
          <div className="space-y-3 md:space-y-4">
            {exercises.map((exercise) => (
              <Card
                key={exercise.id}
                className="p-4 md:p-6 cursor-pointer hover:shadow-md transition-all duration-200 border-gray-100 active:scale-95"
                onClick={() => selectExercise(exercise)}
              >
                <div className="flex items-center space-x-3 md:space-x-4">
                  <span className="text-2xl md:text-3xl">{exercise.emoji}</span>
                  <span className="text-base md:text-lg font-medium text-gray-900">{exercise.name}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Vista de workout
  return (
    <div className="h-screen w-screen bg-gray-50 overflow-hidden">
      {/* Header fijo */}
      <div className="bg-white border-b border-gray-100 p-3 md:p-4 z-10 relative h-16 md:h-20 flex-shrink-0">
        <div className="flex items-center justify-between h-full">
          <Button
            variant="ghost"
            size="icon"
            onClick={goBack}
            className="text-gray-600 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
          
          <div className="text-center">
            <div className="flex items-center space-x-2">
              <span className="text-xl md:text-2xl">{selectedExercise?.emoji}</span>
              <span className="font-medium text-gray-900 text-sm md:text-base">{selectedExercise?.name}</span>
            </div>
          </div>

          <div className="w-8 md:w-10" /> {/* Spacer */}
        </div>
      </div>

      {/* Layout - Mobile: Full screen, Desktop: 2 columnas */}
      <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex">
        {/* Video principal */}
        <div className="w-full md:w-[60%] h-full bg-black relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />

          {/* Estado de grabación */}
          {isRecording && (
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-red-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 shadow-lg border border-white/20">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                <span className="text-xs md:text-sm">GRABANDO</span>
              </div>
            </div>
          )}

          {/* Coach IA Feedback Flotante - Solo en mobile */}
          {coachFeedback ? (
            <div className="md:hidden absolute top-4 left-4 right-4 z-20 animate-in slide-in-from-top-4 duration-300">
              <div className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-md text-white px-4 py-3 rounded-xl shadow-2xl border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold">AI</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-tight">{coachFeedback}</p>
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
                </div>
              </div>
            </div>
          ) : !isRecording && (
            <div className="md:hidden absolute top-4 left-4 right-4 z-20">
              <div className="bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-center">
                <p className="text-xs opacity-80">Toca "Comenzar" para iniciar con el Coach IA</p>
              </div>
            </div>
          )}

          {/* Controles de grabación - Optimizados para mobile */}
          <div className="absolute bottom-6 left-0 right-0 px-6">
            <div className="flex items-center justify-center space-x-4">
              {/* Botón iniciar grabación */}
              {!isRecording && (
                <div className="text-center">
                  <Button
                    onClick={startRecording}
                    className="w-20 h-20 md:w-16 md:h-16 rounded-full bg-red-500 hover:bg-red-600 border-4 border-white shadow-xl active:scale-95 transition-all"
                  >
                    <Play className="w-8 h-8 md:w-6 md:h-6 text-white ml-1" />
                  </Button>
                  <p className="text-white text-xs mt-2 font-medium">Comenzar</p>
                </div>
              )}

              {/* Botón detener grabación */}
              {isRecording && (
                <div className="text-center">
                  <Button
                    onClick={stopRecording}
                    className="w-20 h-20 md:w-16 md:h-16 rounded-full bg-gray-800 hover:bg-gray-700 border-4 border-white shadow-xl active:scale-95 transition-all"
                  >
                    <Square className="w-8 h-8 md:w-6 md:h-6 text-white" />
                  </Button>
                  <p className="text-white text-xs mt-2 font-medium">Detener</p>
                </div>
              )}

              {/* Botón descargar */}
              {hasRecording && !isRecording && (
                <div className="text-center">
                  <Button
                    onClick={downloadVideo}
                    className="w-16 h-16 md:w-12 md:h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-xl active:scale-95 transition-all"
                  >
                    <Download className="w-6 h-6 md:w-5 md:h-5" />
                  </Button>
                  <p className="text-white text-xs mt-2 font-medium">Descargar</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Panel Coach IA - Solo visible en Desktop */}
        <div className="hidden md:flex md:w-[40%] h-full bg-white flex-col overflow-hidden">
          {/* Técnica de referencia */}
          <div className="flex-1 p-6 flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Técnica Ideal</h3>
            </div>
            
            {/* Ilustración compacta */}
            <div className="w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-400 rounded-full relative">
                <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-600 rounded-full" />
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-blue-600" />
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-blue-600" />
                <div className="absolute top-9 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-blue-600" />
                <div className="absolute top-9 left-1.5 w-0.5 h-4 bg-blue-600" />
                <div className="absolute top-9 right-1.5 w-0.5 h-4 bg-blue-600" />
              </div>
            </div>

            {/* Tips esenciales */}
            <div className="text-center space-y-2">
              {getExerciseTips(selectedExercise?.id).slice(0, 3).map((tip, index) => (
                <p key={index} className="text-xs text-gray-600">• {tip}</p>
              ))}
            </div>
          </div>

          {/* Coach IA */}
          <div className="p-6 bg-white border-t border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">AI</span>
              </div>
              <h4 className="font-semibold text-gray-900">Coach Virtual</h4>
            </div>
            
            {/* Feedback del coach */}
            <div className="min-h-[60px] p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
              {coachFeedback ? (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse flex-shrink-0" />
                  <p className="text-sm text-gray-700 font-medium">{coachFeedback}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  {isRecording 
                    ? "El coach está analizando tu postura..." 
                    : "Inicia la grabación para recibir orientación del coach IA"
                  }
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FitnessCoach; 