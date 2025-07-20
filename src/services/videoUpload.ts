// Servicio para enviar videos al backend para procesamiento
interface VideoUploadResponse {
  success: boolean;
  data?: any;
  error?: string;
}

class VideoUploadService {
  private static readonly ENDPOINT = 'http://localhost:8000/process-video/';

  /**
   * Envía el video al backend para procesamiento
   */
  async uploadVideo(videoBlob: Blob): Promise<VideoUploadResponse> {
    try {
      console.log('🤖 Enviando video al backend para análisis de IA...');
      console.log('📊 Tamaño del video:', Math.round(videoBlob.size / 1024), 'KB');
      console.log('🎯 Analizando postura y generando feedback personalizado...');

      // Crear FormData con el archivo
      const formData = new FormData();
      formData.append('file', videoBlob, 'fitness-exercise-video.webm');

      // Enviar al backend
      const response = await fetch(VideoUploadService.ENDPOINT, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Feedback IA generado exitosamente:', result);

      return {
        success: true,
        data: result
      };

    } catch (error) {
      console.error('💥 Error generando feedback IA:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al generar feedback'
      };
    }
  }

  /**
   * Verifica si el backend está disponible
   */
  async checkBackendHealth(): Promise<boolean> {
    try {
      const response = await fetch(VideoUploadService.ENDPOINT.replace('/process-video/', '/health'), {
        method: 'GET',
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Export instance
export const videoUploadService = new VideoUploadService();
export default VideoUploadService;
export type { VideoUploadResponse }; 