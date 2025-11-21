// /api/get-random-phone.js
module.exports = async (req, res) => {
  try {
    const API_URL =
      "https://script.google.com/macros/s/AKfycbzlx6DBTwgv6MONL-25yfkQe8Bfou0RUTtA9aJ02EgAEu2K4AuNHCeLueBKXMsbofRLug/exec";

    const response = await fetch(API_URL, {
      headers: { "Cache-Control": "no-store" }
    });

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    const data = await response.json();

    // Normalizamos posibles formatos
    let list = [];
    if (Array.isArray(data)) list = data;
    else if (Array.isArray(data.numbers)) list = data.numbers;
    else if (Array.isArray(data.data)) list = data.data;

    // Filtrar activos y normalizar
    list = list
      .filter(item => {
        const status = (item.status || item.estado || "").toLowerCase();
        return status === "activo";
      })
      .map(item => ({
        number: String(
          item.number || item.phone || item.telefono || ""
        ).trim(),
        name: item.name || item.nombre || "Soporte"
      }))
      .filter(it => it.number && it.number.length >= 8);

    if (!list.length) {
      return res.status(200).json([
        { number: "5493510000000", name: "Soporte" }
      ]);
    }

    // Ahora devolvemos la LISTA ENTERA
    return res.status(200).json(list);
  } catch (err) {
    console.error("❌ Error en /api/get-random-phone:", err);

    return res.status(200).json([
      { number: "5493512593353", name: "Soporte" }
    ]);
  }
};
