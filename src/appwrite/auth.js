import conf from '../conf/conf.js';

import { Client, Account, ID, OAuthProvider } from "appwrite";

export class AuthService {
    client =new Client();
    account;
    constructor(){
        if (!conf?.appwriteUrl || !conf?.appwriteProjectID) {
            throw new Error('Appwrite configuration missing: set appwriteUrl and appwriteProjectID in conf.');
        }

        this.client
            .setEndpoint(conf.appwriteUrl) 
            .setProject(conf.appwriteProjectID);
        this.account = new Account(this.client);
    }

    _handleError(operation, error) {
        console.error(`[Auth Service] ${operation} failed:`, error);
        const err = new Error(`${operation} failed: ${error?.message || error}`);
        err.code = error?.code || error?.status || 'APPWRITE_ERROR';
        err.cause = error;
        throw err;
    }
    async createAccount({email,password,name}){
        try {
            if (!email || !password) {
                throw new Error('Email and password are required to create an account.');
            }
            // Appwrite v13+ uses positional arguments
            const userAccount = await this.account.create(
                ID.unique(),
                email,
                password,
                name
            );
            if (userAccount) {
                // create a session after signup and return it (keeps previous behaviour)
                return await this.login({ email, password });
            }
            return userAccount;
        } catch (error) {
            this._handleError('createAccount', error);
        }
    }
    async login({email,password}){
        try{
            if (!email || !password) {
                throw new Error('Email and password are required to log in.');
            }
            return await this.account.createEmailPasswordSession({email, password});
        }catch(error){
            this._handleError('login', error);
        }
    }
    
    loginWithGoogle() {
        try {
            // Note: window.location.origin dynamically gets the base URL (e.g., http://localhost:5173)
            this.account.createOAuth2Session(
                OAuthProvider.Google,
                `${window.location.origin}/oauth-callback`, // Success URL
                `${window.location.origin}/login` // Failure URL
            );
        } catch (error) {
            this._handleError('loginWithGoogle', error);
        }
    }

    async sendPasswordRecovery(email) {
        try {
            return await this.account.createRecovery(
                email,
                `${window.location.origin}/reset-password` // URL to redirect user to from email
            );
        } catch (error) {
            this._handleError('sendPasswordRecovery', error);
        }
    }

    async resetPassword(userId, secret, password, passwordAgain) {
        try {
            return await this.account.updateRecovery(
                userId,
                secret,
                password,
                passwordAgain
            );
        } catch (error) {
            this._handleError('resetPassword', error);
        }
    }

    async getCurrentUser(){
        try {
            return await this.account.get();
        } catch (error) {
            // console.log("Appwrite service :: getCurrentUser :: User is not logged in");
            return null;
        }
    }
    async logout(){
        try {
            await this.account.deleteSessions();
        } catch (error) {
            this._handleError('logout', error);
        }
    }
}
const authService = new AuthService(); 

export default authService
