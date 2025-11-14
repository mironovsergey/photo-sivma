export const CONSTANTS = {
  MAX_FILE_SIZE: 200 * 1024 * 1024,
  MAX_TOTAL_SIZE: 200 * 1024 * 1024,

  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/heif'],
  ALLOWED_EXTENSIONS: ['jpg', 'jpeg', 'png', 'heic', 'heif'],
} as const;

export const MESSAGES = {
  ERRORS: {
    FILE_TOO_LARGE: 'Файл слишком большой. Максимальный размер: 200 МБ',
    TOTAL_SIZE_EXCEEDED: 'Общий размер файлов превышает 200 МБ',
    UNSUPPORTED_FORMAT: 'Неподдерживаемый формат файла',
    UPLOAD_FAILED: 'Ошибка при загрузке файлов',
    NO_FILES: 'Выберите хотя бы один файл',
  },
  SUCCESS: {
    UPLOAD_COMPLETE: 'Файлы успешно загружены!',
  },
} as const;
