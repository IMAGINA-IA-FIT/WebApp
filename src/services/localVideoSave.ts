// Servicio para guardado automático de videos
interface LocalSaveResponse {
  success: boolean;
  fileName?: string;
  error?: string;
}

class AutoVideoSaver {
  private static readonly FILENAME = 'fitness-exercise-video.webm';

  /**
   * Descarga el video automáticamente (sin notificaciones molestas)
   * Usa siempre el mismo nombre para sobrescritura automática
   */
  async saveVideo(videoBlob: Blob, exerciseName: string = 'exercise'): Promise<LocalSaveResponse> {
    try {
      console.log('💾 Guardado automático iniciado...');
      console.log('📊 Tamaño del video:', Math.round(videoBlob.size / 1024), 'KB');

      // Crear URL del blob
      const videoUrl = URL.createObjectURL(videoBlob);

      // Crear elemento de descarga temporal (silencioso)
      const downloadLink = document.createElement('a');
      downloadLink.href = videoUrl;
      downloadLink.download = AutoVideoSaver.FILENAME;
      downloadLink.style.display = 'none';

      // Agregar al DOM temporalmente
      document.body.appendChild(downloadLink);
      
      // Descarga automática silenciosa
      downloadLink.click();
      
      // Limpiar inmediatamente
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(videoUrl);
      
      console.log('✅ Video descargado automáticamente:', AutoVideoSaver.FILENAME);
      
      return {
        success: true,
        fileName: AutoVideoSaver.FILENAME
      };

    } catch (error) {
      console.error('💥 Error en guardado automático:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al guardar video'
      };
    }
  }
}

// Export instance
export const localVideoSaver = new AutoVideoSaver();
export default AutoVideoSaver;
export type { LocalSaveResponse }; 