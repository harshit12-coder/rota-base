// Role-Based Access Control Utilities

export const ROLES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    EMPLOYEE: 'employee'
};

export const PERMISSIONS = {
    // Schedule permissions
    CREATE_SCHEDULE: 'create_schedule',
    EDIT_SCHEDULE: 'edit_schedule',
    DELETE_SCHEDULE: 'delete_schedule',
    VIEW_ALL_SCHEDULES: 'view_all_schedules',
    VIEW_OWN_SCHEDULE: 'view_own_schedule',
    
    // Employee permissions
    ADD_EMPLOYEE: 'add_employee',
    EDIT_EMPLOYEE: 'edit_employee',
    DELETE_EMPLOYEE: 'delete_employee',
    
    // Department permissions
    MANAGE_DEPARTMENTS: 'manage_departments',
    
    // Export permissions
    EXPORT_EXCEL: 'export_excel',
    EXPORT_OUTLOOK: 'export_outlook',
    
    // Stats permissions
    VIEW_STATS: 'view_stats',
    VIEW_FAIRNESS: 'view_fairness'
};

// Role permission mappings
const rolePermissions = {
    [ROLES.ADMIN]: [
        // Admins have ALL permissions
        PERMISSIONS.CREATE_SCHEDULE,
        PERMISSIONS.EDIT_SCHEDULE,
        PERMISSIONS.DELETE_SCHEDULE,
        PERMISSIONS.VIEW_ALL_SCHEDULES,
        PERMISSIONS.VIEW_OWN_SCHEDULE,
        PERMISSIONS.ADD_EMPLOYEE,
        PERMISSIONS.EDIT_EMPLOYEE,
        PERMISSIONS.DELETE_EMPLOYEE,
        PERMISSIONS.MANAGE_DEPARTMENTS,
        PERMISSIONS.EXPORT_EXCEL,
        PERMISSIONS.EXPORT_OUTLOOK,
        PERMISSIONS.VIEW_STATS,
        PERMISSIONS.VIEW_FAIRNESS
    ],
    [ROLES.MANAGER]: [
        // Managers can manage schedules and export
        PERMISSIONS.CREATE_SCHEDULE,
        PERMISSIONS.EDIT_SCHEDULE,
        PERMISSIONS.VIEW_ALL_SCHEDULES,
        PERMISSIONS.VIEW_OWN_SCHEDULE,
        PERMISSIONS.EXPORT_EXCEL,
        PERMISSIONS.EXPORT_OUTLOOK,
        PERMISSIONS.VIEW_STATS,
        PERMISSIONS.VIEW_FAIRNESS
    ],
    [ROLES.EMPLOYEE]: [
        // Employees can only view their own schedule
        PERMISSIONS.VIEW_OWN_SCHEDULE
    ]
};

/**
 * Check if a role has a specific permission
 * @param {string} role - User role (admin, manager, employee)
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
export const hasPermission = (role, permission) => {
    if (!role) return false;
    const permissions = rolePermissions[role] || [];
    return permissions.includes(permission);
};

/**
 * Check if user can perform an action
 * @param {string} userRole - Current user's role
 * @param {string} action - Action to perform
 * @returns {boolean}
 */
export const canPerformAction = (userRole, action) => {
    return hasPermission(userRole, action);
};

/**
 * Get all permissions for a role
 * @param {string} role - User role
 * @returns {array} - Array of permissions
 */
export const getRolePermissions = (role) => {
    return rolePermissions[role] || [];
};

/**
 * Check if role is admin
 * @param {string} role - User role
 * @returns {boolean}
 */
export const isAdmin = (role) => {
    return role === ROLES.ADMIN;
};

/**
 * Check if role is manager or higher
 * @param {string} role - User role
 * @returns {boolean}
 */
export const isManagerOrHigher = (role) => {
    return role === ROLES.ADMIN || role === ROLES.MANAGER;
};

/**
 * Get role display info
 * @param {string} role - User role
 * @returns {object} - Role display info
 */
export const getRoleInfo = (role) => {
    const roleInfo = {
        [ROLES.ADMIN]: {
            name: 'Administrator',
            color: 'red',
            description: 'Full system access with all permissions',
            level: 3
        },
        [ROLES.MANAGER]: {
            name: 'Manager',
            color: 'teal',
            description: 'Can create and manage schedules',
            level: 2
        },
        [ROLES.EMPLOYEE]: {
            name: 'Employee',
            color: 'blue',
            description: 'View-only access to own schedule',
            level: 1
        }
    };
    
    return roleInfo[role] || roleInfo[ROLES.EMPLOYEE];
};

// Helper hook for React components
export const usePermissions = (userRole) => {
    return {
        canCreate: hasPermission(userRole, PERMISSIONS.CREATE_SCHEDULE),
        canEdit: hasPermission(userRole, PERMISSIONS.EDIT_SCHEDULE),
        canDelete: hasPermission(userRole, PERMISSIONS.DELETE_SCHEDULE),
        canViewAll: hasPermission(userRole, PERMISSIONS.VIEW_ALL_SCHEDULES),
        canAddEmployee: hasPermission(userRole, PERMISSIONS.ADD_EMPLOYEE),
        canManageDepts: hasPermission(userRole, PERMISSIONS.MANAGE_DEPARTMENTS),
        canExport: hasPermission(userRole, PERMISSIONS.EXPORT_EXCEL),
        canViewStats: hasPermission(userRole, PERMISSIONS.VIEW_STATS),
        isAdmin: isAdmin(userRole),
        isManager: isManagerOrHigher(userRole)
    };
};

export default {
    ROLES,
    PERMISSIONS,
    hasPermission,
    canPerformAction,
    getRolePermissions,
    isAdmin,
    isManagerOrHigher,
    getRoleInfo,
    usePermissions
};
