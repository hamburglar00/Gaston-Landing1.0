// /api/get-random-phone.js
module.exports = async (req, res) => {
  try {
    const API_URL = 'https://script.google.com/macros/s/AKfycbzlx6DBTwgv6MONL-25yfkQe8Bfou0RUTtA9aJ02EgAEu2K4AuNHCeLueBKXMsbofRLug/exec';

    const response = await fetch(API_URL, {
      headers: { 'Cache-Control': 'no-store' }
    });

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    const data = await response.json();

    // Normalizamos posibles formatos
    let list = [];
    if (Array.isArray(data)) {
      list = data;
    } else if (Array.isArray(data.numbers)) {
      list = data.numbers;
    } else if (Array.isArray(data.data)) {
      list = data.data;
    }

    // Filtramos solo "activos" y normalizamos campos
    list = list
      .filter(item => {
        const status = (item.status || item.estado || "").toString().toLowerCase();
        return status === "activo";
      })
      .map(item => {
        const rawNumber = String(
          item.number ||
          item.phone ||
          item.telefono ||
          ""
        ).trim();

        return {
          number: rawNumber,               // ej: "549351XXXXXXX"
          name: item.name || item.nombre || "Soporte",
        };
      })
      .filter(it => it.number && it.number.length >= 8);

    // Si no hay ninguno válido → fallback
    if (!list.length) {
      return res.status(200).json({
        number: "5493510000000",
        name: "Soporte",
      });
    }

    // Elegimos uno random del array activo
    const idx = Math.floor(Math.random() * list.length);
    const elegido = list[idx];

    return res.status(200).json(elegido);
  } catch (err) {
    console.error("❌ Error en /api/get-random-phone:", err);
    // Fallback duro por si todo falla
    return res.status(200).json({
      number: "5493512593353",
      name: "Soporte",
    });
  }
};
