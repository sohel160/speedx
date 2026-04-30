export default {
  async fetch(request) {

    const url = new URL(request.url)

    if (url.searchParams.get("token") !== "abc123") {
      return new Response("Forbidden", { status: 403 })
    }

    const ua = request.headers.get("User-Agent") || ""

    const allowedUA = [
      "Clash",
      "Meta",
      "FiClash",
      "Stash",
      "okhttp"
    ]

    let allowed = false

    for (const a of allowedUA) {
      if (ua.includes(a)) {
        allowed = true
        break
      }
    }

    if (!allowed) {
      return new Response("404", { status: 404 })
    }

    const config = `
proxy-providers:
  myprovider:
    type: http
    url: "https://secured.darkblazespuky.workers.dev/?token=abc123"
    interval: 3600
    path: ./proxies.yaml
    health-check:
      enable: true
      url: http://www.gstatic.com/generate_204
      interval: 10

proxy-groups:

  - name: ALL
    type: select
    proxies:
    use:
      - myprovider

  - name: "LOAD-BALANCE"
    type: load-balance
    strategy: round-robin
    interval: 10
    use:
      - myprovider

  - name: "BOOM🔥"
    type: select
    proxies:
      - LOAD-BALANCE
      - ALL

rules:
  - MATCH,BOOM🔥
`

    return new Response(config, {
      headers: { "Content-Type": "text/plain" }
    })

  }
}
