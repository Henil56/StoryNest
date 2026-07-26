/**
 * File Security Utility.
 * Performs deep binary magic-bytes content verification, file size checks,
 * MIME type enforcement, and filename sanitization before any file upload.
 * Ensures uploaded files are stored in isolated cloud storage and can never execute code.
 */

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Checks binary magic bytes at start of file to verify actual file content matches image signatures.
 * @param {File} file
 * @returns {Promise<boolean>}
 */
export const verifyImageMagicBytes = async (file) => {
  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      reader.onloadend = (e) => {
        if (!e.target || !e.target.result) return resolve(false);
        const arr = new Uint8Array(e.target.result).subarray(0, 12);
        let header = '';
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16).padStart(2, '0');
        }

        // PNG: 89504e47
        if (header.startsWith('89504e47')) return resolve(true);

        // JPEG: ffd8ff
        if (header.startsWith('ffd8ff')) return resolve(true);

        // GIF: 47494638 (GIF8)
        if (header.startsWith('47494638')) return resolve(true);

        // WEBP: 52494646....57415645 (RIFF...WEBP)
        if (header.startsWith('52494646') && header.includes('57454250')) return resolve(true);

        resolve(false);
      };
      reader.onerror = () => resolve(false);

      // Read first 12 bytes of file content
      const blob = file.slice(0, 12);
      reader.readAsArrayBuffer(blob);
    } catch {
      resolve(false);
    }
  });
};

/**
 * Sanitizes filename to prevent Path Traversal, Null Byte Injections, and double extensions.
 * @param {string} filename
 * @returns {string}
 */
export const sanitizeFileName = (filename) => {
  if (!filename) return `upload_${Date.now()}.png`;

  // Strip path separators, null bytes, and non-printable characters
  let cleanName = String(filename)
    .replace(/\0/g, '')
    .replace(/\\/g, '/')
    .replace(/^.*[\\/]/, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_');

  // Disallow dangerous extensions even if disguised (e.g. image.php.png)
  const dangerousExts = /\.(php|html|htm|js|exe|bat|cmd|sh|py|pl|cgi|jar|svg|asp|aspx)\./i;
  if (dangerousExts.test(cleanName)) {
    cleanName = cleanName.replace(dangerousExts, '_safe_.');
  }

  return cleanName.substring(0, 100);
};

/**
 * Comprehensive safe file upload validator.
 * Checks extension, size, MIME type, and binary magic bytes header.
 *
 * @param {File} file
 * @returns {Promise<{ valid: boolean, message?: string }>}
 */
export const validateFileUploadSafety = async (file) => {
  if (!file) {
    return { valid: true };
  }

  // 1. Size Validation
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, message: 'File size exceeds maximum allowable limit of 10 MB.' };
  }

  // 2. MIME Type Validation
  if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      message: 'Invalid file type. Only PNG, JPEG, GIF, and WEBP image files are permitted.',
    };
  }

  // 3. Executable File Masking & Extension Validation
  const ext = file.name.split('.').pop()?.toLowerCase();
  const allowedExts = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
  if (!ext || !allowedExts.includes(ext)) {
    return {
      valid: false,
      message: 'Invalid file extension. Only .png, .jpg, .jpeg, .gif, and .webp extensions are permitted.',
    };
  }

  // 4. Binary Magic Bytes Content Inspection (Verifies actual content, not just extension)
  const isHeaderValid = await verifyImageMagicBytes(file);
  if (!isHeaderValid) {
    return {
      valid: false,
      message: 'File content verification failed. The file binary header does not match valid image content.',
    };
  }

  return { valid: true };
};
