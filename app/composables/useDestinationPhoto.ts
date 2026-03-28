// Converts an image URL to base64 via canvas — works in browser
async function urlToBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
export const useDestinationPhoto = () => {
  const config = useRuntimeConfig();

  // Returns a direct image URL — for use in <img> tags
  async function fetchPhotoUrl(countryName: string): Promise<string | null> {
    try {
      const accessKey = config.public.unsplashAccessKey;
      if (accessKey) {
        const query = encodeURIComponent(`${countryName} landscape travel`);
        const res = await fetch(
          `https://api.unsplash.com/photos/random?query=${query}&orientation=landscape&content_filter=high`,
          { headers: { Authorization: `Client-ID ${accessKey}` } },
        );
        if (!res.ok) new Error(`Unsplash ${res.status}`);
        const data = await res.json();
        return data.urls?.regular ?? null;
      }
      // Fallback — picsum with country seed for consistency
      return `https://picsum.photos/seed/${encodeURIComponent(countryName)}/1200/400`;
    } catch (err) {
      console.warn("[useDestinationPhoto] fetchPhotoUrl failed:", err);
      return null;
    }
  }

  // Returns base64 — for jsPDF embedding
  async function fetchPhoto(countryName: string): Promise<string | null> {
    try {
      const accessKey = config.public.unsplashAccessKey;
      let imageUrl: string | null = null;

      if (accessKey) {
        const query = encodeURIComponent(`${countryName} landscape travel`);
        const res = await fetch(
          `https://api.unsplash.com/photos/random?query=${query}&orientation=landscape&content_filter=high`,
          { headers: { Authorization: `Client-ID ${accessKey}` } },
        );
        if (!res.ok) new Error(`Unsplash ${res.status}`);
        const data = await res.json();
        imageUrl = data.urls?.small ?? null;
      } else {
        imageUrl = `https://picsum.photos/seed/${encodeURIComponent(countryName)}/800/300`;
      }

      if (!imageUrl) return null;
      return await urlToBase64(imageUrl);
    } catch (err) {
      console.warn("[useDestinationPhoto] fetchPhoto failed:", err);
      return null;
    }
  }

  return { fetchPhoto, fetchPhotoUrl };
};
