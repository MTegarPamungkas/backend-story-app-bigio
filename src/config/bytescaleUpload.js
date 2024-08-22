const fetch = require("node-fetch");

async function uploadToBytescale(params) {
  const baseUrl = "https://api.bytescale.com";
  const path = `/v2/accounts/${params.accountId}/uploads/binary`;
  const entries = (obj) =>
    Object.entries(obj).filter(([, val]) => (val ?? null) !== null);
  const query = entries(params.querystring ?? {})
    .flatMap(([k, v]) => (Array.isArray(v) ? v.map((v2) => [k, v2]) : [[k, v]]))
    .map((kv) => kv.join("="))
    .join("&");
  const response = await fetch(
    `${baseUrl}${path}${query.length > 0 ? "?" : ""}${query}`,
    {
      method: "POST",
      body: params.requestBody,
      headers: Object.fromEntries(
        entries({
          Authorization: `Bearer ${process.env.BYTESCALE_API_KEY}`,
          "X-Upload-Metadata": JSON.stringify(params.metadata),
          "Content-Type": "application/octet-stream",
        })
      ),
      duplex: "half",
    }
  );
  const result = await response.json();
  if (Math.floor(response.status / 100) !== 2) {
    throw new Error(`Bytescale API Error: ${JSON.stringify(result)}`);
  }
  return result;
}

module.exports = uploadToBytescale;
