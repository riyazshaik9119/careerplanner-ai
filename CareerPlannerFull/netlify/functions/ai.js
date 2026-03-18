exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-access-code',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // ── ACCESS CODE CHECK (beta protection) ──
  const accessCode = event.headers['x-access-code'] || '';
  const validCode = process.env.ACCESS_CODE || 'careerAI2025';
  if (accessCode !== validCode) {
    return {
      statusCode: 401, headers,
      body: JSON.stringify({ error: 'Invalid access code. Contact Riyaz for access.' })
    };
  }

  // ── RATE LIMITING (basic — 50 requests per IP per day) ──
  // In production you'd use a Redis store; here we just pass through
  // and rely on Netlify's built-in request limits

  try {
    const body = JSON.parse(event.body || '{}');
    const { messages, system, max_tokens = 1500, model = 'claude-sonnet-4-5' } = body;

    if (!messages || !Array.isArray(messages)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid request body' }) };
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server configuration error' }) };
    }

    const payload = { model, max_tokens, messages };
    if (system) payload.system = system;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status, headers,
        body: JSON.stringify({ error: data.error?.message || 'AI request failed' })
      };
    }

    return { statusCode: 200, headers, body: JSON.stringify(data) };

  } catch (err) {
    return {
      statusCode: 500, headers,
      body: JSON.stringify({ error: 'Server error: ' + err.message })
    };
  }
};
