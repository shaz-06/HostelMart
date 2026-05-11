const admin = require('firebase-admin');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

let db;

// Persistent mock storage for development
const MOCK_DB_PATH = path.join(process.cwd(), 'mock_db.json');

function loadMockDB() {
    if (fs.existsSync(MOCK_DB_PATH)) {
        try {
            return JSON.parse(fs.readFileSync(MOCK_DB_PATH, 'utf8'));
        } catch (e) {
            console.error("Error loading mock DB:", e);
        }
    }
    return { users: {}, orders: {} };
}

function saveMockDB(data) {
    try {
        fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Error saving mock DB:", e);
    }
}

let mockStorage = loadMockDB();

try {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT || './serviceAccount.json';

    if (fs.existsSync(serviceAccountPath)) {
        const serviceAccount = require(serviceAccountPath);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log("Firebase Admin initialized with service account.");
        db = admin.firestore();
    } else {
        console.warn("Firebase service account not found. Initializing Persistent Mock Database.");
        db = {
            collection: (collectionName) => ({
                doc: (id) => ({
                    get: async () => {
                        const data = mockStorage[collectionName] ? mockStorage[collectionName][id] : null;
                        return { 
                            exists: !!data, 
                            data: () => data || {} 
                        };
                    },
                    set: async (data) => {
                        if (!mockStorage[collectionName]) mockStorage[collectionName] = {};
                        mockStorage[collectionName][id] = data;
                        saveMockDB(mockStorage);
                        console.log(`[MOCK DB] Saved in ${collectionName}:`, id);
                    },
                    update: async (data) => {
                        if (!mockStorage[collectionName]) mockStorage[collectionName] = {};
                        mockStorage[collectionName][id] = { ...mockStorage[collectionName][id], ...data };
                        saveMockDB(mockStorage);
                        console.log(`[MOCK DB] Updated in ${collectionName}:`, id);
                    },
                }),
                where: (field, op, value) => ({
                    get: async () => {
                        const col = mockStorage[collectionName] || {};
                        const docs = Object.entries(col)
                            .filter(([id, data]) => data[field] === value)
                            .map(([id, data]) => ({ id, data: () => data }));
                        return { docs };
                    }
                }),
                orderBy: () => ({
                    get: async () => {
                        const col = mockStorage[collectionName] || {};
                        const docs = Object.entries(col)
                            .map(([id, data]) => ({ id, data: () => data }));
                        return { docs };
                    }
                })
            })
        };
    }
} catch (error) {
    console.error("Firebase Admin initialization failed:", error);
    db = db || { collection: () => ({ doc: () => ({ get: async () => ({ exists: false }) }) }) };
}

module.exports = { admin, db };
