export const useGroceryFormatters = () => {
  const fmtMur = (n: number) =>
    "Rs\u00a0" + Math.round(n).toLocaleString("en-GB");

  const fmtEur = (n: number) =>
    "€" +
    (Math.round(n * 10) / 10).toLocaleString("en-GB", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    });

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return { fmtMur, fmtEur, fmtDate };
};
