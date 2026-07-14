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
            const data = {
                title,
                slug,
                content,
                featuredImage,
                status,
                userId,
                views: 0,
                likes: [],
            };
            if (category) data.category = category;
            if (authorName) data.authorName = authorName;
            return await this.databases.createDocument(
                conf.appwriteDatabaseID,
                conf.appwriteCollectionID,
                slug || ID.unique(),
                data
            );
        } catch (error) {
            this._handleError('createPost', error);
        }
    }

    async updatePost(slug, { title, content, featuredImage, status, category }) {
        try {
            const data = { title, content, featuredImage, status };
            if (category !== undefined) data.category = category;
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
                { views: currentViews + 1 }
            );
        } catch (error) {
            // Non-critical operation, do not throw
            console.error('Failed to increment view:', error);
        }
    }

    async toggleLike(slug, userId, currentLikes = []) {
        try {
            const hasLiked = currentLikes.includes(userId);
            const newLikes = hasLiked
                ? currentLikes.filter(id => id !== userId)
                : [...currentLikes, userId];

            return await this.databases.updateDocument(
                conf.appwriteDatabaseID,
                conf.appwriteCollectionID,
                slug,
                { likes: newLikes }
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
            return await this.databases.getDocument(
                conf.appwriteDatabaseID,
                conf.appwriteCollectionID,
                slug
            );
        } catch (error) {
            this._handleError('getPost', error);
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteCollectionID,
                queries
            );
        } catch (error) {
            this._handleError('getPosts', error);
        }
    }

    async getPostsByAuthor(userId) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteCollectionID,
                [Query.equal("userId", userId), Query.equal("status", "active")]
            );
        } catch (error) {
            this._handleError('getPostsByAuthor', error);
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
