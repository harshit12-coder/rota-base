import { Client, Databases, Account } from 'appwrite';

const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;

if (!projectId) {
    console.warn("Appwrite Project ID is missing! Make sure VITE_APPWRITE_PROJECT_ID is set in your environment variables.");
}

const client = new Client()
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject(projectId);

export const databases = new Databases(client);
export const account = new Account(client);

export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const COLLECTIONS = {
    DEPARTMENTS: import.meta.env.VITE_APPWRITE_COLLECTION_DEPARTMENTS,
    EMPLOYEES: import.meta.env.VITE_APPWRITE_COLLECTION_EMPLOYEES,
    SCHEDULE: import.meta.env.VITE_APPWRITE_COLLECTION_SCHEDULE
};
