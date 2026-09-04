import PrismaPkg from '@prisma/client';
import pgPkg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const { PrismaClient } = PrismaPkg;
const { Pool } = pgPkg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;
