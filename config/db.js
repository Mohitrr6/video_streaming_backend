import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool =  await new Pool({
            'host': process.env.DB_HOST,
            'database': process.env.DB_NAME,
            'user': process.env.DB_USER,
            'password': process.env.DB_PASSWORD,
            'port': process.env.DB_PORT,
            'ssl':{
              rejectUnauthorized:false
            }
        })

        


 async function verifyConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL database');
    client.release();
  } catch (error) {
    console.error('❌ Error connecting to the database:', error);
    process.exit(1);
  }
}

verifyConnection();


export default pool;