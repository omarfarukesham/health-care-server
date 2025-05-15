"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFilterableFields = exports.userSearchAbleFields = exports.adminPaginationFields = exports.searchAbleFields = void 0;
exports.searchAbleFields = ['name', 'email', 'contactNumber'];
exports.adminPaginationFields = ['page', 'limit', 'sortBy', 'sortOrder'];
exports.userSearchAbleFields = ['email'];
exports.userFilterableFields = [
    'email',
    'role',
    'status',
    'searchTerm'
];
