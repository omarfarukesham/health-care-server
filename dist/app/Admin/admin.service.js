"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = void 0;
const client_1 = require("@prisma/client");
const admin_constant_1 = require("./admin.constant");
const paginationsHelper_1 = require("../../helpers/paginationsHelper");
const prisma = new client_1.PrismaClient();
//get all admin users data from postgresSQL db following the search, filter, pagination ... 
const getAllAdminUsers = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationsHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andContions = [];
    if (params.searchTerm) {
        andContions.push({
            OR: admin_constant_1.searchAbleFields.map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: 'insensitive',
                }
            }))
        });
    }
    if (Object.keys(filterData).length) {
        andContions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        });
    }
    ;
    andContions.push({
        isDeleted: false,
    });
    const whereCoditions = { AND: andContions };
    const result = yield prisma.admin.findMany({
        where: whereCoditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }
    });
    return {
        meta: {
            page,
            limit,
            total: yield prisma.admin.count({
                where: whereCoditions
            }),
        },
        data: result
    };
});
//get signgle admin user data from postgresSQL db
const getSingleAdminUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.admin.findUnique({
        where: {
            id,
            isDeleted: false
        }
    });
    if (!result) {
        throw new Error("Admin not found");
    }
    return result;
});
//update admin user data in postgresSQL db
const updateAdminUser = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.admin.update({
        where: {
            id,
            isDeleted: false
        },
        data
    });
    if (!result) {
        throw new Error("Admin not found");
    }
    return result;
});
//delete admin user data from postgresSQL db
const deleteAdminUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    //if admin id is not available then throw a new readable msg .. 
    yield prisma.admin.findFirstOrThrow({
        where: {
            id
        }
    });
    const result = yield prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const deletedAdmin = yield transactionClient.admin.delete({
            where: {
                id
            }
        });
        yield transactionClient.user.delete({
            where: {
                email: deletedAdmin.email
            }
        });
        return deletedAdmin;
    }));
    return result;
});
//soft delete admin user data from postgresSQL db
const softDeleteAdminUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    //if admin id is not available then throw a new readable msg .. 
    yield prisma.admin.findFirstOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });
    const result = yield prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const deletedAdmin = yield transactionClient.admin.update({
            where: {
                id
            },
            data: {
                isDeleted: true
            }
        });
        yield transactionClient.user.update({
            where: {
                email: deletedAdmin.email
            },
            data: {
                status: client_1.UserStatus.DELETED
            }
        });
        return deletedAdmin;
    }));
    return result;
});
exports.adminService = {
    getAllAdminUsers,
    getSingleAdminUser,
    updateAdminUser,
    deleteAdminUser,
    softDeleteAdminUser
};
