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
  - { name: "HTTP-01", type: http, server: 113.212.109.164, port: 22622 }
  - { name: "HTTP-02", type: http, server: 113.212.109.163, port: 22622 }
  - { name: "HTTP-03", type: http, server: 113.212.109.132, port: 22622 }
  - { name: "HTTP-04", type: http, server: 113.212.109.164, port: 22622 }
  - { name: "HTTP-05", type: http, server: 103.84.36.237, port: 22622 }
  - { name: "HTTP-06", type: http, server: 113.212.109.188, port: 22622 }
  - { name: "HTTP-07", type: http, server: 103.84.36.237, port: 22622 }
  - { name: "HTTP-08", type: http, server: 113.212.109.56, port: 22622 }
  - { name: "HTTP-09", type: http, server: 103.84.38.110, port: 22622 }
  - { name: "HTTP-10", type: http, server: 103.84.38.84, port: 22622 }
  - { name: "HTTP-11", type: http, server: 103.84.38.52, port: 22622 }
  - { name: "HTTP-12", type: http, server: 103.84.37.196, port: 22622 }
  - { name: "HTTP-13", type: http, server: 103.84.37.132, port: 22622 }
  - { name: "HTTP-14", type: http, server: 103.84.37.123, port: 22622 }
  - { name: "HTTP-15", type: http, server: 103.84.37.100, port: 22622 }
  - { name: "HTTP-16", type: http, server: 103.84.37.72, port: 22622 }
  - { name: "HTTP-17", type: http, server: 103.84.36.237, port: 22622 }
  
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
    strategy: round-robin
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
