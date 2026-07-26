import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import authService from '../appwrite/auth';
import appwriteService from '../appwrite/config';
import { apiSlice } from '../store/apiSlice';
import toast from 'react-hot-toast';

function OAuthCallback() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const hasProcessed = useRef(false);

    useEffect(() => {
        if (hasProcessed.current) return;
        hasProcessed.current = true;

        const handleOAuthCallback = async () => {
            try {
                // 1. Get current logged in user from Appwrite session
                const currentUser = await authService.getCurrentUser();
                
                    if (currentUser) {
                        // 2. Check if a public profile already exists in database
                        let existingProfile = null;
                        try {
                            existingProfile = await appwriteService.getUserProfile(currentUser.$id);
                        } catch (error) {
                            console.log("No profile found for OAuth user:", error);
                        }

                        // Profile is complete if it exists and is not a placeholder
                        const isProfileComplete = Boolean(
                            existingProfile && 
                            existingProfile.username && 
                            existingProfile.username !== 'Anonymous User' && 
                            existingProfile.username !== 'Anonymous'
                        );

                        if (isProfileComplete) {
                            // Existing user with complete profile -> log in directly silently
                            dispatch(apiSlice.util.invalidateTags(['UserProfile']));
                            dispatch(login({ userData: currentUser }));
                            navigate('/');
                        } else {
                            // First-time Google user (from either Login or Signup page) -> redirect to complete username & profile picture
                            const googleAvatar = currentUser?.prefs?.avatar || currentUser?.prefs?.picture || currentUser?.picture || null;
                            dispatch(login({ userData: currentUser }));
                            navigate('/signup?googleNew=true', {
                                state: {
                                    isGoogleNew: true,
                                    name: currentUser.name || '',
                                    email: currentUser.email || '',
                                    googleAvatar: googleAvatar
                                }
                            });
                        }
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
