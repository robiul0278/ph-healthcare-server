import {UserRole} from "@prisma/client";
import * as bcrypt from 'bcrypt'
import prisma from "../../../shared/prisma";

const createAdmin = async(data: any) => {
    const hashPassword: string = await bcrypt.hash(data.password, 12);
    // console.log(data)
    const userData = {
        email: data.admin.email,
        password: hashPassword,
        role: UserRole.ADMIN
    }

    const result = await prisma.$transaction(async(transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdAdminData = await transactionClient.admin.create({
            data: data.admin
        });

        return createdAdminData;
    });

    return result;
};
export const userService = {
    createAdmin
}