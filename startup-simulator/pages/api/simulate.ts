import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * API proxy to forward requests to the FastAPI backend
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Forward the request to the FastAPI backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/api/simulate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    // Get response data
    const data = await response.json();

    // Return the response from the backend
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error forwarding request to backend:', error);
    res.status(500).json({ 
      error: 'Failed to connect to backend service',
      details: error instanceof Error ? error.message : String(error)
    });
  }
} 