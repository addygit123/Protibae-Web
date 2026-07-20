/**
 * Helper to extract public ID from a Cloudinary secure URL (browser-safe)
 */
export function getPublicIdFromUrl(url: string): string | null {
  if (!url || !url.includes('res.cloudinary.com')) return null;
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    
    // Remove version like v123456789/ if present
    const pathAfterUpload = parts[1].replace(/^v\d+\//, '');
    
    // Remove file extension
    const lastDotIndex = pathAfterUpload.lastIndexOf('.');
    if (lastDotIndex === -1) return pathAfterUpload;
    return pathAfterUpload.substring(0, lastDotIndex);
  } catch (e) {
    console.error('Error parsing Cloudinary URL:', e);
    return null;
  }
}

/**
 * Optimizes a Cloudinary image URL with dynamic transformations (browser-safe)
 */
export function getOptimizedCloudinaryUrl(
  url: string,
  options: { width?: number; height?: number; crop?: string; quality?: string } = {}
): string {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return url;

    // Cloudinary allows multiple transformation segments, e.g. /upload/f_auto,q_auto/v158/path.jpg
    const params = ['f_auto', 'q_auto'];
    if (options.width) params.push(`w_${options.width}`);
    if (options.height) params.push(`h_${options.height}`);
    if (options.crop) params.push(`c_${options.crop}`);
    
    return `${parts[0]}/upload/${params.join(',')}/${parts[1]}`;
  } catch (e) {
    return url;
  }
}
