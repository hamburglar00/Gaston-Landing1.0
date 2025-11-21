module.exports = async (req, res) => {

  // ⛔ Desactivar cache de Vercel (OBLIGATORIO)
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  try {

    const API_URL = "https://script.google.com/macros/s/AKfycby1lTYqdlT4d3mILPMcnXoyPa1R3o74cqrkNSNqSkHTyMz9LV4IrMWZV38a9Hp0vxh0BQ/exec";

    const response = await fetch(API_URL, { 
      headers: { "Cache-Control": "no-store" }
    });

    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }

    const data = await response.json();

    // Normaliza
    let list = [];
    if (Array.isArray(data)) list = data;
    else if (Array.isArray(data.numbers)) list = data.numbers;
    else if (data.number) list = [data];

    list = list
      .filter(it => it.number)
      .map(it => ({
        number: String(it.number).replace("+", "").trim(),
        name: it.name || "Soporte",
        weight: 1
      }));

    // Fallback si sheet está vacío:
    if (!list.length) {
      return res.status(200).json({
        number: "5493512593353",
        name: "Soporte"
      });
    }

    // RANDOM REAL
    const elegido = list[Math.floor(Math.random() * list.length)];

    return res.status(200).json(elegido);

  } catch (err) {
    console.error("❌ Error en /api/get-random-phone:", err);
    return res.status(200).json({
      number: "5493512593353",
      name: "Soporte"
    });
  }
};
