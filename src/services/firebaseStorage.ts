// Firebase Storage - Alternativa más simple que Cloud Functions
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Configuración de Firebase (publica, no sensible)
const firebaseConfig = {
  apiKey: "AIzaSyC...", // Necesitarías crear un proyecto Firebase
  authDomain: "h2ai-466419.firebaseapp.com",
  projectId: "h2ai-466419",
  storageBucket: "h2ai-466419.appspot.com",
  messagingSenderId: "957026094373",
  appId: "1:957026094373:web:..."
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

interface UploadResponse {
  success: boolean;
  downloadURL?: string;
  fileName?: string;
  error?: string;
}

export const uploadVideoToFirebase = async (
  videoBlob: Blob, 
  exerciseName: string = 'squats'
): Promise<UploadResponse> => {
  try {
    // Generate unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `videos/${exerciseName}-${timestamp}.webm`;
    
    // Create storage reference
    const storageRef = ref(storage, fileName);
    
    // Upload video
    const snapshot = await uploadBytes(storageRef, videoBlob);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      success: true,
      downloadURL,
      fileName,
    };
  } catch (error) {
    console.error('Firebase upload failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}; 