export const useFormatters = () => {
  const formatEUR = (n: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(Math.round(n));

  const formatUSD = (n: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Math.round(n));

  const formatDestCurrency = (n: number, code = "") =>
    code
      ? new Intl.NumberFormat("en-GB", {
          style: "currency",
          currency: code,
          maximumFractionDigits: 0,
        }).format(Math.round(n))
      : new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(
          Math.round(n),
        );

  const formatCount = (n: number) =>
    new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(
      Math.round(n),
    );

  const formatRate = (n: number) =>
    new Intl.NumberFormat("en-GB", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(n);

  const formatMonth = (date: Date) =>
    date.toLocaleString("en-GB", { month: "short", year: "numeric" });

  return {
    formatEUR,
    formatUSD,
    formatDestCurrency,
    formatCount,
    formatRate,
    formatMonth,
  };
};
