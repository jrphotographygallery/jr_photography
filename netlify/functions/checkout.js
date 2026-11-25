// Creates a Stripe Checkout session. Prices come from data.js on the SERVER, never from the browser.
global.window = {};
require("../../data.js");
const S = window.SITE;

const SHIPPING_PENCE = 395; // PLACEHOLDER flat UK delivery charge in pence. Set your real rate (0 = free).

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "" };
  try {
    const { items } = JSON.parse(event.body);
    if (!Array.isArray(items) || !items.length) throw new Error("empty basket");
    const p = new URLSearchParams();
    p.append("mode", "payment");
    p.append("success_url", process.env.URL + "/#home");
    p.append("cancel_url", process.env.URL + "/#prints");
    p.append("shipping_address_collection[allowed_countries][0]", "GB");
    p.append("shipping_options[0][shipping_rate_data][type]", "fixed_amount");
    p.append("shipping_options[0][shipping_rate_data][display_name]", "UK delivery");
    p.append("shipping_options[0][shipping_rate_data][fixed_amount][amount]", String(SHIPPING_PENCE));
    p.append("shipping_options[0][shipping_rate_data][fixed_amount][currency]", "gbp");
    items.forEach((it, i) => {
      const photo = S.photos.find(x => x.id === it.id), size = S.sizes.find(x => x.id === it.size), fin = S.finishes.find(x => x.id === it.finish);
      if (!photo || !size || !fin) throw new Error("unknown item");
      const qty = Math.max(1, Math.min(50, parseInt(it.qty, 10) || 1));
      p.append(`line_items[${i}][quantity]`, String(qty));
      p.append(`line_items[${i}][price_data][currency]`, "gbp");
      p.append(`line_items[${i}][price_data][unit_amount]`, String(Math.round((size.price + fin.extra) * 100)));
      p.append(`line_items[${i}][price_data][product_data][name]`, `${photo.title} print, ${size.name}, ${fin.name}`);
    });
    const r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { Authorization: "Bearer " + process.env.STRIPE_SECRET_KEY, "Content-Type": "application/x-www-form-urlencoded" },
      body: p
    });
    const d = await r.json();
    if (!d.url) throw new Error(JSON.stringify(d.error || d));
    return { statusCode: 200, body: JSON.stringify({ url: d.url }) };
  } catch (e) {
    console.error(e);
    return { statusCode: 400, body: JSON.stringify({ error: "checkout failed" }) };
  }
};
