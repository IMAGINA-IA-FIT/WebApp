// Google Drive Upload - MODERNIZADO con Google Identity Services (GIS)
interface DriveUploadResponse {
  success: boolean;
  fileId?: string;
  fileName?: string;
  error?: string;
}

declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

class ModernDriveUploader {
  private isInitialized = false;
  private folderId: string;
  private accessToken: string | null = null;

  constructor(folderId: string = '') {
    this.folderId = folderId;
  }

  async initialize() {
    if (this.isInitialized) return;

    // Load Google Identity Services (GIS)
    await this.loadGoogleIdentityServices();
    
    // Load Google API client for Drive operations
    if (!window.gapi) {
      await this.loadGapi();
    }

    await new Promise((resolve) => {
      window.gapi.load('client', resolve);
    });

    await window.gapi.client.init({
      apiKey: 'AIzaSyA1MuXY_A732ieAIJ7Rh69e3-wr8_0Okzo',
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
    });

    this.isInitialized = true;
  }

  private loadGoogleIdentityServices(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.google?.accounts) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
      document.head.appendChild(script);
    });
  }

  private loadGapi(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google API'));
      document.head.appendChild(script);
    });
  }

  private async getAccessToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log('🔑 Solicitando token de acceso...');
      
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: '957026094373-ivrv06aan5pa1sifcu1h8bpc6spvjevu.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/drive.file',
        callback: (response: any) => {
          if (response.error) {
            console.error('❌ Error obteniendo token:', response.error);
            reject(new Error(`Token error: ${response.error}`));
          } else {
            console.log('✅ Token obtenido exitosamente');
            this.accessToken = response.access_token;
            // Set token for gapi client
            window.gapi.client.setToken({ access_token: response.access_token });
            resolve(response.access_token);
          }
        },
      });

      // Request token
      tokenClient.requestAccessToken();
    });
  }

  async uploadVideo(videoBlob: Blob, exerciseName: string = 'exercise'): Promise<DriveUploadResponse> {
    try {
      console.log('🔧 DriveUploader: Iniciando uploadVideo');
      console.log('📊 Parámetros:', { exerciseName, blobSize: videoBlob.size, folderId: this.folderId });
      
      console.log('🔄 Inicializando Google APIs...');
      await this.initialize();
      console.log('✅ Google APIs inicializadas');

      // Get access token using GIS
      console.log('🔐 Obteniendo token de acceso...');
      await this.getAccessToken();
      console.log('✅ Token obtenido');

      // Generate unique filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `${exerciseName}-${timestamp}.webm`;
      console.log('📄 Nombre del archivo:', fileName);

      // Convert blob to base64
      console.log('🔄 Convirtiendo blob a base64...');
      const base64Data = await this.blobToBase64(videoBlob);
      console.log('✅ Conversión completada, tamaño base64:', base64Data.length);

      // Create file metadata
      const metadata = {
        name: fileName,
        parents: this.folderId ? [this.folderId] : undefined,
      };
      console.log('📋 Metadata:', metadata);

      // Upload file
      console.log('🚀 Iniciando request de upload a Google Drive...');
      const requestBody = this.createMultipartBody(metadata, base64Data, videoBlob.type);
      console.log('📦 Body del request creado, tamaño:', requestBody.length);
      
      const response = await window.gapi.client.request({
        path: 'https://www.googleapis.com/upload/drive/v3/files',
        method: 'POST',
        params: { uploadType: 'multipart' },
        headers: {
          'Content-Type': 'multipart/related; boundary="foo_bar_baz"'
        },
        body: requestBody
      });

      console.log('✅ Response de Google Drive:', response);
      console.log('📄 File ID creado:', response.result.id);

      return {
        success: true,
        fileId: response.result.id,
        fileName: fileName,
      };
    } catch (error) {
      console.error('💥 Drive upload failed:', error);
      console.error('💥 Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        error: error
      });
      
      let errorMessage = 'Upload failed';
      if (error && typeof error === 'object') {
        if (error.error === 'popup_blocked_by_browser') {
          errorMessage = 'Popup bloqueado. Permite popups para este sitio.';
        } else if (error.error === 'popup_closed_by_user') {
          errorMessage = 'Login cancelado por el usuario.';
        } else if (error.message) {
          errorMessage = error.message;
        }
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  private createMultipartBody(metadata: any, data: string, mimeType: string): string {
    const delimiter = 'foo_bar_baz';
    const close_delim = "\r\n--" + delimiter + "--";
    
    let body = '--' + delimiter + '\r\n';
    body += 'Content-Type: application/json\r\n\r\n';
    body += JSON.stringify(metadata) + '\r\n';
    body += '--' + delimiter + '\r\n';
    body += 'Content-Type: ' + mimeType + '\r\n';
    body += 'Content-Transfer-Encoding: base64\r\n\r\n';
    body += data;
    body += close_delim;
    
    return body;
  }
}

// Export simple instance with Fitness Videos folder
export const driveUploader = new ModernDriveUploader('1IyeuZkruHOwZ8pVd50kw4r3hq9TvbhgR');

export default ModernDriveUploader;
export type { DriveUploadResponse }; 