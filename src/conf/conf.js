const conf = {
  appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
  appwriteProjectID: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
  appwriteDatabaseID: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
  appwriteBucketID: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
  appwriteCollectionID: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
  appwriteSubscribersCollectionID: String(import.meta.env.VITE_APPWRITE_SUBSCRIBERS_COLLECTION_ID),
  appwriteUsersCollectionID: String(import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID),
  tinyMceAPIKEY: String(import.meta.env.VITE_TINYMCE_API_KEY),

  // Rate Limiting Configurable Thresholds
  rateLimit: {
    auth: {
      maxAttempts: Number(import.meta.env.VITE_RATE_LIMIT_AUTH_MAX || 5),
      windowMs: Number(import.meta.env.VITE_RATE_LIMIT_AUTH_WINDOW_MS || 15 * 60 * 1000),
      baseBackoffMs: Number(import.meta.env.VITE_RATE_LIMIT_AUTH_BASE_BACKOFF_MS || 2000),
      maxBackoffMs: Number(import.meta.env.VITE_RATE_LIMIT_AUTH_MAX_BACKOFF_MS || 120000),
    },
    public: {
      maxRequests: Number(import.meta.env.VITE_RATE_LIMIT_PUBLIC_MAX || 30),
      windowMs: Number(import.meta.env.VITE_RATE_LIMIT_PUBLIC_WINDOW_MS || 60 * 1000),
    },
    authenticated: {
      maxRequests: Number(import.meta.env.VITE_RATE_LIMIT_AUTHENTICATED_MAX || 60),
      windowMs: Number(import.meta.env.VITE_RATE_LIMIT_AUTHENTICATED_WINDOW_MS || 60 * 1000),
    }
  }
}

export default conf