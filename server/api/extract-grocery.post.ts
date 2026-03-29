import { Buffer } from "node:buffer";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiKey = config.anthropicApiKey;

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      message: "Anthropic API key not configured",
    });
  }

  console.log("Content-Type:", getHeader(event, "content-type"));

  const formData = await readFormData(event);

  console.log("FormData keys:", [...formData.keys()]);

  const file = formData.get("file") as File | null;

  console.log("File:", file?.name, file?.type, file?.size);

  if (!file || !file.type) {
    throw createError({
      statusCode: 400,
      message: `No file received. Keys found: ${[...formData.keys()].join(", ") || "none"}`,
    });
  }

  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const mediaType = file.type as
    | "application/pdf"
    | "image/jpeg"
    | "image/png"
    | "image/webp";

  if (!mediaType) {
    throw createError({
      statusCode: 400,
      message: "Could not determine file type",
    });
  }

  const isPDF = mediaType === "application/pdf";

  const fileContent = isPDF
    ? {
        type: "document",
        source: { type: "base64", media_type: mediaType, data: base64 },
      }
    : {
        type: "image",
        source: { type: "base64", media_type: mediaType, data: base64 },
      };

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: [
            fileContent,
            {
              type: "text",
              text: `Extract all product prices from this supermarket brochure.
Return ONLY a valid JSON array — no markdown, no backticks, no explanation.
Each object must have exactly these fields:
- "name": concise product name in English, max 60 chars
- "price": numeric sale/promotional price as a number (no currency symbol)
- "category": one of: Dairy & eggs, Meat & fish, Fruits & veg, Dry goods, Drinks, Cleaning, Personal care, Pet, Other
- "unit": size or unit description e.g. "1L", "500g", "pack of 6", "each"

Extract every product you can find. Always use the lowest/promotional price shown.`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw createError({
      statusCode: response.status,
      message: err?.error?.message ?? `Anthropic API error ${response.status}`,
    });
  }

  const data = await response.json();
  const raw = (data.content?.[0]?.text ?? "")
    .replace(/```json|```/g, "")
    .trim();

  let parsed: any[];
  try {
    parsed = JSON.parse(raw);
  } catch {
    const match = raw.match(/\[[\s\S]*\]/);
    if (!match) {
      throw createError({
        statusCode: 500,
        message: "Could not parse AI response",
      });
    }
    parsed = JSON.parse(match[0]);
  }

  if (!Array.isArray(parsed)) {
    throw createError({
      statusCode: 500,
      message: "Unexpected response format",
    });
  }

  return parsed.filter(
    (p: any) => p.name && typeof p.price === "number" && p.price > 0,
  );
});
