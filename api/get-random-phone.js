module.exports = async (req, res) => {
  try {
    const API_URL = "https://script.google.com/macros/s/AKfycby1lTYqdlT4d3mILPMcnXoyPa1R3o74cqrkNSNqSkHTyMz9LV4IrMWZV38a9Hp0vxh0BQ/exec";

    const response = await fetch(API_URL, {
      headers: { "Cache-Control": "no-store" }
    });

    if (!response.ok) throw new Error("HTTP " + response.status);

    const data = await response.json();

    const list = Array.isArray(data.numbers) ? data.numbers : [];

    if (list.length === 0) {
      return res.status(200).json({
        number: "5493512593353",
        name: "Gaston"
      });
    }

    const elegido = list[Math.floor(Math.random() * list.length)];

    return res.status(200).json(elegido);

  } catch (e) {
    console.error("❌ Error:", e);
    return res.status(200).json({
      number: "5493512593353",
      name: "Gaston"
    });
  }
};
