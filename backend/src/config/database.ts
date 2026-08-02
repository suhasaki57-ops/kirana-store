import mongoose from 'mongoose';
import logger from '../utils/logger';

const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI || '';

  if (!mongoURI || mongoURI === 'USE_MEMORY_DB' || mongoURI.includes('xxxxx')) {
    if (process.env.NODE_ENV === 'production') {
      logger.error('MONGODB_URI is not set for production!');
      process.exit(1);
    }
    // Development fallback — try to use mongodb-memory-server if available
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { MongoMemoryServer } = require('mongodb-memory-server') as typeof import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create({ instance: { dbName: 'ecommerce' } });
      const uri = mongod.getUri('ecommerce');
      logger.info(`Using in-memory MongoDB → ${uri}`);
      const fs = require('fs');
      const path = require('path');
      const uriFile = path.join(__dirname, '../../.memdb-uri');
      fs.writeFileSync(uriFile, uri, 'utf-8');
      process.on('exit', () => { try { fs.unlinkSync(uriFile); } catch {} });
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
    } catch {
      logger.error('mongodb-memory-server not available. Set MONGODB_URI in .env');
      process.exit(1);
    }
    return;
  }

  // Check if another process already started an in-memory DB
  try {
    const fs = require('fs');
    const path = require('path');
    const uriFile = path.join(__dirname, '../../.memdb-uri');
    if (fs.existsSync(uriFile)) {
      const sharedURI = fs.readFileSync(uriFile, 'utf-8').trim();
      if (sharedURI) {
        logger.info(`Connecting to shared in-memory MongoDB → ${sharedURI}`);
        await mongoose.connect(sharedURI, { serverSelectionTimeoutMS: 15000 });
        logger.info(`✅ MongoDB Connected → ${mongoose.connection.host}`);
        return;
      }
    }
  } catch {}

  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });
    logger.info(`✅ MongoDB Connected → ${mongoose.connection.host}`);
    mongoose.connection.on('error', (e) => logger.error('MongoDB error:', e));
    mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));
  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

export default connectDB;
