import appwriteService from '../appwrite/config';

export function getAvatarUrl(profilePic, email, username) {
  if (profilePic) {
    if (typeof profilePic === 'string' && (profilePic.startsWith('http://') || profilePic.startsWith('https://'))) {
      return profilePic;
    }
    try {
      return appwriteService.getFilePreview(profilePic);
    } catch {
      // Fallback below
    }
  }

  const displayName = username || (email ? email.split('@')[0] : 'User');
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=9D174D&color=fff&bold=true`;
}
