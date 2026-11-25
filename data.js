/* ===== EDIT ME: all site content, prices and settings live here ===== */
window.SITE = {
  brand: "jr_photography",
  tagline: "Capturing places, moments and perspectives.",
  currency: "£",
  email: "joelotography@gmail.com",            // e.g. "hello@yourdomain.com" (used for the contact-form fallback)
  formEndpoint: "https://formspree.io/f/xvkalvvg",     // e.g. a Formspree URL: https://formspree.io/f/xxxxxx
  checkoutEndpoint: "/.netlify/functions/checkout", // your Stripe Checkout function URL (see README.md)
  portrait: "",         // e.g. "images/me.jpg" to show a photo of yourself on the About page
  social: { Instagram: "https://instagram.com/jr_photography.1", Facebook:"https://facebook.com/jrphotography.1" , X: "", TikTok: "https://tiktok.com/@jrudd37" }, // paste full profile URLs
  sizes: [
    { id: "6x4", name: "6 × 4 in", price: 12 }, { id: "7x5", name: "7 × 5 in", price: 15 },
    { id: "8x6", name: "8 × 6 in", price: 18 }, { id: "10x8", name: "10 × 8 in", price: 25 },
    { id: "12x8", name: "12 × 8 in", price: 32 }, { id: "12x12", name: "12 × 12 in", price: 35 },
    { id: "16x12", name: "16 × 12 in", price: 45 }, { id: "18x12", name: "18 × 12 in", price: 55 },
    { id: "20x16", name: "20 × 16 in", price: 65 }, { id: "a4", name: "A4", price: 30 },
    { id: "a3", name: "A3", price: 60 }, { id: "a2", name: "A2", price: 90 }, { id: "a1", name: "A1", price: 140 }
  ],
  finishes: [ // "extra" is added per print. The fine-art extra is a placeholder: set your own.
    { id: "matte", name: "Matte", extra: 0 }, { id: "gloss", name: "Gloss", extra: 0 },
    { id: "fineart", name: "Premium fine-art paper", extra: 10 }
  ],
  categories: ["Urban Photography", "Architecture", "Newcastle & Gateshead", "Landscapes", "Nature", "Black & White", "Night Photography"],
  collections: [
    { id: "newcastle", name: "Newcastle & Gateshead" }, { id: "bridges", name: "Bridges & Architecture" },
    { id: "scottish", name: "Scottish Landscapes" }, { id: "nature", name: "Nature & Woodland" },
    { id: "bw", name: "Black & White Street Photography" }, { id: "night", name: "Night Photography" }
  ],
  // hero: true puts the photo in the home-page slideshow. Locations in descriptions are best guesses: edit them.
  photos: [
    { id: "quayside-approach", src: "images/15219.jpg", title: "Quayside Approach",
      desc: "The Tyne Bridge rising above the old streets, with traffic blurred in a long exposure.",
      categories: ["Urban Photography", "Architecture", "Newcastle & Gateshead", "Black & White"], collections: ["newcastle", "bridges", "bw"] },
    { id: "street-corner", src: "images/15218.jpg", title: "Street Corner, Tyne Bridge",
      desc: "Two passers-by pause on a Quayside corner while a bus blurs past beneath the bridge.",
      categories: ["Urban Photography", "Architecture", "Newcastle & Gateshead", "Black & White"], collections: ["newcastle", "bridges", "bw"] },
    { id: "under-the-bridge", src: "images/15221.jpg", title: "Under the Bridge",
      desc: "A taxi streaks past below the bridge deck, framing a Victorian corner building.",
      categories: ["Urban Photography", "Architecture", "Newcastle & Gateshead", "Black & White"], collections: ["newcastle", "bridges", "bw"] },
    { id: "quayside-motion", src: "images/15226.jpg", title: "Quayside Motion", hero: true,
      desc: "Walkers dissolve into long-exposure ghosts, with the Millennium Bridge arcing behind.",
      categories: ["Urban Photography", "Architecture", "Newcastle & Gateshead", "Black & White"], collections: ["newcastle", "bridges", "bw"] },
    { id: "arch-and-storm-light", src: "images/21355.jpg", title: "Arch and Storm Light",
      desc: "The Millennium Bridge arch cutting through a moody evening sky above the Quayside.",
      categories: ["Urban Photography", "Architecture", "Newcastle & Gateshead"], collections: ["newcastle", "bridges"] },
    { id: "highland-glen", src: "images/935.jpg", title: "Highland Glen", hero: true,
      desc: "Bracken and open moor leading the eye towards a peak in the Scottish Highlands.",
      categories: ["Landscapes", "Nature"], collections: ["scottish", "nature"] },
    { id: "river-through-the-pines", src: "images/940.jpg", title: "River Through the Pines", hero: true,
      desc: "A fast Highland river tumbling between conifers and broadleaf woodland.",
      categories: ["Landscapes", "Nature"], collections: ["scottish", "nature"] },
    { id: "stone-arch", src: "images/1053.jpg", title: "Stone Arch, Soft Water", hero: true,
      desc: "A long exposure turns the river to silk beneath an old stone bridge.",
      categories: ["Landscapes", "Nature", "Architecture"], collections: ["scottish", "nature", "bridges"] }
  ]
};
