/**
 * Helper to compute SHA-1 hex digest using native Web Crypto API.
 */
async function sha1(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Upload an image (File, Blob, or Base64 Data URI) to Cloudinary using client-side signed upload.
 *
 * @param file The file or base64 data string to upload.
 * @param folder Optional dynamic folder path in Cloudinary.
 * @returns The secure HTTPS URL of the uploaded asset.
 */
export async function uploadToCloudinary(
  file: File | Blob | string,
  folder?: string
): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
  const apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET;
  const defaultFolder = import.meta.env.VITE_CLOUDINARY_FOLDER || 'usababes';

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      'Cloudinary environment variables (VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_API_KEY, VITE_CLOUDINARY_API_SECRET) are missing.'
    );
  }

  const uploadFolder = folder || defaultFolder;
  const timestamp = Math.floor(Date.now() / 1000).toString();

  // Parameters to sign (sorted alphabetically by key)
  const paramsToSign: Record<string, string> = {
    folder: uploadFolder,
    timestamp: timestamp,
  };

  const sortedKeys = Object.keys(paramsToSign).sort();
  const signatureString =
    sortedKeys.map((key) => `${key}=${paramsToSign[key]}`).join('&') + apiSecret;

  const signature = await sha1(signatureString);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp);
  formData.append('folder', uploadFolder);
  formData.append('signature', signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    const message =
      errorJson.error?.message || `Upload failed with status ${response.status}`;
    throw new Error(`Cloudinary Upload Error: ${message}`);
  }

  const data = await response.json();
  return data.secure_url;
}

/**
 * Automatically applies Cloudinary URL transformations for auto format (WebP/AVIF), auto quality, and responsive width.
 */
export function getOptimizedCloudinaryUrl(url?: string, width = 800): string {
  if (!url) return '';
  if (!url.includes('res.cloudinary.com')) return url;
  if (url.includes('/upload/f_auto,q_auto')) return url;
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
}
