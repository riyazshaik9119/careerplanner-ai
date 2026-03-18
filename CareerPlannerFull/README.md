# CareerPlanner AI — Full Stack

## Quick Deploy to Netlify (5 minutes)

1. Go to https://app.netlify.com
2. Click "Add new site" → "Deploy manually"
3. Drag & drop the entire `CareerPlannerFull` folder
4. Once deployed, go to Site Settings → Environment Variables
5. Add these two variables:
   - `ANTHROPIC_API_KEY` = your key from console.anthropic.com
   - `ACCESS_CODE` = careerAI2025 (or change to anything you like)
6. Redeploy → your app is live!

## Share with Friends
- Share your Netlify URL (e.g. https://careerplanner.netlify.app)
- Access code: careerAI2025 (you can change this in env variables)

## Access Codes for Beta Testers
Default codes built in: careerAI2025, riyaz2025, betauser, career123
To add more codes, edit netlify/functions/ai.js line 13

## Cost
- Netlify hosting: FREE
- API calls: ~₹0.50–2 per AI request (you pay via Anthropic)
- Estimated monthly cost for 50 active users: ~₹200–500/month

## File Structure
CareerPlannerFull/
├── netlify/
│   └── functions/
│       └── ai.js          ← Backend (hides your API key)
├── public/
│   ├── index.html         ← Full app (100 features)
│   ├── manifest.json      ← PWA config
│   ├── sw.js              ← Service worker (offline)
│   └── icons/             ← All app icons
├── netlify.toml           ← Routing config
└── README.md              ← This file
