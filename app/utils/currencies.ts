import type { Currency } from "~/types/settings";

export const CURRENCIES: Currency[] = [
  // Major / Europe
  { code: "EUR", name: "Euro", symbol: "€", locale: "de-DE" },
  { code: "USD", name: "US Dollar", symbol: "$", locale: "en-US" },
  { code: "GBP", name: "British Pound", symbol: "£", locale: "en-GB" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr", locale: "de-CH" },
  { code: "DKK", name: "Danish Krone", symbol: "kr", locale: "da-DK" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", locale: "sv-SE" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", locale: "nb-NO" },
  { code: "PLN", name: "Polish Złoty", symbol: "zł", locale: "pl-PL" },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč", locale: "cs-CZ" },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft", locale: "hu-HU" },
  { code: "RON", name: "Romanian Leu", symbol: "lei", locale: "ro-RO" },
  { code: "HRK", name: "Croatian Kuna", symbol: "kn", locale: "hr-HR" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺", locale: "tr-TR" },
  { code: "ILS", name: "Israeli Shekel", symbol: "₪", locale: "he-IL" },
  { code: "GEL", name: "Georgian Lari", symbol: "₾", locale: "ka-GE" },

  // Americas
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", locale: "en-CA" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", locale: "en-AU" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", locale: "en-NZ" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", locale: "pt-BR" },
  { code: "MXN", name: "Mexican Peso", symbol: "$", locale: "es-MX" },
  { code: "COP", name: "Colombian Peso", symbol: "$", locale: "es-CO" },
  { code: "CLP", name: "Chilean Peso", symbol: "$", locale: "es-CL" },
  { code: "PEN", name: "Peruvian Sol", symbol: "S/", locale: "es-PE" },
  { code: "ARS", name: "Argentine Peso", symbol: "$", locale: "es-AR" },
  { code: "UYU", name: "Uruguayan Peso", symbol: "$U", locale: "es-UY" },
  { code: "CRC", name: "Costa Rican Colón", symbol: "₡", locale: "es-CR" },
  { code: "PAB", name: "Panamanian Balboa", symbol: "B/.", locale: "es-PA" },
  { code: "BZD", name: "Belize Dollar", symbol: "BZ$", locale: "en-BZ" },

  // Asia — East & South-East
  { code: "JPY", name: "Japanese Yen", symbol: "¥", locale: "ja-JP" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", locale: "zh-CN" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", locale: "zh-HK" },
  { code: "TWD", name: "Taiwan Dollar", symbol: "NT$", locale: "zh-TW" },
  { code: "KRW", name: "South Korean Won", symbol: "₩", locale: "ko-KR" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", locale: "en-SG" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", locale: "ms-MY" },
  { code: "THB", name: "Thai Baht", symbol: "฿", locale: "th-TH" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", locale: "id-ID" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱", locale: "en-PH" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫", locale: "vi-VN" },
  { code: "KHR", name: "Cambodian Riel", symbol: "៛", locale: "km-KH" },

  // Asia — South
  { code: "INR", name: "Indian Rupee", symbol: "₹", locale: "en-IN" },
  { code: "LKR", name: "Sri Lankan Rupee", symbol: "Rs", locale: "si-LK" },

  // Middle East
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", locale: "ar-AE" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", locale: "ar-SA" },
  { code: "QAR", name: "Qatari Riyal", symbol: "ر.ق", locale: "ar-QA" },
  { code: "BHD", name: "Bahraini Dinar", symbol: ".د.ب", locale: "ar-BH" },
  { code: "OMR", name: "Omani Rial", symbol: "ر.ع.", locale: "ar-OM" },
  { code: "JOD", name: "Jordanian Dinar", symbol: "JD", locale: "ar-JO" },

  // Africa
  { code: "MUR", name: "Mauritian Rupee", symbol: "Rs", locale: "en-MU" },
  { code: "ZAR", name: "South African Rand", symbol: "R", locale: "en-ZA" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", locale: "sw-KE" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵", locale: "en-GH" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", locale: "en-NG" },
  { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh", locale: "sw-TZ" },
  { code: "UGX", name: "Ugandan Shilling", symbol: "USh", locale: "sw-UG" },
  { code: "MAD", name: "Moroccan Dirham", symbol: "MAD", locale: "ar-MA" },
  { code: "EGP", name: "Egyptian Pound", symbol: "E£", locale: "ar-EG" },
  { code: "TND", name: "Tunisian Dinar", symbol: "د.ت", locale: "ar-TN" },
  { code: "ETB", name: "Ethiopian Birr", symbol: "Br", locale: "am-ET" },
  { code: "RWF", name: "Rwandan Franc", symbol: "Fr", locale: "rw-RW" },
  {
    code: "XOF",
    name: "West African CFA Franc",
    symbol: "Fr",
    locale: "fr-SN",
  },

  // Oceania
  { code: "FJD", name: "Fijian Dollar", symbol: "FJ$", locale: "en-FJ" },
];

export const getCurrency = (code: string): Currency =>
  CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0]!;
