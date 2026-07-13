import { v2 as cloudinary } from 'cloudinary';
import logger from '../utils/logger';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Validate configuration
const validateCloudinaryConfig = (): boolean => {
  const { cloud_name, api_key, api_secret } = cloudinary.config();
  
  if (!cloud_name || !api_key || !api_secret) {
    logger.warn('Cloudinary configuration is incomplete');
    return false;
  }
  
  logger.info('✅ Cloudinary configured successfully');
  return true;
};

validateCloudinaryConfig();

export default cloudinary;
