module.exports = async (req, res) => {
  try {
    const API_URL = "https://script.google.com/macros/s/AKfycby1lTYqdlT4d3mILPMcnXoyPa1R3o74cqrkNSNqSkHTyMz9LV4IrMWZV38a9Hp0vxh0BQ/exec";

    const response = await fetch(API_URL, {
      headers: { "Cache-Control": "no-store" },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const raw = await response.text();

    // Forzar JSON correcto
    let data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      console.error("❌ JSON inválido:", raw);
      throw err;
    }

    // Asegurar que "numbers" sea array real
    let list = [];

    if (Array.isArray(data)) {
      list = data;
    } else if (typeof data.numbers === "string") {
      // 🔥 FIX DEL BUG
      list = JSON.parse(data.numbers);
    } else if (Array.isArray(data.numbers)) {
      list = data.numbers;
    }

    // Filtrar y normalizar
    list = list
      .filter(it => it.number)
      .map(it => ({
        number: String(it.number).replace("+", "").trim(),
        name: it.name || "Soporte",
        weight: it.weight || 1,
      }));

    if (!list.length) {
      return res.status(200).json({
        number: "5493512593353",
        name: "Fallback",
      });
    }

    // Random REAL
    const elegido = list[Math.floor(Math.random() * list.length)];

    return res.status(200).json(elegido);

  } catch (err) {
    console.error("❌ Error /api/get-random-phone:", err);

    return res.status(200).json({
      number: "5493512593353",
      name: "Fallback",
    });
  }
};
