import SimpleDriveUploader from './driveUpload';

interface DriveUploadResponse {
  success: boolean;
  fileId?: string;
  fileName?: string;
  fileUrl?: string;
  error?: string;
}

interface MakeNotificationData {
  exercise: string;
  timestamp: string;
  sessionId: string;
  userId: string;
  driveFile: {
    fileId: string;
    fileName: string;
    fileUrl: string;
    mimeType: string;
    size: number;
  };
  metadata: {
    userAgent: string;
    platform: string;
    language: string;
  };
}

class DriveWithMakeIntegration {
  private makeWebhookUrl: string;
  private driveUploader: SimpleDriveUploader;

  constructor() {
    this.makeWebhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL || 'https://hook.make.com/your-webhook-endpoint';
    // Crear instancia con el folder ID de Fitness Videos
    this.driveUploader = new SimpleDriveUploader('1IyeuZkruHOwZ8pVd50kw4r3hq9TvbhgR');
  }

  /**
   * Flujo completo: Subir a Drive + Notificar a Make.com
   */
  async uploadVideoAndNotify(data: {
    exercise: string;
    videoBlob: Blob;
    userId?: string;
  }): Promise<{ success: boolean; message?: string; error?: string; sessionId?: string }> {
    try {
      const sessionId = this.generateSessionId();
      const fileName = `${data.exercise.toLowerCase().replace(/\s+/g, '-')}_${sessionId}.webm`;

      // Paso 1: Subir a Google Drive
      console.log('📤 Subiendo video a Google Drive...');
      console.log('📊 Datos del video:', { size: data.videoBlob.size, type: data.videoBlob.type, fileName });
      
      const driveResult = await this.uploadToGoogleDrive(data.videoBlob, fileName);
      console.log('📋 Resultado de Google Drive:', driveResult);

      if (!driveResult.success) {
        console.error('❌ Error en Google Drive:', driveResult.error);
        throw new Error(driveResult.error || 'Error subiendo a Google Drive');
      }

      console.log('✅ Video subido a Google Drive:', driveResult.fileId);

      // Paso 2: Notificar a Make.com con metadata
      console.log('📨 Notificando a Make.com...');
      const notificationData: MakeNotificationData = {
        exercise: data.exercise,
        timestamp: new Date().toISOString(),
        sessionId: sessionId,
        userId: data.userId || 'anonymous',
        driveFile: {
          fileId: driveResult.fileId!,
          fileName: driveResult.fileName!,
          fileUrl: driveResult.fileUrl || `https://drive.google.com/file/d/${driveResult.fileId}/view`,
          mimeType: data.videoBlob.type,
          size: data.videoBlob.size
        },
        metadata: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language
        }
      };

      const makeResult = await this.notifyMake(notificationData);

      if (!makeResult.success) {
        console.warn('⚠️ Video subido a Drive, pero fallo notificación a Make.com:', makeResult.error);
        return {
          success: true,
          message: 'Video subido a Google Drive correctamente. Notificación a Make.com falló pero se puede procesar manualmente.',
          sessionId: sessionId
        };
      }

      console.log('✅ Notificación enviada a Make.com');

      return {
        success: true,
        message: 'Video subido a Google Drive y notificado a Make.com exitosamente',
        sessionId: sessionId
      };

    } catch (error) {
      console.error('❌ Error en el flujo completo:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Subir archivo a Google Drive usando el servicio real
   */
  private async uploadToGoogleDrive(blob: Blob, fileName: string): Promise<DriveUploadResponse> {
    try {
      console.log('📤 Iniciando subida a Google Drive');
      console.log('📄 Archivo:', fileName, 'Tamaño:', blob.size, 'bytes');
      console.log('🔧 Instancia driveUploader:', this.driveUploader);
      
      // Usar el servicio real de Google Drive
      console.log('🚀 Llamando uploadVideo...');
      const result = await this.driveUploader.uploadVideo(blob, fileName.replace('.webm', ''));
      console.log('📨 Respuesta de uploadVideo:', result);
      
      if (result.success) {
        console.log('✅ Archivo subido exitosamente:', result.fileId);
        return {
          success: true,
          fileId: result.fileId!,
          fileName: result.fileName!,
          fileUrl: `https://drive.google.com/file/d/${result.fileId}/view`
        };
      } else {
        console.error('❌ Upload falló:', result.error);
        throw new Error(result.error || 'Error en la subida');
      }

    } catch (error) {
      console.error('💥 Excepción en uploadToGoogleDrive:', error);
      console.error('💥 Stack trace:', error instanceof Error ? error.stack : 'No stack');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error subiendo a Google Drive'
      };
    }
  }

  /**
   * Notificar a Make.com con metadata del archivo
   */
  private async notifyMake(data: MakeNotificationData): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(this.makeWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          type: 'DRIVE_FILE_UPLOADED',
          action: 'PROCESS_FITNESS_VIDEO'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return { success: true };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error notificando a Make.com'
      };
    }
  }

  /**
   * Genera un ID único para la sesión
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const driveWithMake = new DriveWithMakeIntegration();
export type { DriveUploadResponse, MakeNotificationData }; 