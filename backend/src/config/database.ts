import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import logger from '../utils/logger';

const MEMDB_URI_FILE = path.join(__dirname, '../../.memdb-uri');

const isPlaceholderURI = (uri: string) =>
  !uri ||
  uri === 'USE_MEMORY_DB' ||
  uri.includes('xxxxx') ||
  uri.includes('your-') ||
  uri.includes('<') ||
  uri.includes('mernuser') ||
  uri.includes('testuser');

const connectDB = async (): Promise<void> => {
  const configuredURI = process.env.MONGODB_URI || '';

  // In production, MONGODB_URI must be a real Atlas URI
  if (process.env.NODE_ENV === 'production') {
    if (!configuredURI || isPlaceholderURI(configuredURI)) {
      logger.error('❌ MONGODB_URI is not set for production! Please set a valid MongoDB Atlas URI.');
      process.exit(1);
    }
    await connectMongo(configuredURI);
    return;
  }

  // --- Development: allow in-memory MongoDB ---
  let uri = configuredURI;

  if (isPlaceholderURI(configuredURI)) {
    // Check if a sibling process already started an in-memory DB
    if (fs.existsSync(MEMDB_URI_FILE)) {
      const sharedURI = fs.readFileSync(MEMDB_URI_FILE, 'utf-8').trim();
      if (sharedURI) {
        uri = sharedURI;
        logger.info(`🔗 Connecting to shared in-memory MongoDB → ${uri}`);
        await connectMongo(uri);
        return;
      }
    }

    // Start our own in-memory MongoDB
    logger.info('🔶 Starting local in-memory MongoDB...');
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { MongoMemoryServer } = require('mongodb-memory-server') as typeof import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create({ instance: { dbName: 'ecommerce' } });
      uri = mongod.getUri('ecommerce');
      logger.info(`✅ In-memory MongoDB ready → ${uri}`);

      fs.writeFileSync(MEMDB_URI_FILE, uri, 'utf-8');

      process.on('SIGTERM', async () => { try { fs.unlinkSync(MEMDB_URI_FILE); } catch {} await mongod.stop(); });
      process.on('SIGINT',  async () => { try { fs.unlinkSync(MEMDB_URI_FILE); } catch {} await mongod.stop(); });
      process.on('exit',    ()       => { try { fs.unlinkSync(MEMDB_URI_FILE); } catch {} });
      (global as any).__mongod = mongod;
    } catch (err) {
      logger.error('❌ Failed to start in-memory MongoDB:', err);
      process.exit(1);
    }
  }

  await connectMongo(uri);
};

async function connectMongo(uri: string): Promise<void> {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });
    logger.info(`✅ MongoDB Connected → ${mongoose.connection.host}`);

    mongoose.connection.on('error',        (e) => logger.error('MongoDB error:', e));
    mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));
    mongoose.connection.on('reconnected',  () => logger.info('MongoDB reconnected'));
  } catch (error) {
    logger.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}

export default connectDB;
