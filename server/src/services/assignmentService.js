import prisma from '../prismaClient.js';

export const getAllAssignments = async (classId) => {
    return await prisma.assignment.findMany({
        where: classId ? { classId } : {},
        include: { class: true, teacher: true },
    });
};

export const createAssignment = async (data) => {
    return await prisma.assignment.create({
        data,
    });
};

export const getAssignmentById = async (id) => {
    return await prisma.assignment.findUnique({
        where: { id },
        include: { submissions: true, class: true },
    });
};
