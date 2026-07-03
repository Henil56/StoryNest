import conf from '../conf/conf.js';
import { Client, Account, ID ,Databases,Storage,Query,TablesDB} from "appwrite";


export class Service {
    client = new Client();
    tablesDB;
    bucket;

    constructor() {
        if (!conf?.appwriteUrl || !conf?.appwriteProjectID) {
            throw new Error('Appwrite configuration missing: set appwriteUrl and appwriteProjectID in conf.');
        }

        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectID);

        this.tablesDB = new TablesDB(this.client);
        this.bucket = new Storage(this.client);
    }

    _handleError(operation, error) {
        console.error(`[Appwrite Service] ${operation} failed:`, error);
        const err = new Error(`${operation} failed: ${error?.message || error}`);
        err.code = error?.code || error?.status || 'APPWRITE_ERROR';
        err.cause = error;
        throw err;
    }

    async createPost({ title, slug, content, featuredImage, status, userId }) {
        try {
            return await this.tablesDB.createRow({
                databaseId: conf.appwriteDatabaseID,
                tableId: conf.appwriteCollectionID,
                rowId: slug || ID.unique(),
                data: {
                    title,
                    slug,
                    content,
                    featuredImage,
                    status,
                    userId,
                    views: 0,
                    likes: [],
                }
            });
        } catch (error) {
            this._handleError('createPost', error);
        }
    }
    

    async updatePost(slug, { title, content, featuredImage, status }) {
    try {
        return await this.tablesDB.updateRow({
            databaseId: conf.appwriteDatabaseID,
            tableId: conf.appwriteCollectionID,
            rowId: slug,
            data: {
                title,
                content,
                featuredImage,
                status,
            }
        });
    } catch (error) {
        this._handleError('updatePost', error);
    }
    }

    async incrementView(slug, currentViews = 0) {
        try {
            return await this.tablesDB.updateRow({
                databaseId: conf.appwriteDatabaseID,
                tableId: conf.appwriteCollectionID,
                rowId: slug,
                data: {
                    views: currentViews + 1
                }
            });
        } catch (error) {
            console.error('Failed to increment view:', error);
            // Non-critical operation, so we don't throw
        }
    }

    async toggleLike(slug, userId, currentLikes = []) {
        try {
            // Check if user already liked
            const hasLiked = currentLikes.includes(userId);
            
            // Create new likes array (add or remove userId)
            let newLikes;
            if (hasLiked) {
                newLikes = currentLikes.filter(id => id !== userId);
            } else {
                newLikes = [...currentLikes, userId];
            }

            return await this.tablesDB.updateRow({
                databaseId: conf.appwriteDatabaseID,
                tableId: conf.appwriteCollectionID,
                rowId: slug,
                data: {
                    likes: newLikes
                }
            });
        } catch (error) {
            this._handleError('toggleLike', error);
        }
    }

    async deletePost(slug) {
    try {
        await this.tablesDB.deleteRow({
            databaseId: conf.appwriteDatabaseID,
            tableId: conf.appwriteCollectionID,
            rowId: slug,
        });
        return true;
    } catch (error) {
        this._handleError('deletePost', error);
    }
    }
    async getPost(slug){
        try {
            return await this.tablesDB.getRow({
                databaseId: conf.appwriteDatabaseID,
                tableId: conf.appwriteCollectionID,
                rowId: slug,
        });
        } catch (error) {
            this._handleError('getPost', error);
        }
    }
    async getPosts(queries=[Query.equal("status","active")]){
        try {
            return await this.tablesDB.listRows({
                databaseId: conf.appwriteDatabaseID,
                tableId: conf.appwriteCollectionID,
                queries,
        });
        } catch (error) {
            this._handleError('getPost', error);
        }
    }

    async subscribeNewsletter(email) {
        try {
            if (!conf.appwriteSubscribersCollectionID) {
                throw new Error("Subscribers collection ID is not configured.");
            }
            return await this.tablesDB.createRow({
                databaseId: conf.appwriteDatabaseID,
                tableId: conf.appwriteSubscribersCollectionID,
                rowId: ID.unique(),
                data: {
                    email: email,
                }
            });
        } catch (error) {
            this._handleError('subscribeNewsletter', error);
        }
    }

    //file upload servive

    async uploadFile(file){
        try {
            const fileToUpload = file || (typeof document !== 'undefined' && document.getElementById('uploader')?.files?.[0]);
            if (!fileToUpload) {
                throw new Error('No file provided to upload. Pass a File to uploadFile(file) or provide an input#uploader in the DOM.');
            }
            return await this.bucket.createFile({             
                bucketId: conf.appwriteBucketID,
                fileId: ID.unique(),
                file: file
        })   
        } catch (error) {
            this._handleError('uploadFile', error);
        }
    }
    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile({
                bucketId: conf.appwriteBucketID,
                fileId: fileId
            })
            return true
        } catch (error) {
            this._handleError('deleteFile', error);
        }
    }
    getFilePreview(fileId){
        try {
            return this.bucket.getFileView({
                bucketId: conf.appwriteBucketID,
                fileId: fileId,
            });
        } catch (error) {
            this._handleError('getFilePreview', error);
        }
    }
    
}

const service = new Service();
export default service;
