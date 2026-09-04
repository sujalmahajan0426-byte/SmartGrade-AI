import PrismaPkg from '@prisma/client';
import pgPkg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const { PrismaClient } = PrismaPkg;
const { Pool } = pgPkg;

async function testConnection() {
    console.log('Testing connection to:', process.env.DATABASE_URL);
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    try {
        await prisma.$connect();
        console.log('✅ Connection Successful!');
        const userCount = await prisma.user.count();
        console.log('📊 User count in DB:', userCount);

        const demoUser = await prisma.user.findUnique({ where: { email: 'student@demo.com' } });
        if (demoUser) {
            console.log('👤 Demo user found:', demoUser.email);
            console.log('🔑 Demo password in DB:', demoUser.password);
        } else {
            console.log('❌ Demo user NOT FOUND in database!');
        }
    } catch (err) {
        console.error('❌ Connection Failed:', err);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

testConnection();
