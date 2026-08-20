export default {
  async fetch(request) {

    const url = new URL(request.url)

    // 🔐 token protection
    if (url.searchParams.get("token") !== "abc123") {
      return new Response("Forbidden", { status: 403 })
    }

    // 🔍 allow only Clash clients
    const ua = request.headers.get("User-Agent") || ""

    const allowedUA = [
      "Clash",
      "clash",
      "Meta",
      "FiClash",
      "Stash",
      "okhttp"
    ]

    if (!allowedUA.some(a => ua.includes(a))) {
      return new Response("404 Not Found", { status: 404 })
    }

    // =========================
    // 📦 PROXY LIST ENDPOINT
    // =========================
    if (url.pathname === "/proxies") {

      const proxies = `
proxies:

  - name: proxy1
    type: http
    server: 202.40.180.51
    port: 8020

  - name: proxy2
    type: http
    server: 202.40.177.197
    port: 8267

  - name: proxy3
    type: http
    server: 202.40.184.190
    port: 5241

  - name: proxy4
    type: http
    server: 202.40.187.17
    port: 2327

  - name: proxy5
    type: http
    server: 103.35.110.221
    port: 8267

  - name: proxy6
    type: http
    server: 103.35.111.26
    port: 8504

  - name: proxy7
    type: http
    server: 103.35.111.126
    port: 8267

  - name: proxy8
    type: http
    server: 103.35.111.241
    port: 8267

  - name: proxy9
    type: http
    server: 103.198.133.154
    port: 2610

  - name: proxy10
    type: http
    server: 103.198.133.177
    port: 2610
`

      return new Response(proxies, {
        headers: { "Content-Type": "text/plain" }
      })
    }

    // =========================
    // ⚡ MAIN CONFIG
    // =========================
    const config = `
proxy-providers:
  myprovider:
    type: http
    url: "${url.origin}/proxies?token=abc123"
    interval: 3600
    path: ./proxies.yaml
    health-check:
      enable: true
      url: http://www.gstatic.com/generate_204
      interval: 60

proxy-groups:

  - name: SELECTOR🔥
    type: select
    proxies:
      - LOAD-BALANCE

  - name: STABLE
    type: url-test
    url: http://www.gstatic.com/generate_204
    interval: 300
    tolerance: 50
    use:
      - myprovider

  - name: LOAD-BALANCE
    type: load-balance
    strategy: consistent-hashing
    url: http://www.gstatic.com/generate_204
    interval: 10
    tolerance: 100
    use:
      - myprovider

  - name: ALL
    type: select
    use:
      - myprovider

rules:
  - DOMAIN-SUFFIX,googlevideo.com,SELECTOR🔥
  - DOMAIN-SUFFIX,youtube.com,SELECTOR🔥
  - DOMAIN-SUFFIX,gstatic.com,SELECTOR🔥
  - DOMAIN-SUFFIX,googleapis.com,SELECTOR🔥
  - DOMAIN-SUFFIX,cloudflare.com,SELECTOR🔥
  - DOMAIN-SUFFIX,akamaihd.net,SELECTOR🔥
  - DOMAIN-SUFFIX,fastly.net,SELECTOR🔥
  - DOMAIN-SUFFIX,cdn.jsdelivr.net,SELECTOR🔥
  - MATCH,SELECTOR🔥
`

    return new Response(config, {
      headers: { "Content-Type": "text/plain" }
    })
  }
}
