import jsPDF from "jspdf";

export const useExportPDF = () => {
  const store = useBudgetStore();
  const settings = useSettingsStore();
  const { formatEUR, formatMonth } = useFormatters();
  const { fetchPhoto } = useDestinationPhoto();

  async function exportPDF() {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const pageW = 210;
    const pageH = 297;
    const marginL = 18;
    const marginR = 18;
    const contentW = pageW - marginL - marginR;
    let y = 0;

    const c = {
      primary: [15, 158, 117] as [number, number, number],
      primaryDark: [10, 110, 82] as [number, number, number],
      primaryMid: [12, 134, 100] as [number, number, number],
      primaryPale: [178, 236, 218] as [number, number, number],
      dark: [17, 24, 39] as [number, number, number],
      mid: [55, 65, 81] as [number, number, number],
      muted: [107, 114, 128] as [number, number, number],
      light: [243, 244, 246] as [number, number, number],
      lightMid: [229, 231, 235] as [number, number, number],
      white: [255, 255, 255] as [number, number, number],
      positive: [15, 118, 110] as [number, number, number],
      negative: [185, 28, 28] as [number, number, number],
      accentBg: [240, 253, 248] as [number, number, number],
    };

    function setFont(
      size: number,
      style: "normal" | "bold" = "normal",
      color: [number, number, number] = c.dark,
    ) {
      doc.setFontSize(size);
      doc.setFont("helvetica", style);
      doc.setTextColor(...color);
    }

    function addPage() {
      doc.addPage();
      y = 20;
    }

    function checkPageBreak(needed: number) {
      if (y + needed > pageH - 20) addPage();
    }

    function hLine(
      yPos: number,
      x1 = marginL,
      x2 = pageW - marginR,
      color = c.lightMid,
      width = 0.3,
    ) {
      doc.setDrawColor(...color);
      doc.setLineWidth(width);
      doc.line(x1, yPos, x2, yPos);
    }

    function sectionCard(title: string) {
      checkPageBreak(14);
      doc.setFillColor(...c.accentBg);
      doc.rect(marginL, y, contentW, 9, "F");
      doc.setFillColor(...c.primary);
      doc.rect(marginL, y, 3, 9, "F");
      setFont(8.5, "bold", c.primary);
      doc.text(title.toUpperCase(), marginL + 7, y + 6.2);
      hLine(y + 9, marginL, pageW - marginR, c.primaryPale, 0.5);
      y += 13;
    }

    function dataRow(
      label: string,
      value: string,
      tone: "normal" | "positive" | "negative" = "normal",
      bold = false,
      bgShade = false,
    ) {
      checkPageBreak(7);
      if (bgShade) {
        doc.setFillColor(...c.light);
        doc.rect(marginL, y - 0.5, contentW, 6.5, "F");
      }
      setFont(8, bold ? "bold" : "normal", bold ? c.mid : c.muted);
      doc.text(label, marginL + 2, y + 4);
      const valueColor =
        tone === "positive"
          ? c.positive
          : tone === "negative"
            ? c.negative
            : bold
              ? c.dark
              : c.mid;
      setFont(8, bold ? "bold" : "normal", valueColor);
      doc.text(value, pageW - marginR - 2, y + 4, { align: "right" });
      y += 6.5;
    }

    function totalRow(
      label: string,
      value: string,
      tone: "positive" | "negative" | "normal" = "normal",
    ) {
      checkPageBreak(9);
      doc.setFillColor(...c.accentBg);
      doc.rect(marginL, y - 0.5, contentW, 8, "F");
      hLine(y - 0.5, marginL, pageW - marginR, c.primaryPale, 0.4);
      setFont(8.5, "bold", c.mid);
      doc.text(label, marginL + 2, y + 5);
      const valueColor =
        tone === "positive"
          ? c.positive
          : tone === "negative"
            ? c.negative
            : c.dark;
      setFont(8.5, "bold", valueColor);
      doc.text(value, pageW - marginR - 2, y + 5, { align: "right" });
      y += 9;
    }

    function metricBox(
      x: number,
      w: number,
      label: string,
      value: string,
      highlight = false,
    ) {
      const bw = w - 3;
      const bh = 20;
      if (highlight) {
        doc.setFillColor(...c.primary);
        doc.roundedRect(x, y, bw, bh, 2, 2, "F");
        doc.setFillColor(...c.primaryMid);
        doc.roundedRect(x, y, bw, 7, 2, 2, "F");
        doc.rect(x, y + 4, bw, 3, "F");
        setFont(6.5, "bold", c.primaryPale);
        doc.text(label.toUpperCase(), x + 4, y + 5);
        setFont(12, "bold", c.white);
        doc.text(value, x + 4, y + 15.5);
      } else {
        doc.setFillColor(...c.light);
        doc.roundedRect(x, y, bw, bh, 2, 2, "F");
        doc.setFillColor(...c.lightMid);
        doc.roundedRect(x, y, bw, 7, 2, 2, "F");
        doc.rect(x, y + 4, bw, 3, "F");
        setFont(6.5, "bold", c.muted);
        doc.text(label.toUpperCase(), x + 4, y + 5);
        setFont(11, "bold", c.dark);
        doc.text(value, x + 4, y + 15.5);
      }
    }

    const exportDate = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const planName = String(settings.plannerName ?? "");
    const originName = settings.originCountry?.name ?? "";
    const destName = settings.destCountry?.name ?? "";
    const headerH = 38;

    // ── Fetch destination photo ────────────────────────────
    const photoBase64 = destName ? await fetchPhoto(destName) : null;

    // ── Header ─────────────────────────────────────────────
    if (photoBase64) {
      // Photo fills the full header band
      doc.addImage(photoBase64, "JPEG", 0, 0, pageW, headerH, "", "FAST");

      // Dark gradient overlay — left two thirds darker for text readability
      doc.setFillColor(...c.primaryDark);
      doc.setGState(new (doc as any).GState({ opacity: 0.72 }));
      doc.rect(0, 0, pageW, headerH, "F");
      doc.setGState(new (doc as any).GState({ opacity: 1 }));
    } else {
      // Fallback — solid two-tone geometric header (no photo)
      doc.setFillColor(...c.primaryDark);
      doc.rect(0, 0, pageW, headerH, "F");
      doc.setFillColor(...c.primary);
      doc.triangle(pageW * 0.52, 0, pageW, 0, pageW, headerH, "F");
      doc.setFillColor(...c.primaryMid);
      doc.circle(pageW - 8, -4, 18, "F");
      doc.setFillColor(...c.primaryDark);
      doc.circle(pageW - 8, -4, 12, "F");
    }

    // App name
    setFont(16, "bold", c.white);
    doc.text("Meridian", marginL, 13);

    // Tagline
    setFont(7.5, "normal", c.primaryPale);
    doc.text("Relocation Budget Planner", marginL, 20);

    // Plan name
    if (planName) {
      setFont(8, "bold", c.white);
      doc.text(planName, marginL, 28);
    }

    // Route — right
    if (originName && destName) {
      setFont(8, "bold", c.white);
      doc.text(`${originName}  ->  ${destName}`, pageW - marginR, 13, {
        align: "right",
      });
    }

    // Date — right below route
    setFont(7, "normal", c.primaryPale);
    doc.text(`Exported ${exportDate}`, pageW - marginR, 20, { align: "right" });

    // Photo credit — bottom right of header in tiny text if photo was used
    if (photoBase64) {
      setFont(5.5, "normal", [255, 255, 255]);
      doc.setTextColor(255, 255, 255);
      doc.setGState(new (doc as any).GState({ opacity: 0.6 }));
      doc.text("Photo: Unsplash", pageW - marginR, headerH - 2.5, {
        align: "right",
      });
      doc.setGState(new (doc as any).GState({ opacity: 1 }));
    }

    y = headerH + 8;

    // ── Summary metrics ────────────────────────────────────
    const colW = contentW / 4;
    const metricLabels = [
      "Monthly savings",
      "Total needed",
      "Months to target",
      "Ready by",
    ];
    const metricValues = [
      formatEUR(store.adjustedMonthlySavings),
      formatEUR(store.grandTotal),
      store.monthsToTarget?.toString() ?? "--",
      store.readyDate ? formatMonth(store.readyDate) : "--",
    ];
    metricLabels.forEach((label, i) => {
      metricBox(
        marginL + i * colW,
        colW,
        label,
        metricValues[i] ?? "--",
        i === 3,
      );
    });
    y += 26;

    hLine(y, marginL, pageW - marginR, c.primary, 0.5);
    y += 8;

    // ── Income ─────────────────────────────────────────────
    sectionCard("Income");
    dataRow("Your income", formatEUR(store.incomeYou));
    dataRow(
      "Partner's income",
      formatEUR(store.incomePartner),
      "normal",
      false,
      true,
    );
    totalRow("Total combined", formatEUR(store.totalIncome), "positive");
    y += 3;

    // ── Visa transfer ──────────────────────────────────────
    sectionCard("Visa transfer requirement");
    dataRow(
      "Monthly transfer",
      `$${store.transferUSD.toLocaleString("en-GB")}`,
    );
    dataRow(
      "EUR/USD rate",
      settings.originToUsdRate.toFixed(4),
      "normal",
      false,
      true,
    );
    dataRow(
      `${settings.destCurrencyCode} per EUR`,
      settings.destUnitsPerOrigin.toFixed(2),
    );
    totalRow("Transfer in euros", `approx. ${formatEUR(store.transferEUR)}`);
    y += 3;

    // ── Destination expenses ───────────────────────────────
    sectionCard("Destination living expenses");
    const destCode = settings.destCurrencyCode;
    dataRow(
      "Rent",
      `${destCode} ${Math.round(store.rent).toLocaleString("en-GB")}`,
    );
    dataRow(
      "Electricity",
      `${destCode} ${Math.round(store.electricity).toLocaleString("en-GB")}`,
      "normal",
      false,
      true,
    );
    dataRow("Internet", formatEUR(store.internet));
    dataRow(
      "Mobile phones (2x)",
      formatEUR(store.mobilePhones),
      "normal",
      false,
      true,
    );
    dataRow("Groceries", formatEUR(store.groceries));
    dataRow("Dining out", formatEUR(store.diningOut), "normal", false, true);
    dataRow("Transport", formatEUR(store.transport));
    dataRow(
      "Pet (food + vet)",
      formatEUR(store.petMonthly),
      "normal",
      false,
      true,
    );
    dataRow("Personal care + household", formatEUR(store.personalCare));
    dataRow(
      "Leisure + buffer",
      formatEUR(store.leisureBuffer),
      "normal",
      false,
      true,
    );
    totalRow(
      "Total destination expenses",
      `-${formatEUR(store.totalDestExpenses)}`,
      "negative",
    );
    totalRow(
      "Transfer surplus",
      `${store.transferSurplus >= 0 ? "+" : ""}${formatEUR(store.transferSurplus)}/mo`,
      store.transferSurplus >= 0 ? "positive" : "negative",
    );
    y += 3;

    // ── Home expenses ──────────────────────────────────────
    if (pageH - y < 70) addPage();
    sectionCard("Home country expenses");
    dataRow("Health insurance", formatEUR(store.healthInsurance));
    dataRow(
      `Return flights (${store.tripsYouPerYear}x/yr, ${formatEUR(store.flightPriceYou)}/person)`,
      `-${formatEUR(store.flightsYouMonthly)}/mo`,
      "negative",
      false,
      true,
    );
    dataRow(
      `Visitor flights (${store.numDependants} people, ${store.tripsVisitorsPerYear}x/yr)`,
      `-${formatEUR(store.flightsVisitorsMonthly)}/mo`,
      "negative",
    );
    totalRow(
      "Total home deductions/mo",
      `-${formatEUR(store.totalHomeDeductions)}`,
      "negative",
    );
    y += 3;

    // ── Optional expenses ──────────────────────────────────
    const activeOptionals = Object.values(store.optionalExpenses).filter(
      (e) => e.enabled,
    );
    if (activeOptionals.length > 0) {
      if (pageH - y < 60) addPage();
      sectionCard("Optional expenses (active)");
      activeOptionals.forEach((e, i) => {
        dataRow(
          e.label,
          `-${formatEUR(e.value)}/mo`,
          "negative",
          false,
          i % 2 === 1,
        );
      });
      totalRow(
        "Total optional/mo",
        `-${formatEUR(store.totalOptionalActive)}`,
        "negative",
      );
      y += 3;
    }

    // ── Purchase target ────────────────────────────────────
    if (pageH - y < 55) addPage();
    sectionCard("Purchase target");
    dataRow("Target property price", formatEUR(store.propertyPrice));
    dataRow(
      `Acquisition fees (${settings.acquisitionFeePercent}%)`,
      formatEUR(store.purchaseFees),
      "normal",
      false,
      true,
    );
    dataRow("One-time relocation costs", formatEUR(store.relocationCosts));
    dataRow(
      "Existing savings",
      formatEUR(store.existingSavings),
      "positive",
      false,
      true,
    );
    totalRow("Grand total needed", formatEUR(store.grandTotal));
    y += 3;

    // ── Savings breakdown ──────────────────────────────────
    if (pageH - y < 60) addPage();
    sectionCard("Monthly savings breakdown");
    dataRow("Combined income", formatEUR(store.totalIncome), "positive");
    dataRow(
      "Visa transfer",
      `-${formatEUR(store.transferEUR)}`,
      "negative",
      false,
      true,
    );
    dataRow(
      "Health insurance",
      `-${formatEUR(store.healthInsurance)}`,
      "negative",
    );
    dataRow(
      "Flights (amortised)",
      `-${formatEUR(store.totalFlightsMonthly)}`,
      "negative",
      false,
      true,
    );
    if (store.totalOptionalActive > 0) {
      dataRow(
        "Optional expenses",
        `-${formatEUR(store.totalOptionalActive)}`,
        "negative",
      );
    }
    totalRow(
      "Net monthly savings",
      formatEUR(store.adjustedMonthlySavings),
      store.adjustedMonthlySavings > 0 ? "positive" : "negative",
    );
    y += 3;

    // ── Scenarios ──────────────────────────────────────────
    if (pageH - y < 50) addPage();
    sectionCard("Three scenarios");
    store.scenarios.forEach((s, i) => {
      dataRow(
        `${s.label}  (${formatEUR(s.rate)}/mo)`,
        s.months
          ? `${s.months} months  ->  ${s.date ? formatMonth(s.date) : "--"}`
          : "--",
        s.isBase ? "positive" : "normal",
        s.isBase,
        i % 2 === 1,
      );
    });
    y += 3;

    // ── Milestones ─────────────────────────────────────────
    if (pageH - y < 55) addPage();
    sectionCard("Milestones");
    store.milestones.forEach((m, i) => {
      if (m.label === "Target reached") {
        totalRow(m.label, m.date ? formatMonth(m.date) : "--", "positive");
      } else {
        dataRow(
          m.label,
          m.date ? formatMonth(m.date) : "--",
          "normal",
          false,
          i % 2 === 1,
        );
      }
    });
    y += 8;

    // ── Footer on every page ───────────────────────────────
    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setFillColor(...c.light);
      doc.rect(0, pageH - 14, pageW, 14, "F");
      hLine(pageH - 14, 0, pageW, c.lightMid, 0.3);
      setFont(6.5, "normal", c.muted);
      doc.text("Meridian -- Relocation Budget Planner", marginL, pageH - 6);
      doc.text(`Page ${p} of ${totalPages}`, pageW - marginR, pageH - 6, {
        align: "right",
      });
      setFont(6.5, "bold", c.primary);
      doc.text(exportDate, pageW / 2, pageH - 6, { align: "center" });
    }

    // ── Save ───────────────────────────────────────────────
    const slug = planName
      ? planName
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
      : "budget";
    doc.save(`meridian-${slug}-${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  return { exportPDF };
};
