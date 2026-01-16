import React, { createContext, useContext, useState, useEffect } from 'react';
import { account, teams, databases, DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import { ID, Query } from 'appwrite';
import { ROLES } from '../utils/permissions';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null); // 'admin', 'manager', 'employee'
    const [teamIds, setTeamIds] = useState({}); // Store IDs: { admin: 'id', manager: 'id' }
    const [loading, setLoading] = useState(true);

    const SUPER_ADMIN = 'admin@rota.com';

    useEffect(() => {
        checkUserStatus();
    }, []);

    const checkUserStatus = async () => {
        try {
            const currentUser = await account.get();
            setUser(currentUser);
            
            // Check DB for user record using Document ID = User ID
            let dbUser;
            try {
                // Try to get document directly using Auth User ID
                dbUser = await databases.getDocument(
                    DATABASE_ID,
                    COLLECTIONS.USERS,
                    currentUser.$id
                );
            } catch (error) {
                if (error.code === 404) {
                    // Document not found -> Auto-register
                    try {
                        dbUser = await databases.createDocument(
                            DATABASE_ID,
                            COLLECTIONS.USERS,
                            currentUser.$id, // Use Auth ID as Doc ID
                            {
                                name: currentUser.name || currentUser.email.split('@')[0],
                                email: currentUser.email,
                                role: 'employee',
                            }
                        );
                    } catch (createError) {
                        console.error("DB Create Error:", createError);
                        dbUser = { role: 'employee' }; // Fallback
                    }
                } else {
                     console.error("DB Get Error:", error);
                     dbUser = { role: 'employee' }; // Fallback
                }
            }

            // Set Role based on DB
            let userRole = ROLES.EMPLOYEE;
            if (currentUser.email === SUPER_ADMIN) {
                userRole = ROLES.ADMIN;
            } else if (dbUser.role === 'admin') {
                userRole = ROLES.ADMIN;
            } else if (dbUser.role === 'manager') {
                userRole = ROLES.MANAGER;
            }
            
            setRole(userRole);
            // Attach DB ID to user object for easy updates
            setUser({ ...currentUser, dbId: dbUser.$id, dbRole: userRole });

        } catch (error) {
            console.log("No active session");
            setUser(null);
            setRole(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            await account.createEmailPasswordSession(email, password);
            await checkUserStatus();
            return { success: true };
        } catch (error) {
            console.error("Login failed:", error);
            // Handle Appwrite error codes if needed
            return { success: false, error: error.message };
        }
    };

    const signup = async (email, password, name) => {
        try {
            const newAccount = await account.create(ID.unique(), email, password, name);
            // Auto login after signup which triggers checkUserStatus -> creates DB entry
            return await login(email, password);
        } catch (error) {
            console.error("Signup failed:", error);
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            await account.deleteSession('current');
            setUser(null);
            setRole(null);
            setTeamIds({});
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // --- Role Management Functions ---
    // --- Database Driven Role Management ---

    const getAllMembers = async () => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID, 
                COLLECTIONS.USERS,
                [Query.limit(100)]
            );
            return response.documents.map(doc => ({
                ...doc,
                userId: doc.$id, // Ensure userId is synonymous with Document ID for UI keys
                confirm: true
            }));
        } catch (error) {
            console.error("Failed to fetch users from DB:", error);
            return [];
        }
    };

    const changeUserRole = async (userId, email, name, currentRoleType, newRoleType) => {
        try {
            // Since we use Auth ID = Document ID, we can update directly
            // But userId passed here might be the Auth ID (which IS the Doc ID now)
            
            if (!userId) {
                console.error("Missing User ID (Document ID) for role change");
                return { success: false, error: "Missing Document ID" };
            }

            await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.USERS,
                userId, 
                { role: newRoleType }
            );
            return { success: true };
        } catch (error) {
            console.error("Failed to change role:", error);
            return { success: false, error: error.message };
        }
    };

    const inviteUserToDB = async (email, role, name) => {
        try {
            // Check if exists by email (Still need query for this specifically)
            // But since we don't have email index, we might fail?
            // Wait, if user follows instruction to make email/name/role columns, they should index email if they want invite to check dups.
            // For now, let's just try to create. If ID conflict (unlikely), it errors.
            // But we don't know the ID yet. 
            // We'll generate a random invite ID.
            
            await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.USERS,
                ID.unique(),
                {
                    email,
                    role,
                    name: name || 'Invited User',
                    // No 'userId' needed as attribute anymore, the Doc ID is the handle
                }
            );
            return { success: true };
        } catch(error) {
            return { success: false, error: error.message };
        }
   };

    const value = {
        user,
        role,
        loading,
        login,
        signup,
        logout,
        getAllMembers,
        changeUserRole,
        addToRole: inviteUserToDB,
        isAdmin: role === ROLES.ADMIN,
        isManager: role === ROLES.MANAGER || role === ROLES.ADMIN
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
