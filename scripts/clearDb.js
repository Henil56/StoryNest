import { Client, Databases, Storage } from 'appwrite';

const client = new Client()
    .setEndpoint("https://tor.cloud.appwrite.io/v1")
    .setProject("694919cc00336c3aa021");

const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = "69491b4400252d0c1973";
const BUCKET_ID = "69491daf002ac016e4b1";
const COLLECTIONS = ["articals", "users", "subscribers"];

async function clearCollection(colId) {
    console.log(`\n--- Clearing Collection: ${colId} ---`);
    try {
        const res = await databases.listDocuments(DATABASE_ID, colId);
        const docs = res.documents || [];
        console.log(`Found ${docs.length} documents in ${colId}.`);
        for (const doc of docs) {
            try {
                await databases.deleteDocument(DATABASE_ID, colId, doc.$id);
                console.log(`Deleted doc: ${doc.$id} (${doc.title || doc.username || doc.email || 'doc'})`);
            } catch (err) {
                console.log(`Failed to delete doc ${doc.$id}:`, err.message);
            }
        }
    } catch (err) {
        console.log(`Could not list documents for ${colId}:`, err.message);
    }
}

async function clearBucket() {
    console.log(`\n--- Clearing Storage Bucket: ${BUCKET_ID} ---`);
    try {
        const res = await storage.listFiles(BUCKET_ID);
        const files = res.files || [];
        console.log(`Found ${files.length} files in bucket.`);
        for (const file of files) {
            try {
                await storage.deleteFile(BUCKET_ID, file.$id);
                console.log(`Deleted file: ${file.$id} (${file.name})`);
            } catch (err) {
                console.log(`Failed to delete file ${file.$id}:`, err.message);
            }
        }
    } catch (err) {
        console.log(`Could not list files in bucket:`, err.message);
    }
}

async function main() {
    console.log("Starting Appwrite Database Cleanup...");
    for (const col of COLLECTIONS) {
        await clearCollection(col);
    }
    await clearBucket();
    console.log("\nCleanup Complete! Database & Storage are ready for publishing!");
}

main();
