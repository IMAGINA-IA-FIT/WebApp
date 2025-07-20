// Servicio para guardado automático de videos
interface LocalSaveResponse {
  success: boolean;
  fileName?: string;
  error?: string;
}

class AutoVideoSaver {
  /**
   * Descarga el video automáticamente con el nombre del ejercicio
   * Usa el nombre del ejercicio para identificar fácilmente
   */
  async saveVideo(videoBlob: Blob, exerciseName: string = 'exercise'): Promise<LocalSaveResponse> {
    try {
      // Generar nombre de archivo basado en el ejercicio
      const fileName = `${exerciseName.toLowerCase()}.webm`;
      
      console.log('💾 Guardado automático iniciado...');
      console.log('📊 Tamaño del video:', Math.round(videoBlob.size / 1024), 'KB');
      console.log('📄 Nombre del archivo:', fileName);

      // Crear URL del blob
      const videoUrl = URL.createObjectURL(videoBlob);

      // Crear elemento de descarga temporal (silencioso)
      const downloadLink = document.createElement('a');
      downloadLink.href = videoUrl;
      downloadLink.download = fileName;
      downloadLink.style.display = 'none';

      // Agregar al DOM temporalmente
      document.body.appendChild(downloadLink);
      
      // Descarga automática silenciosa
      downloadLink.click();
      
      // Limpiar inmediatamente
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(videoUrl);
      
      console.log('✅ Video descargado automáticamente:', fileName);
      
      return {
        success: true,
        fileName: fileName
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