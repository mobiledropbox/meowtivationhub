// api/callback.js
export default async function handler(req, res) {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).send('Missing code');
  }

  // IMPORTANT: Must match your GitHub OAuth settings exactly
  const redirectUri = "https://meowtivationhub.vercel.app/api/callback";

  const tokenRes = await fetch(
    'https://github.com/login/oauth/access_token',
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: redirectUri
      })
    }
  );

  const tokenJson = await tokenRes.json();

  if (tokenJson.error) {
    return res.status(500).send(JSON.stringify(tokenJson));
  }

  const access_token = tokenJson.access_token;

  // Short-lived cookie
  res.setHeader(
    'Set-Cookie',
    `meow_token_present=1; HttpOnly; Path=/; Max-Age=3600; Secure`
  );

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <html><body>
    <script>
      window.opener && window.opener.postMessage(
        { type: 'meow_token', token: '${access_token}' },
        '*'
      );
      window.close();
    </script>
    <p>Authenticated — you can close this window.</p>
    </body></html>
  `);
}
