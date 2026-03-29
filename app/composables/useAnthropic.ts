export const useAnthropic = () => {
  const hasApiKey = computed(() => {
    const config = useRuntimeConfig();
    return !!config.public.hasAnthropicKey;
  });

  async function compressFile(file: File): Promise<Blob> {
    // For PDFs, send as-is — Claude handles them natively
    if (file.type === "application/pdf") return file;

    // For images, compress to max 1600px and 0.85 quality
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const MAX = 1600;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          if (width > height) {
            height = Math.round((height * MAX) / width);
            width = MAX;
          } else {
            width = Math.round((width * MAX) / height);
            height = MAX;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not available"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (!blob) {
              reject(new Error("Compression failed"));
              return;
            }
            resolve(blob);
          },
          "image/jpeg",
          0.85,
        );
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  async function extractGroceryItems(file: File) {
    const isPDF = file.type === "application/pdf";
    const isImage = file.type.startsWith("image/");
    if (!isPDF && !isImage) {
      throw new Error("File must be a PDF or an image (JPG, PNG, WebP)");
    }

    // Warn early for large PDFs
    if (isPDF && file.size > 4 * 1024 * 1024) {
      throw new Error(
        "PDF is too large (max 4MB). Take a screenshot of each page and upload as an image instead.",
      );
    }

    const compressed = await compressFile(file);
    const formData = new FormData();
    formData.append("file", compressed, isPDF ? file.name : "image.jpg");

    const data = await $fetch<
      Array<{ name: string; price: number; category: string; unit: string }>
    >("/api/extract-grocery", { method: "POST", body: formData });

    if (!Array.isArray(data) || !data.length) {
      throw new Error("No items found in this file");
    }
    return data;
  }

  return { extractGroceryItems, hasApiKey };
};
