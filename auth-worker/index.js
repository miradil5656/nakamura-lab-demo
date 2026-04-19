export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    if (url.pathname === '/auth') {
      const provider = url.searchParams.get('provider');
      const siteId = url.searchParams.get('site_id') || '';
      const scope = url.searchParams.get('scope') || 'repo,user';

      if (provider !== 'github') {
        return new Response('Unsupported provider', { status: 400 });
      }

      const state = btoa(JSON.stringify({ siteId, nonce: crypto.randomUUID() }));
      const params = new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        redirect_uri: `${url.origin}/callback`,
        scope,
        state,
      });

      return Response.redirect(
        `https://github.com/login/oauth/authorize?${params}`,
        302
      );
    }

    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      const stateRaw = url.searchParams.get('state') || '';

      let siteId = '';
      try {
        siteId = JSON.parse(atob(stateRaw)).siteId || '';
      } catch {}

      const origin = siteId ? `https://${siteId}` : '*';

      try {
        const res = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: env.GITHUB_CLIENT_ID,
            client_secret: env.GITHUB_CLIENT_SECRET,
            code,
            redirect_uri: `${url.origin}/callback`,
          }),
        });

        const data = await res.json();

        if (!data.access_token) {
          return postMessagePage(origin, 'error', {
            message: data.error_description || 'Token exchange failed',
          });
        }

        return postMessagePage(origin, 'success', {
          token: data.access_token,
          provider: 'github',
        });
      } catch (err) {
        return postMessagePage(origin, 'error', { message: err.message });
      }
    }

    return new Response('Not Found', { status: 404 });
  },
};

function postMessagePage(origin, status, content) {
  const msg = `authorization:github:${status}:${JSON.stringify(content)}`;
  return new Response(
    `<!DOCTYPE html><html><body><script>
(function(){
  var msg=${JSON.stringify(msg)};
  var origin=${JSON.stringify(origin)};
  if(window.opener){window.opener.postMessage(msg,origin);window.close();}
  else{document.write('<p>Auth complete. You may close this window.</p>');}
})();
</script></body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
