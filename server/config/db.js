// import mongoose from 'mongoose';

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clothing_business');
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`MongoDB connection error: ${error.message}`);
//     process.exit(1);
//   }
// };

// export default connectDB;



// FILE: server/config/db.js
import mongoose from 'mongoose';

// ── Auto-retry connection logic ───────────────────────────────────────────────
// WHY THIS CHANGED:
// The previous version called process.exit(1) on the FIRST connection failure,
// killing the entire server process. Your logs show MongoDB Atlas doing shard
// failovers (host changing between -00, -01, -02) — these are normal, brief,
// and recoverable. A production server must NOT die because of a transient
// network blip; it should retry and keep serving once the connection returns.
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

const connectDB = async (retryCount = 0) => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/clothing_business',
      {
        serverSelectionTimeoutMS: 10000, // fail fast on a single attempt, then retry
      }
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);

    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying MongoDB connection in ${RETRY_DELAY_MS / 1000}s... (attempt ${retryCount + 1}/${MAX_RETRIES})`);
      setTimeout(() => connectDB(retryCount + 1), RETRY_DELAY_MS);
    } else {
      // Only exit after genuinely exhausting retries — this is a real
      // configuration problem (wrong URI, IP not whitelisted, etc.), not a
      // transient blip, so a clean restart by the process manager is correct here.
      console.error('MongoDB connection failed after maximum retries. Exiting.');
      process.exit(1);
    }
  }
};

// ── Keep the connection alive after a mid-session drop ────────────────────────
// This handles the case where MongoDB disconnects WHILE the server is already
// running and serving requests (not just on startup) — e.g. an Atlas failover
// mid-traffic. Without this, mongoose silently stops working and every request
// that touches the DB starts failing until a manual restart.
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting to reconnect...');
  connectDB();
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error event:', err.message);
});

export default connectDB;