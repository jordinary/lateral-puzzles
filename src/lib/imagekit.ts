import ImageKit from 'imagekit';

// Configure ImageKit only if environment variables are available
let imagekit: ImageKit | null = null;

if (process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PRIVATE_KEY && process.env.IMAGEKIT_URL_ENDPOINT) {
  imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });
}

export default imagekit;

// Helper function to get optimized image URL
export function getOptimizedImageUrl(fileId: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
} = {}) {
  const { width, height, quality = 80, format = 'auto' } = options;
  
  let transformation = '';
  if (width) transformation += `w-${width},`;
  if (height) transformation += `h-${height},`;
  if (quality) transformation += `q-${quality},`;
  if (format && format !== 'auto') transformation += `f-${format},`;
  
  // Remove trailing comma
  if (transformation.endsWith(',')) {
    transformation = transformation.slice(0, -1);
  }
  
  return `${process.env.IMAGEKIT_URL_ENDPOINT}/${fileId}?tr=${transformation}`;
}

// Helper function to extract file ID from ImageKit URL
export function getFileIdFromUrl(url: string): string | null {
  if (!url.includes('imagekit.io')) return null;
  
  try {
    const urlParts = url.split('/');
    // ImageKit URLs typically end with the file ID
    const fileId = urlParts[urlParts.length - 1];
    // Remove query parameters if present
    return fileId.split('?')[0];
  } catch (error) {
    console.error('Error extracting file ID:', error);
    return null;
  }
}

// Helper function to get the base URL for ImageKit
export function getImageKitBaseUrl(): string {
  return process.env.IMAGEKIT_URL_ENDPOINT || '';
}

// Helper function to check if ImageKit is configured
export function isImageKitConfigured(): boolean {
  return imagekit !== null;
}
