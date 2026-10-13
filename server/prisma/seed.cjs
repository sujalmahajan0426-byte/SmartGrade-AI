const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:admin123@localhost:5432/smartgrade?schema=public' });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Seeding SmartGrade College database with real entities...');

    // Hash demo password
    const hashedPassword = await bcrypt.hash('demo123', 10);

    // 1. Create or Update Core Demo Users
    const student = await prisma.user.upsert({
        where: { email: 'student@demo.com' },
        update: { password: hashedPassword, role: 'STUDENT', name: 'Arjun' },
        create: {
            email: 'student@demo.com',
            password: hashedPassword,
            name: 'Arjun',
            role: 'STUDENT',
        },
    });

    const teacher = await prisma.user.upsert({
        where: { email: 'teacher@demo.com' },
        update: { password: hashedPassword, role: 'TEACHER', name: 'Prof. Sharma' },
        create: {
            email: 'teacher@demo.com',
            password: hashedPassword,
            name: 'Prof. Sharma',
            role: 'TEACHER',
        },
    });

    const parent = await prisma.user.upsert({
        where: { email: 'parent@demo.com' },
        update: { password: hashedPassword, role: 'PARENT', name: 'Mr. Patel' },
        create: {
            email: 'parent@demo.com',
            password: hashedPassword,
            name: 'Mr. Patel',
            role: 'PARENT',
        },
    });

    console.log('👤 Users seeded: Student, Teacher, Parent.');

    // 2. Clean existing classes, assignments for a fresh seed
    await prisma.submission.deleteMany({});
    await prisma.assignment.deleteMany({});
    await prisma.enrollment.deleteMany({});
    await prisma.class.deleteMany({});

    // 3. Create College Classes
    const collegeClasses = [
        { name: 'CS201 - Section A', subject: 'Python Programming' },
        { name: 'CS202 - Section B', subject: 'Java Programming' },
        { name: 'MA201 - Section A', subject: 'Calculus II' },
        { name: 'CS203 - Section A', subject: 'Software Engineering' },
        { name: 'CS204 - Section C', subject: 'Computer Networks' },
    ];

    const createdClasses = [];
    for (const c of collegeClasses) {
        const cls = await prisma.class.create({ data: c });
        createdClasses.push(cls);

        // Enroll demo student in all classes
        await prisma.enrollment.create({
            data: {
                userId: student.id,
                classId: cls.id,
            },
        });
    }

    console.log(`🏫 Created ${createdClasses.length} college courses and enrolled student.`);

    // 4. Create Real College Assignments
    const sampleAssignments = [
        {
            title: 'Python Object-Oriented Design & Generators',
            question: 'Implement a custom Python iterator class that generates Fibonacci numbers up to N and explain memory efficiency vs lists.',
            subject: 'Python Programming',
            classId: createdClasses[0].id,
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            teacherId: teacher.id,
        },
        {
            title: 'Java Concurrency & Thread Synchronization',
            question: 'Explain the Producer-Consumer problem in Java using BlockingQueue and synchronized blocks. Provide code demonstrating deadlock prevention.',
            subject: 'Java Programming',
            classId: createdClasses[1].id,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            teacherId: teacher.id,
        },
        {
            title: 'Calculus II: Partial Differentiation & Vector Fields',
            question: 'Calculate the gradient vector and directional derivative of f(x, y) = 3x^2 * y - y^3 at the point (1, 2) in the direction of vector v = 3i + 4j.',
            subject: 'Calculus II',
            classId: createdClasses[2].id,
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            teacherId: teacher.id,
        },
        {
            title: 'Software Engineering: 3-Tier Architecture & SRS',
            question: 'Draw and explain a 3-Tier Layered Architecture for an educational platform. Detail functional requirements for role-based authentication.',
            subject: 'Software Engineering',
            classId: createdClasses[3].id,
            dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            teacherId: teacher.id,
        },
    ];

    for (const a of sampleAssignments) {
        await prisma.assignment.create({ data: a });
    }

    console.log(`📝 Created ${sampleAssignments.length} college assignments.`);
    console.log('✅ Seeding complete!');
}

main()
    .catch((e) => {
        console.error('Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
