import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILES: 5,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_EXTENSIONS: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
};

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  filename: string,
  folder: string = 'complaints'
): Promise<{ url: string; publicId: string; thumbnailUrl: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `jansamvaad/${folder}`,
        public_id: filename.split('.')[0],
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' },
        ],
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Cloudinary upload failed'));

        const thumbnailUrl = cloudinary.url(result.public_id, {
          width: 300,
          height: 300,
          crop: 'fill',
          quality: 'auto',
          fetch_format: 'auto',
          secure: true,
        });

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          thumbnailUrl,
        });
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!UPLOAD_CONFIG.ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Only images allowed.' };
  }

  if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE) {
    return { valid: false, error: 'File too large. Maximum 5MB allowed.' };
  }

  return { valid: true };
}
