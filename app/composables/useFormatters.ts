export const useFormatters = () => {
  const formatEUR = (n: number) => "€" + Math.round(n).toLocaleString("en-GB");

  const formatRs = (n: number) => "Rs " + Math.round(n).toLocaleString("en-GB");

  const formatUSD = (n: number) => "$" + Math.round(n).toLocaleString("en-GB");

  const formatMonth = (date: Date) => {
    return date.toLocaleString("en-GB", { month: "short", year: "numeric" });
  };

  const formatRate = (n: number) => n.toFixed(2);

  return { formatEUR, formatRs, formatUSD, formatMonth, formatRate };
};
