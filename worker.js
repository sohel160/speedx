export default {
  async fetch(request) {

    const url = new URL(request.url)

    // 🔐 Token protection
    if (url.searchParams.get("token") !== "abc123") {
      return new Response("Forbidden", { status: 403 })
    }

    // 🔍 Allow only Clash clients
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

      const proxies = `proxies:

  - name: proxy1
    type: socks5
    server: 103.126.219.253
    port: 65088
    username: 1
    password: 1

  - name: proxy2
    type: socks5
    server: 103.126.219.254
    port: 65088
    username: 1
    password: 1

  - name: proxy3
    type: socks5
    server: 103.126.219.255
    port: 65088
    username: 1
    password: 1
`

      return new Response(proxies, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8"
        }
      })
    }

    // =========================
    // ⚡ MAIN CONFIG
    // =========================
    const config = `proxy-providers:
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
      - STABLE

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
      headers: {
        "Content-Type": "text/plain; charset=utf-8"
      }
    })
  }
}
