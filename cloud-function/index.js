const functions = require('@google-cloud/functions-framework');
const { Storage } = require('@google-cloud/storage');

// Initialize Google Cloud Storage
const storage = new Storage();

/**
 * Cloud Function to generate signed URLs for video uploads
 * Deployed as HTTP function for fitness coach app
 */
functions.http('generateSignedUrl', async (req, res) => {
  // Enable CORS for frontend requests
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { fileName, contentType = 'video/webm', bucketName = 'video_sentadilla' } = req.body;

    if (!fileName) {
      res.status(400).json({ error: 'fileName is required' });
      return;
    }

    // Get bucket reference
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);

    // Generate signed URL for upload (valid for 15 minutes)
    const [signedUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType: contentType,
    });

    console.log(`Generated signed URL for: ${fileName}`);

    res.json({
      signedUrl,
      fileName,
      bucketName,
      expiresIn: '15 minutes'
    });

  } catch (error) {
    console.error('Error generating signed URL:', error);
    res.status(500).json({ 
      error: 'Failed to generate signed URL',
      details: error.message 
    });
  }
}); 