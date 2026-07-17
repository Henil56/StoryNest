import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import authService from '../appwrite/auth';
import appwriteService from '../appwrite/config';
import toast from 'react-hot-toast';

function OAuthCallback() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const handleOAuthCallback = async () => {
            try {
                // 1. Get current logged in user from Appwrite session
                const currentUser = await authService.getCurrentUser();
                
                if (currentUser) {
                    // 2. Check if a public profile already exists
                    try {
                        const existingProfile = await appwriteService.getUserProfile(currentUser.$id);
                        if (!existingProfile) {
                            // If profile doesn't exist, create one (using their Google name)
                            await appwriteService.createUserProfile({
                                userId: currentUser.$id,
                                username: currentUser.name || 'Anonymous User',
                                profilePic: null
                            });
                        }
                    } catch (error) {
                        // DocumentNotFound error means profile doesn't exist, so we create it
                        if (error?.code === 404) {
                            await appwriteService.createUserProfile({
                                userId: currentUser.$id,
                                username: currentUser.name || 'Anonymous User',
                                profilePic: null
                            });
                        } else {
                            throw error;
                        }
                    }

                    // 3. Update Redux store
                    dispatch(login({ userData: currentUser }));
                    toast.success('Successfully logged in with Google!');
                    
                    // 4. Redirect to home
                    navigate('/');
                } else {
                    toast.error('Failed to retrieve user data from Google.');
                    navigate('/login');
                }
            } catch (error) {
                console.error("OAuth Callback Error:", error);
                toast.error('Authentication failed. Please try again.');
                navigate('/login');
            }
        };

        handleOAuthCallback();
    }, [dispatch, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface">
            <div className="flex flex-col items-center gap-4 animate-fade-in">
                <div className="w-12 h-12 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-text-muted">Authenticating with Google...</p>
            </div>
        </div>
    );
}

export default OAuthCallback;
