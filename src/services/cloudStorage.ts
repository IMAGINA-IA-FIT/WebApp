// Simplified Cloud Storage Service for Hackathon
// Uses Cloud Function for signed URL generation

interface UploadResponse {
  success: boolean;
  fileName?: string;
  url?: string;
  error?: string;
}

class CloudStorageService {
  private cloudFunctionUrl: string;
  private bucketName: string;

  constructor(cloudFunctionUrl: string, bucketName: string = 'video_sentadilla') {
    this.cloudFunctionUrl = cloudFunctionUrl;
    this.bucketName = bucketName;
  }

  async uploadVideo(videoBlob: Blob, exerciseName: string = 'squats'): Promise<UploadResponse> {
    try {
      // Step 1: Get signed URL from Cloud Function
      const { signedUrl, fileName } = await this.getSignedUrl(exerciseName);
      
      // Step 2: Upload video directly to GCS
      const uploadResponse = await fetch(signedUrl, {
        method: 'PUT',
        body: videoBlob,
        headers: {
          'Content-Type': videoBlob.type || 'video/webm',
          'Content-Length': videoBlob.size.toString(),
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
      }

      return {
        success: true,
        fileName,
        url: `https://storage.googleapis.com/${this.bucketName}/${fileName}`,
      };

    } catch (error) {
      console.error('Video upload failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  private async getSignedUrl(exerciseName: string): Promise<{ signedUrl: string; fileName: string }> {
    // Generate unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `videos/${exerciseName}-${timestamp}.webm`;

    const response = await fetch(this.cloudFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName,
        contentType: 'video/webm',
        bucketName: this.bucketName,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get signed URL: ${response.status}`);
    }

    const data = await response.json();
    return {
      signedUrl: data.signedUrl,
      fileName,
    };
  }
}

// Create instance with h2ai-466419 project configuration
export const cloudStorage = new CloudStorageService(
  // Cloud Function URL for h2ai-466419 project
  process.env.REACT_APP_CLOUD_FUNCTION_URL || 'https://us-central1-h2ai-466419.cloudfunctions.net/generateSignedUrl'
);

export default CloudStorageService;
export type { UploadResponse }; 