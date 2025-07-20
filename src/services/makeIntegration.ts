interface MakeWebhookData {
  exercise: string;
  timestamp: string;
  videoBlob: Blob;
  userId?: string;
  sessionId: string;
}

interface MakeWebhookResponse {
  success: boolean;
  message?: string;
  sessionId?: string;
  error?: string;
}

class MakeIntegration {
  private webhookUrl: string;

  constructor() {
    // URL del webhook de Make.com - esto debe configurarse en las variables de entorno
    this.webhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL || 'https://hook.make.com/your-webhook-endpoint';
  }

  /**
   * Envía el video y datos del ejercicio a Make.com para procesamiento
   */
  async sendFeedbackRequest(data: {
    exercise: string;
    videoBlob: Blob;
    userId?: string;
  }): Promise<MakeWebhookResponse> {
    try {
      const sessionId = this.generateSessionId();
      
      // Convertir el blob a base64 para enviarlo a Make.com
      const videoBase64 = await this.blobToBase64(data.videoBlob);
      
      // Preparar los datos para Make.com
      const webhookData = {
        exercise: data.exercise,
        timestamp: new Date().toISOString(),
        sessionId: sessionId,
        userId: data.userId || 'anonymous',
        video: {
          data: videoBase64,
          mimeType: data.videoBlob.type,
          size: data.videoBlob.size
        },
        metadata: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language
        }
      };

      // Enviar a Make.com
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      return {
        success: true,
        message: 'Video enviado correctamente a Make.com',
        sessionId: sessionId,
        ...result
      };

    } catch (error) {
      console.error('Error enviando a Make.com:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Convierte un Blob a base64
   */
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Extraer solo la parte base64 (sin el prefijo data:)
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Genera un ID único para la sesión
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Configura la URL del webhook (para casos donde se necesite cambiar dinámicamente)
   */
  setWebhookUrl(url: string): void {
    this.webhookUrl = url;
  }

  /**
   * Verifica si Make.com está configurado correctamente
   */
  isConfigured(): boolean {
    return this.webhookUrl !== 'https://hook.make.com/your-webhook-endpoint';
  }
}

export const makeIntegration = new MakeIntegration();
export type { MakeWebhookData, MakeWebhookResponse }; 