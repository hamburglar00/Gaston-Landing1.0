export default async function handler(req, res) {
  try {
    const API_URL = "https://script.google.com/macros/s/AKfycby1lTYqdlT4d3mILPMcnXoyPa1R3o74cqrkNSNqSkHTyMz9LV4IrMWZV38a9Hp0vxh0BQ/exec";

    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0"
      }
    });

    // Evita cache en Vercel
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    res.setHeader("Surrogate-Control", "no-store");

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const list = data.numbers || [];

    if (!list.length) {
      return res.status(200).json({
        number: "5493512593353",
        name: "Soporte"
      });
    }

    const random = list[Math.floor(Math.random() * list.length)];

    return res.status(200).json({
      number: String(random.number),
      name: random.name || "Soporte"
    });

  } catch (e) {
    console.error("Error:", e);
    
    return res.status(200).json({
      number: "5493512593353",
      name: "Soporte"
    });
  }
}
