import { CONSTANTS, MESSAGES } from './constants';

export function validateFileSize(file: File): string | null {
  if (file.size > CONSTANTS.MAX_FILE_SIZE) {
    return MESSAGES.ERRORS.FILE_TOO_LARGE;
  }

  return null;
}

export function validateTotalSize(files: File[]): string | null {
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  if (totalSize > CONSTANTS.MAX_TOTAL_SIZE) {
    return MESSAGES.ERRORS.TOTAL_SIZE_EXCEEDED;
  }

  return null;
}

export function validateFileType(file: File): string | null {
  if (
    !CONSTANTS.ALLOWED_MIME_TYPES.includes(
      file.type as (typeof CONSTANTS.ALLOWED_MIME_TYPES)[number],
    )
  ) {
    return MESSAGES.ERRORS.UNSUPPORTED_FORMAT;
  }

  return null;
}

export function validateFiles(files: File[]): string | null {
  if (files.length === 0) {
    return MESSAGES.ERRORS.NO_FILES;
  }

  for (const file of files) {
    const sizeError = validateFileSize(file);

    if (sizeError) {
      return sizeError;
    }

    const typeError = validateFileType(file);

    if (typeError) {
      return typeError;
    }
  }

  const totalError = validateTotalSize(files);

  if (totalError) {
    return totalError;
  }

  return null;
}
