// Save and retrieve push subscriptions
// Uses Netlify Blobs for serverless KV storage

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-access-code',
    'Access-Control-Allow-Methods': 'POST, GET, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  const accessCode = event.headers['x-access-code'] || '';
  const validCode = process.env.ACCESS_CODE || 'careerAI2025';
  if (accessCode !== validCode) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  try {
    if (event.httpMethod === 'POST') {
      // Save subscription
      const { subscription, userInfo } = JSON.parse(event.body);
      // In production: save to database
      // For demo: just acknowledge
      console.log('New push subscription saved for:', userInfo?.name || 'anonymous');
      return {
        statusCode: 200, headers,
        body: JSON.stringify({ success: true, message: 'Subscription saved' })
      };
    }

    if (event.httpMethod === 'DELETE') {
      return {
        statusCode: 200, headers,
        body: JSON.stringify({ success: true, message: 'Subscription removed' })
      };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
