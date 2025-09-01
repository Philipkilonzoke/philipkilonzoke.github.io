// Client-side config for AI panel (feature flags)
(function(){
  window.BL_FEATURES = window.BL_FEATURES || {};
  // Set this to your deployed server origin hosting /api/extract
  // Example: 'https://brightlens-api.yourdomain.com'
  window.BL_EXTRACT_ENDPOINT = window.BL_EXTRACT_ENDPOINT || '';
  // Optional token to authenticate to the proxy
  window.BL_EXTRACT_TOKEN = window.BL_EXTRACT_TOKEN || '';
})();

// Brightlens AI Config
// Set this to your deployed serverless endpoint base URL (no trailing slash)
// Example: window.BL_LLM_ENDPOINT = 'https://your-worker.your-domain.workers.dev';
window.BL_LLM_ENDPOINT = window.BL_LLM_ENDPOINT || '';

