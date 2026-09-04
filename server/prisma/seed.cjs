const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Seeding database (CommonJS)...');

    // Create Demo Users
    const student = await prisma.user.upsert({
        where: { email: 'student@demo.com' },
        update: {},
        create: {
            email: 'student@demo.com',
            password: 'demo123',
            name: 'Arjun',
            role: 'STUDENT',
        },
    });

    const teacher = await prisma.user.upsert({
        where: { email: 'teacher@demo.com' },
        update: {},
        create: {
            email: 'teacher@demo.com',
            password: 'demo123',
            name: 'Mrs. Sharma',
            role: 'TEACHER',
        },
    });

    const parent = await prisma.user.upsert({
        where: { email: 'parent@demo.com' },
        update: {},
        create: {
            email: 'parent@demo.com',
            password: 'demo123',
            name: 'Mr. Patel',
            role: 'PARENT',
        },
    });

    // Create a Demo Class
    const demoClass = await prisma.class.create({
        data: {
            name: 'Class 10-A',
            subject: 'Science',
        }
    });

    // Enroll student
    await prisma.enrollment.create({
        data: {
            userId: student.id,
            classId: demoClass.id
        }
    });

    // Create a Demo Assignment
    await prisma.assignment.create({
        data: {
            id: 'demo-assignment-id',
            title: 'Laws of Motion',
            question: 'Explain Newton\'s Third Law with an everyday example.',
            subject: 'Science',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            classId: demoClass.id,
            teacherId: teacher.id
        }
    });

    console.log('✅ Seed complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
