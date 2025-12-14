export default async function handler(req, res) {
  // Allow requests from anywhere
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Accept both GET and POST for testing
  if (req.method === 'GET') {
    return res.status(200).json({ 
      success: true, 
      message: 'Function is working! Environment variables test:',
      env_check: {
        has_username: !!process.env.AT_USERNAME,
        has_api_key: !!process.env.AT_API_KEY,
        username_value: process.env.AT_USERNAME || 'NOT SET'
      }
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { recipients, message } = req.body;

    // Just return success without calling Africa's Talking
    return res.status(200).json({
      success: true,
      message: 'Function received your request successfully!',
      received_data: {
        recipients: recipients,
        message: message,
        env_vars_present: {
          username: !!process.env.AT_USERNAME,
          api_key: !!process.env.AT_API_KEY
        }
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
```

4. **Commit changes** (directly to main)

5. **Wait 30 seconds** for Vercel to redeploy

---

## 🧪 **STEP 2: Test the Function**

### **Test A: Simple GET Request**

1. **Open your browser**

2. **Go to this URL directly:**
```
   https://church-sms-backend.vercel.app/api/send-sms
