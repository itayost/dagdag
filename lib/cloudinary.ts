export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
};

export function getCloudinaryUrl(publicId: string, options?: {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'scale';
}): string {
  const { width, height, crop = 'fill' } = options || {};
  const transforms = [];

  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (width || height) transforms.push(`c_${crop}`);

  const transformStr = transforms.length > 0 ? `${transforms.join(',')}/` : '';

  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${transformStr}${publicId}`;
}
