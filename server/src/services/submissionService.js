import prisma from '../prismaClient.js';

export const createSubmission = async (data) => {
    return await prisma.submission.create({
        data,
    });
};

export const getSubmissionById = async (id) => {
    return await prisma.submission.findUnique({
        where: { id },
        include: { assignment: true, student: true },
    });
};

export const updateSubmission = async (id, data) => {
    return await prisma.submission.update({
        where: { id },
        data,
    });
};
