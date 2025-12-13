export default async function handler(req, res) {
  // Allow requests from anywhere (your Google AI Studio app)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { recipients, message } = req.body;

    if (!recipients || !message) {
      return res.status(400).json({ error: 'Missing recipients or message' });
    }

    // Get Africa's Talking credentials from environment variables
    const AT_USERNAME = process.env.AT_USERNAME;
    const AT_API_KEY = process.env.AT_API_KEY;
    const SENDER_ID = process.env.SENDER_ID || '';

    if (!AT_USERNAME || !AT_API_KEY) {
      return res.status(500).json({ error: 'Africa\'s Talking credentials not configured' });
    }

    // Format recipients (Africa's Talking accepts comma-separated or array)
    let phoneNumbers;
    if (Array.isArray(recipients)) {
      phoneNumbers = recipients.join(',');
    } else {
      phoneNumbers = recipients; // Already a string
    }

    // Prepare request body for Africa's Talking
    const params = new URLSearchParams({
      username: AT_USERNAME,
      to: phoneNumbers,
      message: message,
    });

    // Add sender ID if provided
    if (SENDER_ID) {
      params.append('from', SENDER_ID);
    }

    // Send SMS via Africa's Talking
    const response = await fetch('https://api.africastalking.com/version1/messaging', {
      method: 'POST',
      headers: {
        'apiKey': AT_API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: params
    });

    const data = await response.json();

    // Check if request was successful
    if (data.SMSMessageData && data.SMSMessageData.Recipients) {
      return res.status(200).json({
        success: true,
        message: 'SMS sent successfully',
        recipients: data.SMSMessageData.Recipients,
        details: data
      });
    } else {
      return res.status(400).json({
        success: false,
        error: 'Failed to send SMS',
        details: data
      });
    }

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
```

6. **Scroll down** and click **"Commit changes"**

7. In the popup:
   - Commit message: `Update to use Africa's Talking API`
   - Select: ✅ "Commit directly to main branch"
   - Click **"Commit changes"**

---

## 📋 **STEP 4: Deploy to Vercel** (Now Let's Go Live!)

1. **Go to Vercel**: https://vercel.com

2. Click **"Add New..."** (top right) → **"Project"**

3. Under **"Import Git Repository"**, you should see:
   - `kalujoseph/church-sms-backend`

4. Click **"Import"** next to it

5. **Configure Project** (leave everything as default):
   - Project Name: `church-sms-backend`
   - Framework Preset: Other
   - Root Directory: `./`

6. **DON'T CLICK DEPLOY YET!**

7. **Click on "Environment Variables"** (expand it)

8. **Add your Africa's Talking credentials:**

   **Variable 1:**
   - Key: `AT_USERNAME`
   - Value: `sandbox` (or your actual username)
   
   **Variable 2:**
   - Key: `AT_API_KEY`
   - Value: `Your-Actual-API-Key-Here` (paste it)
   
   **Variable 3 (Optional):**
   - Key: `SENDER_ID`
   - Value: `YourChurch` (max 11 characters, needs approval from Africa's Talking)

9. **NOW click "Deploy"**

10. **Wait 30-60 seconds...** ⏳

11. **Success!** 🎉 You'll see confetti and your deployment URL

12. **Copy your URL** - it looks like:
```
    https://church-sms-backend-xyz123.vercel.app
