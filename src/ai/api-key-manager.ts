// This is a simple in-memory store. For a production-grade, multi-server
// environment, you would want to use a more robust shared-state solution
// like Redis or a database to track key usage and cooldowns.

let apiKeys: string[] = [];
let currentIndex = 0;

function loadApiKeys() {
  const keysEnv = process.env.GEMINI_API_KEYS;
  if (keysEnv) {
    apiKeys = keysEnv.split(',').map(key => key.trim()).filter(key => key);
    if (apiKeys.length === 0) {
        // Fallback to single key if GEMINI_API_KEYS is empty but GEMINI_API_KEY exists
        const singleKey = process.env.GEMINI_API_KEY;
        if (singleKey) {
            apiKeys.push(singleKey);
        }
    }
  } else if (process.env.GEMINI_API_KEY) {
    // If only the single key is defined
    apiKeys.push(process.env.GEMINI_API_KEY);
  }

  if (apiKeys.length === 0) {
    console.warn('Gemini API key not found. Please set GEMINI_API_KEYS or GEMINI_API_KEY in your .env file.');
  }
}

// Load keys on server startup
loadApiKeys();

/**
 * Retrieves the next API key from the pool in a round-robin fashion.
 */
export function getNextApiKey(): string {
  if (apiKeys.length === 0) {
    return ''; // Should not happen if keys are configured
  }

  const key = apiKeys[currentIndex];
  currentIndex = (currentIndex + 1) % apiKeys.length;
  return key;
}
