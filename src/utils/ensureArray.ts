/* utils/ensureArray.ts */
export const ensureArray = <T = unknown>(value: unknown): T[] => {
    if (Array.isArray(value)) return value as T[];
    try {
      return JSON.parse(value as string || '[]');
    } catch {
      return [];
    }
  };
  