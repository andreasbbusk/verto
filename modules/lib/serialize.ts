/**
 * Serialize MongoDB documents to plain objects for Next.js Server Components
 *
 * This is necessary because Next.js can't pass objects with methods (like MongoDB ObjectId)
 * from Server Components to Client Components. We need to convert them to plain objects.
 */

/**
 * Recursively serialize a value to a plain object
 * - Removes _id fields (we use numeric id instead)
 * - Converts Dates to ISO strings
 * - Handles arrays and nested objects
 * - Strips any non-serializable values
 */
export function serialize<T>(value: T): T {
  if (value === null || value === undefined) {
    return value;
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return value.map((item) => serialize(item)) as T;
  }

  // Handle objects
  if (typeof value === 'object') {
    // Handle Date objects
    if (value instanceof Date) {
      return value.toISOString() as T;
    }

    // Handle MongoDB ObjectId and other objects with toJSON
    if ('toJSON' in value && typeof value.toJSON === 'function') {
      // For ObjectId, we don't need it since we have numeric id
      // Skip it by returning undefined, which will be filtered out
      return undefined as T;
    }

    // Handle plain objects
    const serialized: Record<string, unknown> = {};

    for (const [key, val] of Object.entries(value)) {
      // Skip _id field - we use numeric id instead
      if (key === '_id') {
        continue;
      }

      const serializedValue = serialize(val);

      // Only include defined values
      if (serializedValue !== undefined) {
        serialized[key] = serializedValue;
      }
    }

    return serialized as T;
  }

  // Return primitives as-is (string, number, boolean)
  return value;
}
