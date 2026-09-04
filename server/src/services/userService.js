import prisma from '../prismaClient.js';

export const findByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: { email },
    });
};

export const createUser = async (userData) => {
    return await prisma.user.create({
        data: userData,
    });
};

export const getUserById = async (id) => {
    return await prisma.user.findUnique({
        where: { id },
        include: {
            enrollments: { include: { class: true } },
        },
    });
};
