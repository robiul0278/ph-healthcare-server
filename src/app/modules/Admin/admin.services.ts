import { Admin, Prisma, UserStatus } from "@prisma/client";
import { adminSearchAbleFields } from "./admin.constant";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { Request } from 'express';
import { IAdminFilterRequest } from "./admin.interface";
import { IPaginationOptions } from "../../interface/pagination";

const getAllFromDB = async (params: IAdminFilterRequest, options: IPaginationOptions) => {
  const andCondition: Prisma.AdminWhereInput[] = [];
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterData } = params;
  // console.log(filterData)

  if (params.searchTerm) {
    andCondition.push({
      OR: adminSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    });
  };

  andCondition.push({
    isDeleted: false
  });

  const whereCondition: Prisma.AdminWhereInput = { AND: andCondition };
  const result = await prisma.admin.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.admin.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<Admin| null> => {
  // console.log("get by id")
  const result = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false
    },
  })
  return result;
};

const updateIntoDB = async (id: string, data: Partial<Admin>): Promise<Admin> => {
  await prisma.admin.findFirstOrThrow({
    where: {
      id,
      isDeleted: false
    },
  });

  const result = await prisma.admin.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteFromDB = async (id:string): Promise<Admin | null> => {
  await prisma.admin.findFirstOrThrow({
    where: {
      id,
    }
  })

  const result = await prisma.$transaction(async(transactionClient) => {
    const adminDeletedData = await transactionClient.admin.delete({
      where: {
        id
      }
    });
    const userDeletedData = await transactionClient.user.delete({
      where: {
        email: adminDeletedData.email
      }
    });
    return adminDeletedData;
  })
  return result;
};


const softDeleteFromDB = async (id:string): Promise<Admin | null> => {

  await prisma.admin.findFirstOrThrow({
    where: {
      id,
      isDeleted: false
    }
  })

  const result = await prisma.$transaction(async(transactionClient) => {
    const adminDeletedData = await transactionClient.admin.update({
      where: {
        id
      },
      data:{
        isDeleted: true
      }
    });
    const userDeletedData = await transactionClient.user.update({
      where: {
        email: adminDeletedData.email
      },
      data:{
        status: UserStatus.DELETED
      }
    });
    return adminDeletedData;
  })
  return result;
};

export const AdminService = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDeleteFromDB
};
