import { UPLOAD_CONFIG } from '@/lib/constants';

export const uploadConfig = {
  ...UPLOAD_CONFIG,
  STORAGE_PROVIDER: process.env.UPLOAD_STORAGE_PROVIDER || 'local', // 'cloudinary' or 'local'
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    API_KEY: process.env.CLOUDINARY_API_KEY,
    API_SECRET: process.env.CLOUDINARY_API_SECRET,
    FOLDER: 'jansamvaad/complaints',
  },
  LOCAL: {
    UPLOAD_DIR: 'public/uploads',
    ROUTE_PREFIX: '/uploads',
  }
};
