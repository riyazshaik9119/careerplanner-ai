// Netlify Scheduled Function — runs daily at 7pm IST (13:30 UTC)
// Schedule set in netlify.toml
const { schedule } = require('@netlify/functions');

// In production, store subscriptions in a database (Fauna, Supabase, etc.)
// For now we use Netlify Blobs (built-in KV store)
const handler = async (event) => {
  console.log('Push notification cron fired:', new Date().toISOString());
  // This function triggers the notification logic
  // Actual push sending happens via /api/send-push endpoint
  return { statusCode: 200, body: JSON.stringify({ triggered: true }) };
};

exports.handler = schedule('30 13 * * *', handler); // 7pm IST daily
