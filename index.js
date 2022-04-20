
async function handleRequest(req, url) {
  const res = await fetch(req);
  const contentType = res.headers.get('Content-Type');
  const originUrl = new URL(url);
  const urlWithoutParameters = originUrl.origin + originUrl.pathname;
  let kv_value = await hreflang.get(urlWithoutParameters);
  if (!kv_value) return res;

  if (contentType.startsWith('text/html')) {
    return new HTMLRewriter().on("head", new ElementHandler(kv_value)).transform(res)
  } else {
    return res;
  }
}

class ElementHandler {
  constructor(kv_value) {
    this.kv_value = kv_value.split('\n');
  }
  element(element) {
    for (let hf in this.kv_value) {
      console.log(this.kv_value[hf])
      element.prepend(this.kv_value[hf], { html: true });
    }
  }
}

addEventListener('fetch', (e) => {
  e.respondWith(handleRequest(e.request, e.request.url))
})
