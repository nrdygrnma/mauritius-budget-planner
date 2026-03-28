import jsPDF from "jspdf";

export const useExportPDF = () => {
  const store = useBudgetStore();
  const settings = useSettingsStore();
  const { formatEUR, formatMonth, formatDestCurrency } = useFormatters();

  function exportPDF() {
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

    // ── Helpers ────────────────────────────────────────────
    const colors = {
      primary: [15, 158, 117] as [number, number, number],
      dark: [17, 24, 39] as [number, number, number],
      muted: [107, 114, 128] as [number, number, number],
      light: [243, 244, 246] as [number, number, number],
      white: [255, 255, 255] as [number, number, number],
      positive: [15, 118, 110] as [number, number, number],
      negative: [185, 28, 28] as [number, number, number],
      border: [229, 231, 235] as [number, number, number],
    };

    function setFont(
      size: number,
      style: "normal" | "bold" = "normal",
      color = colors.dark,
    ) {
      doc.setFontSize(size);
      doc.setFont("helvetica", style);
      doc.setTextColor(...color);
    }

    function addPage() {
      doc.addPage();
      y = 18;
    }

    function checkPageBreak(needed: number) {
      if (y + needed > pageH - 18) addPage();
    }

    function hLine(yPos: number, x1 = marginL, x2 = pageW - marginR) {
      doc.setDrawColor(...colors.border);
      doc.setLineWidth(0.3);
      doc.line(x1, yPos, x2, yPos);
    }

    function sectionCard(title: string, icon: string) {
      checkPageBreak(12);
      doc.setFillColor(...colors.primary);
      doc.roundedRect(marginL, y, contentW, 8, 1.5, 1.5, "F");
      setFont(8.5, "bold", colors.white);
      doc.text(`${icon}  ${title}`, marginL + 4, y + 5.3);
      y += 12;
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
        doc.setFillColor(...colors.light);
        doc.rect(marginL, y - 1, contentW, 7, "F");
      }
      setFont(8.5, bold ? "bold" : "normal", colors.muted);
      doc.text(label, marginL + 2, y + 4);
      const valueColor =
        tone === "positive"
          ? colors.positive
          : tone === "negative"
            ? colors.negative
            : colors.dark;
      setFont(8.5, bold ? "bold" : "normal", valueColor);
      doc.text(value, pageW - marginR - 2, y + 4, { align: "right" });
      y += 7;
    }

    function metricBox(
      x: number,
      w: number,
      label: string,
      value: string,
      highlight = false,
    ) {
      const boxH = 18;
      if (highlight) {
        doc.setFillColor(...colors.primary);
        doc.roundedRect(x, y, w - 2, boxH, 2, 2, "F");
        setFont(7, "normal", [178, 236, 218]);
        doc.text(label, x + 4, y + 6);
        setFont(11, "bold", colors.white);
        doc.text(value, x + 4, y + 14);
      } else {
        doc.setFillColor(...colors.light);
        doc.roundedRect(x, y, w - 2, boxH, 2, 2, "F");
        setFont(7, "normal", colors.muted);
        doc.text(label, x + 4, y + 6);
        setFont(11, "bold", colors.dark);
        doc.text(value, x + 4, y + 14);
      }
    }

    // ── Cover / header ─────────────────────────────────────
    doc.setFillColor(...colors.primary);
    doc.rect(0, 0, pageW, 52, "F");

    // Logo mark
    doc.setFillColor(255, 255, 255, 0.15);
    doc.setFillColor(255, 255, 255);
    doc.setGState(new (doc as any).GState({ opacity: 0.15 }));
    doc.circle(pageW - 22, 26, 18, "F");
    doc.setGState(new (doc as any).GState({ opacity: 1 }));

    setFont(22, "bold", colors.white);
    doc.text("Meridian", marginL, 22);
    setFont(9, "normal", [178, 236, 218]);
    doc.text("Relocation Budget Planner", marginL, 30);

    if (settings.plannerName) {
      setFont(10, "bold", colors.white);
      doc.text(settings.plannerName, marginL, 40);
    }

    setFont(7.5, "normal", [178, 236, 218]);
    const exportDate = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    doc.text(`Exported ${exportDate}`, marginL, settings.plannerName ? 47 : 40);

    // Relocation route
    if (settings.originCountry && settings.destCountry) {
      const route = `${settings.originCountry.flag} ${settings.originCountry.name}  →  ${settings.destCountry.flag} ${settings.destCountry.name}`;
      setFont(9, "normal", colors.white);
      doc.text(route, pageW - marginR, settings.plannerName ? 47 : 40, {
        align: "right",
      });
    }

    y = 62;

    // ── Summary metrics ────────────────────────────────────
    const colW = contentW / 4;
    const labels = [
      "Monthly savings",
      "Total needed",
      "Months to target",
      "Ready by",
    ];
    const values = [
      formatEUR(store.adjustedMonthlySavings),
      formatEUR(store.grandTotal),
      store.monthsToTarget?.toString() ?? "—",
      store.readyDate ? formatMonth(store.readyDate) : "—",
    ];
    labels.forEach((label, i) => {
      metricBox(marginL + i * colW, colW, label, values[i] ?? "—", i === 3);
    });
    y += 26;

    hLine(y);
    y += 8;

    // ── Income ─────────────────────────────────────────────
    sectionCard("Income", "€");
    dataRow("Your income", formatEUR(store.incomeYou));
    dataRow(
      "Partner's income",
      formatEUR(store.incomePartner),
      "normal",
      false,
      true,
    );
    dataRow("Total combined", formatEUR(store.totalIncome), "positive", true);
    y += 4;

    // ── Visa transfer ──────────────────────────────────────
    sectionCard("Visa transfer requirement", "$");
    dataRow("Monthly transfer", `$${store.transferUSD.toLocaleString()}`);
    dataRow("EUR/USD rate", store.eurUsdRate.toFixed(4), "normal", false, true);
    dataRow(
      `${settings.destCurrencyCode} per EUR`,
      store.destCurrencyRate.toFixed(2),
    );
    dataRow(
      "Transfer in euros",
      `≈ ${formatEUR(store.transferEUR)}`,
      "normal",
      true,
      true,
    );
    y += 4;

    // ── Destination expenses ───────────────────────────────
    sectionCard("Destination living expenses", "⌂");
    dataRow("Rent", formatDestCurrency(store.rent));
    dataRow(
      "Electricity",
      formatDestCurrency(store.electricity),
      "normal",
      false,
      true,
    );
    dataRow("Internet", formatEUR(store.internet));
    dataRow(
      "Mobile phones (2×)",
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
    dataRow(
      "Total destination expenses",
      `−${formatEUR(store.totalDestExpenses)}`,
      "negative",
      true,
    );
    dataRow(
      "Transfer surplus",
      `${store.transferSurplus >= 0 ? "+" : ""}${formatEUR(store.transferSurplus)}/mo`,
      store.transferSurplus >= 0 ? "positive" : "negative",
      true,
      true,
    );
    y += 4;

    // ── Home country expenses ──────────────────────────────
    sectionCard("Home country expenses", "✈");
    dataRow("Health insurance", formatEUR(store.healthInsurance));
    dataRow(
      `Return flights (${store.tripsYouPerYear}×/yr, ${formatEUR(store.flightPriceYou)}/person)`,
      `−${formatEUR(store.flightsYouMonthly)}/mo`,
      "negative",
      false,
      true,
    );
    dataRow(
      `Visitor flights (${store.numDependants} people, ${store.tripsVisitorsPerYear}×/yr)`,
      `−${formatEUR(store.flightsVisitorsMonthly)}/mo`,
      "negative",
    );
    dataRow(
      "Total home deductions/mo",
      `−${formatEUR(store.totalHomeDeductions)}`,
      "negative",
      true,
      true,
    );
    y += 4;

    // ── Optional expenses ──────────────────────────────────
    const activeOptionals = Object.values(store.optionalExpenses).filter(
      (e) => e.enabled,
    );
    if (activeOptionals.length > 0) {
      sectionCard("Optional expenses (active)", "⚙");
      activeOptionals.forEach((e, i) => {
        dataRow(
          e.label,
          `−${formatEUR(e.value)}/mo`,
          "negative",
          false,
          i % 2 === 1,
        );
      });
      dataRow(
        "Total optional/mo",
        `−${formatEUR(store.totalOptionalActive)}`,
        "negative",
        true,
        true,
      );
      y += 4;
    }

    // ── Purchase target ────────────────────────────────────
    sectionCard("Purchase target", "⊕");
    dataRow("Target property price", formatEUR(store.propertyPrice));
    dataRow(
      "Acquisition fees",
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
    dataRow("Grand total needed", formatEUR(store.grandTotal), "normal", true);
    y += 4;

    // ── Savings breakdown ──────────────────────────────────
    checkPageBreak(60);
    sectionCard("Monthly savings breakdown", "∑");
    dataRow("Combined income", formatEUR(store.totalIncome), "positive");
    dataRow(
      "Visa transfer",
      `−${formatEUR(store.transferEUR)}`,
      "negative",
      false,
      true,
    );
    dataRow(
      "Health insurance",
      `−${formatEUR(store.healthInsurance)}`,
      "negative",
    );
    dataRow(
      "Flights (amortised)",
      `−${formatEUR(store.totalFlightsMonthly)}`,
      "negative",
      false,
      true,
    );
    if (store.totalOptionalActive > 0) {
      dataRow(
        "Optional expenses",
        `−${formatEUR(store.totalOptionalActive)}`,
        "negative",
      );
    }
    dataRow(
      "Net monthly savings",
      formatEUR(store.adjustedMonthlySavings),
      store.adjustedMonthlySavings > 0 ? "positive" : "negative",
      true,
      true,
    );
    y += 4;

    // ── Scenarios ──────────────────────────────────────────
    checkPageBreak(50);
    sectionCard("Three scenarios", "◈");
    store.scenarios.forEach((s, i) => {
      dataRow(
        `${s.label} (${formatEUR(s.rate)}/mo)`,
        s.months
          ? `${s.months} months → ${s.date ? formatMonth(s.date) : "—"}`
          : "—",
        s.isBase ? "positive" : "normal",
        s.isBase,
        i % 2 === 1,
      );
    });
    y += 4;

    // ── Milestones ─────────────────────────────────────────
    checkPageBreak(50);
    sectionCard("Milestones", "⚑");
    store.milestones.forEach((m, i) => {
      dataRow(
        m.label,
        m.date ? formatMonth(m.date) : "—",
        m.label === "Target reached" ? "positive" : "normal",
        m.label === "Target reached",
        i % 2 === 1,
      );
    });
    y += 8;

    // ── Footer on every page ───────────────────────────────
    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      hLine(pageH - 12);
      setFont(7, "normal", colors.muted);
      doc.text("Meridian — Relocation Budget Planner", marginL, pageH - 7);
      doc.text(`Page ${p} of ${totalPages}`, pageW - marginR, pageH - 7, {
        align: "right",
      });
      doc.text(exportDate, pageW / 2, pageH - 7, { align: "center" });
    }

    // ── Save ───────────────────────────────────────────────
    const filename = settings.plannerName
      ? `meridian-${settings.plannerName.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}.pdf`
      : `meridian-budget-${new Date().toISOString().slice(0, 10)}.pdf`;

    doc.save(filename);
  }

  return { exportPDF };
};
