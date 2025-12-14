
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Simple response for any request
  return res.status(200).json({
    success: true,
    message: 'Backend is alive!',
    method: req.method,
    timestamp: new Date().toISOString(),
    env_check: {
      username: process.env.AT_USERNAME || 'NOT SET',
      has_api_key: !!process.env.AT_API_KEY
    }
  });
}
```

4. **Commit changes**

---

## ⏱️ **STEP 3: Wait and Test**

1. **Wait 60 seconds** for both files to deploy

2. **Open browser** and go to:
```
   https://church-sms-backend.vercel.app/api/send-sms
