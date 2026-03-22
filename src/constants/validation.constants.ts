export const VALIDATION_LIMITS = {
  COMPLAINT: {
    TITLE_MIN_LENGTH: 10,
    TITLE_MAX_LENGTH: 200,
    DESCRIPTION_MIN_LENGTH: 50,
    DESCRIPTION_MAX_LENGTH: 5000,
    MAX_ATTACHMENTS: 5
  },
  USER: {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
    PASSWORD_MIN_LENGTH: 8
  },
  FILE: {
    MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  }
} as const;
