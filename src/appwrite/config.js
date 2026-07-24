import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage, Query } from "appwrite";


export class Service {
    client = new Client();
    databases;
    bucket;

    constructor() {
        if (!conf?.appwriteUrl || !conf?.appwriteProjectID) {
            throw new Error('Appwrite configuration missing: set appwriteUrl and appwriteProjectID in conf.');
        }

        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectID);

        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    _handleError(operation, error) {
        console.error(`[Appwrite Service] ${operation} failed:`, error);
        const err = new Error(`${operation} failed: ${error?.message || error}`);
        err.code = error?.code || error?.status || 'APPWRITE_ERROR';
        err.cause = error;
        throw err;
    }

    async createPost({ title, slug, content, featuredImage, status, userId, category, authorName }) {
        try {
            // Sanitize document ID to meet Appwrite ID specifications
            const documentId = slug 
                ? slug.toLowerCase().replace(/[^a-z0-9._-]/g, '-').replace(/^-+|-+$/g, '').substring(0, 36) || ID.unique()
                : ID.unique();

            const data = {
                title,
                slug,
                content,
                featuredImage,
                status,
                userId,
                views: 0,
                likes: [],
                category: category || 'Other',
            };
            if (authorName) data.authorName = authorName;

            return await this.databases.createDocument(
                conf.appwriteDatabaseID,
                conf.appwriteCollectionID,
                documentId,
                data
            );
        } catch (error) {
            this._handleError('createPost', error);
        }
    }

    async updatePost(slug, { title, content, featuredImage, status, category }) {
        try {
            const data = { title, content, featuredImage, status };
            if (category !== undefined) {
                data.category = category || 'Other';
            }
            return await this.databases.updateDocument(
                conf.appwriteDatabaseID,
                conf.appwriteCollectionID,
                slug,
                data
            );
        } catch (error) {
            this._handleError('updatePost', error);
        }
    }

    async incrementView(slug, currentViews = 0) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseID,
                conf.appwriteCollectionID,
                slug,
                { views: (currentViews || 0) + 1 }
            );
        } catch (error) {
            // Non-critical operation, do not throw
            console.error('Failed to increment view:', error);
        }
    }

    async toggleLike(slug, userId, currentLikes = []) {
        try {
            const safeLikes = Array.isArray(currentLikes) ? currentLikes : [];
            const hasLiked = safeLikes.includes(userId);
            const newLikes = hasLiked
                ? safeLikes.filter(id => id !== userId)
                : [...safeLikes, userId];

            return await this.databases.updateDocument(
                conf.appwriteDatabaseID,
                conf.appwriteCollectionID,
                slug,
                { likes: Array.from(new Set(newLikes)) }
            );
        } catch (error) {
            this._handleError('toggleLike', error);
        }
    }

    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseID,
                conf.appwriteCollectionID,
                slug
            );
            return true;
        } catch (error) {
            this._handleError('deletePost', error);
        }
    }

    async getPost(slug) {
        try {
            const doc = await this.databases.getDocument(
                conf.appwriteDatabaseID,
                conf.appwriteCollectionID,
                slug
            );
            if (doc) {
                doc.likes = Array.isArray(doc.likes) ? doc.likes : [];
                doc.views = doc.views || 0;
                doc.category = doc.category || 'Other';
            }
            return doc;
        } catch (error) {
            this._handleError('getPost', error);
        }
    }

    async getPosts(queries = [Query.equal("status", "active"), Query.limit(100), Query.orderDesc("$createdAt")]) {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteCollectionID,
                queries
            );
            if (response?.documents) {
                response.documents = response.documents.map(doc => ({
                    ...doc,
                    likes: Array.isArray(doc.likes) ? doc.likes : [],
                    views: doc.views || 0,
                    category: doc.category || 'Other'
                }));
            }
            return response;
        } catch (error) {
            this._handleError('getPosts', error);
        }
    }

    async getPostsByAuthor(userId) {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteCollectionID,
                [Query.equal("userId", userId), Query.limit(100), Query.orderDesc("$createdAt")]
            );
            if (response?.documents) {
                response.documents = response.documents.map(doc => ({
                    ...doc,
                    likes: Array.isArray(doc.likes) ? doc.likes : [],
                    views: doc.views || 0,
                    category: doc.category || 'Other'
                }));
            }
            return response;
        } catch (error) {
            this._handleError('getPostsByAuthor', error);
        }
    }

    // User Profile Services

    async createUserProfile({ userId, username, profilePic }) {
        try {
            if (!conf.appwriteUsersCollectionID) throw new Error("Users collection ID is not configured.");
            const data = { userId, username };
            if (profilePic) data.profilePic = profilePic;
            
            return await this.databases.createDocument(
                conf.appwriteDatabaseID,
                conf.appwriteUsersCollectionID,
                userId, // use userId as document ID for easy fetching
                data
            );
        } catch (error) {
            this._handleError('createUserProfile', error);
        }
    }

    async getUserProfile(userId) {
        try {
            if (!conf.appwriteUsersCollectionID) return null;
            return await this.databases.getDocument(
                conf.appwriteDatabaseID,
                conf.appwriteUsersCollectionID,
                userId
            );
        } catch {
            // It's normal for a user not to have a profile yet (legacy users)
            console.log("No public profile found for user:", userId);
            return null;
        }
    }

    async updateUserProfile(userId, { username, profilePic }) {
        try {
            if (!conf.appwriteUsersCollectionID) throw new Error("Users collection ID is not configured.");
            const data = {};
            if (username !== undefined) data.username = username;
            if (profilePic !== undefined) data.profilePic = profilePic;

            return await this.databases.updateDocument(
                conf.appwriteDatabaseID,
                conf.appwriteUsersCollectionID,
                userId,
                data
            );
        } catch (error) {
            // If document doesn't exist (404), create it automatically
            if (error?.code === 404 || error?.status === 404) {
                return await this.createUserProfile({ userId, username: username || 'Anonymous', profilePic });
            }
            this._handleError('updateUserProfile', error);
        }
    }

    async subscribeNewsletter(email) {
        try {
            if (!conf.appwriteSubscribersCollectionID) {
                throw new Error("Subscribers collection ID is not configured.");
            }
            return await this.databases.createDocument(
                conf.appwriteDatabaseID,
                conf.appwriteSubscribersCollectionID,
                ID.unique(),
                { email }
            );
        } catch (error) {
            this._handleError('subscribeNewsletter', error);
        }
    }

    // File upload service

    async uploadFile(file) {
        try {
            if (!file) {
                throw new Error('No file provided to upload.');
            }
            return await this.bucket.createFile(
                conf.appwriteBucketID,
                ID.unique(),
                file
            );
        } catch (error) {
            this._handleError('uploadFile', error);
        }
    }

    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketID,
                fileId
            );
            return true;
        } catch (error) {
            this._handleError('deleteFile', error);
        }
    }

    getFilePreview(fileId) {
        try {
            return this.bucket.getFileView(
                conf.appwriteBucketID,
                fileId
            );
        } catch (error) {
            this._handleError('getFilePreview', error);
        }
    }
}

const service = new Service();
export default service;
