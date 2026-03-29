<template>
  <UModal
    v-model:open="open"
    :ui="{ content: 'max-w-xl' }"
    description="Import items from a CSV file, paste a list, or add manually"
    title="Add to price library"
    @close="reset"
  >
    <template #content>
      <UCard>
        <template #header>
          <p class="font-semibold text-gray-900 dark:text-white">
            Add to price library
          </p>
          <p class="text-xs text-gray-400 mt-0.5">
            Items are tagged to a source (store + date) for price comparison
          </p>
        </template>

        <!-- Source metadata -->
        <div class="grid grid-cols-2 gap-3 mb-5">
          <UFormField label="Source name">
            <UInput
              v-model="sourceName"
              class="w-full"
              placeholder="Super U July 2025"
            />
          </UFormField>
          <UFormField label="Store">
            <UInput v-model="storeVal" class="w-full" placeholder="Super U" />
          </UFormField>
        </div>

        <USeparator class="mb-5" />

        <!-- Method tabs -->
        <div
          class="flex gap-1 mb-5 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg"
        >
          <button
            v-for="t in tabs"
            :key="t.value"
            :class="
              tab === t.value
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            "
            class="flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all"
            @click="
              tab = t.value;
              previewItems = [];
            "
          >
            {{ t.label }}
          </button>
        </div>

        <!-- ── Manual ── -->
        <div v-if="tab === 'manual'" class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <UFormField class="col-span-2" label="Product name">
              <UInput
                v-model="manualName"
                class="w-full"
                placeholder="Milk UHT 1L"
                @keyup.enter="addManual"
              />
            </UFormField>
            <UFormField label="Price (MUR)">
              <UInputNumber
                v-model="manualPrice"
                :format-options="{ useGrouping: false }"
                :min="0"
                :step="0.5"
                class="w-full"
                placeholder="0.00"
                @keyup.enter="addManual"
              />
            </UFormField>
            <UFormField label="Unit (optional)">
              <UInput
                v-model="manualUnit"
                class="w-full"
                placeholder="1L, 500g, each"
              />
            </UFormField>
            <UFormField class="col-span-2" label="Category">
              <USelect
                :items="catOptions"
                :v-model="manualCat"
                class="w-full"
                value-key="value"
              />
            </UFormField>
          </div>
          <UButton
            class="w-full"
            color="primary"
            icon="i-lucide-plus"
            @click="addManual"
          >
            Add to library
          </UButton>
          <p class="text-xs text-center text-gray-400">
            Press Enter or click Add — modal stays open for multiple items
          </p>
        </div>

        <!-- ── CSV ── -->
        <div v-else-if="tab === 'csv'" class="space-y-4">
          <div
            :class="
              csvIsDragging
                ? 'border-teal-400 bg-teal-50 dark:bg-teal-950/30'
                : 'border-gray-200 dark:border-gray-700 hover:border-teal-400'
            "
            class="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all"
            @click="fileInputRef?.click()"
            @dragleave="csvIsDragging = false"
            @drop="handleCSVDrop"
            @dragover.prevent="csvIsDragging = true"
          >
            <UIcon
              class="w-8 h-8 text-gray-400 mx-auto mb-2"
              name="i-lucide-file-spreadsheet"
            />
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{
                csvFile
                  ? csvFile.name
                  : "Drop a CSV file here, or click to browse"
              }}
            </p>
            <p class="text-xs text-gray-400 mt-1">
              Columns: name, price (MUR), category (optional), unit (optional)
            </p>
            <input
              ref="fileInputRef"
              accept=".csv,.txt"
              class="hidden"
              type="file"
              @change="handleFileChange"
            />
          </div>

          <div
            class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 font-mono text-xs text-gray-500 space-y-0.5"
          >
            <p class="text-gray-400 font-sans not-italic text-xs mb-1">
              Expected format:
            </p>
            <p>Milk UHT 1L, 53.50, Dairy &amp; eggs, 1L</p>
            <p>Chicken 500g, 137, Meat &amp; fish</p>
            <p>Basmati rice 2kg, 125</p>
          </div>

          <div v-if="previewItems.length" class="space-y-1">
            <p class="text-xs text-gray-400 uppercase tracking-wider mb-2">
              Preview — {{ previewItems.length }} items
            </p>
            <div class="max-h-48 overflow-y-auto pr-1">
              <div
                v-for="(it, i) in previewItems"
                :key="i"
                class="flex justify-between text-xs py-1.5 border-b border-gray-100 dark:border-gray-800 last:border-0"
              >
                <span class="text-gray-700 dark:text-gray-300 truncate mr-3">{{
                  it.name
                }}</span>
                <span class="font-mono text-gray-500 shrink-0"
                  >Rs {{ it.unitMur }} · {{ it.category }}</span
                >
              </div>
            </div>
          </div>

          <UButton
            :disabled="!csvFile"
            class="w-full"
            color="primary"
            icon="i-lucide-upload"
            @click="importCSV"
          >
            Import
            {{ previewItems.length ? previewItems.length + " items" : "CSV" }}
            to library
          </UButton>
        </div>

        <!-- ── Paste ── -->
        <div v-else class="space-y-4">
          <UFormField
            description="Format: Name, Price (MUR), Category (optional), Unit (optional)"
            label="One item per line"
          >
            <UTextarea
              v-model="pasteText"
              :rows="8"
              class="w-full font-mono text-xs"
              placeholder="Milk UHT 1L, 53.50, Dairy & eggs, 1L
Chicken 500g, 137, Meat & fish
Basmati rice 2kg, 125
Dishwashing liquid, 80, Cleaning"
              @input="updatePastePreview"
            />
          </UFormField>

          <div v-if="previewItems.length" class="space-y-1">
            <p class="text-xs text-gray-400 uppercase tracking-wider mb-2">
              {{ previewItems.length }} items detected
            </p>
            <div class="max-h-48 overflow-y-auto pr-1">
              <div
                v-for="(it, i) in previewItems"
                :key="i"
                class="flex justify-between text-xs py-1.5 border-b border-gray-100 dark:border-gray-800 last:border-0"
              >
                <span class="text-gray-700 dark:text-gray-300 truncate mr-3">{{
                  it.name
                }}</span>
                <span class="font-mono text-gray-500 shrink-0"
                  >Rs {{ it.unitMur }} · {{ it.category }}</span
                >
              </div>
            </div>
          </div>

          <UButton
            :disabled="!pasteText.trim()"
            class="w-full"
            color="primary"
            icon="i-lucide-clipboard-check"
            @click="importPaste"
          >
            Import pasted items to library
          </UButton>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton color="neutral" variant="ghost" @click="close"
              >Done</UButton
            >
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import { CATEGORIES } from "~/types/grocery";

const open = defineModel<boolean>("open", { required: true });
const store = useGroceryStore();
const { parseCSV, parseText } = useGroceryImport();
const toast = useToast();

type Tab = "manual" | "csv" | "paste";
const tab = ref<Tab>("csv");

// Source metadata
const sourceName = ref("");
const storeVal = ref("");

// Manual
const manualName = ref("");
const manualPrice = ref<number | undefined>();
const manualCat = ref("Other");
const manualUnit = ref("");

// CSV
const csvFile = ref<File | null>(null);
const fileInputRef = ref<HTMLInputElement>();
const csvIsDragging = ref(false);

// Paste
const pasteText = ref("");

// Shared preview
const previewItems = ref<
  Array<{
    name: string;
    unitMur: number;
    category: string;
    unit: string;
  }>
>([]);

// Lazily created source id for this import session
let activeSourceId = "";

function getOrCreateSource(): string {
  if (activeSourceId) return activeSourceId;
  activeSourceId = store.addSource({
    name: sourceName.value.trim() || "Manual entry",
    store: storeVal.value.trim() || "General",
    date: new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    itemCount: 0,
  });
  return activeSourceId;
}

function reset() {
  tab.value = "csv";
  sourceName.value = "";
  storeVal.value = "";
  manualName.value = "";
  manualPrice.value = undefined;
  manualCat.value = "Other";
  manualUnit.value = "";
  csvFile.value = null;
  pasteText.value = "";
  previewItems.value = [];
  activeSourceId = "";
}

function close() {
  reset();
  open.value = false;
}

// ── Manual ────────────────────────────────────────────────────
function addManual() {
  if (!manualName.value.trim()) {
    toast.add({ title: "Name required", color: "warning" });
    return;
  }
  if (!manualPrice.value || manualPrice.value <= 0) {
    toast.add({ title: "Valid price required", color: "warning" });
    return;
  }
  const sid = getOrCreateSource();
  store.addLibraryItem({
    name: manualName.value.trim(),
    unitMur: manualPrice.value,
    category: manualCat.value,
    unit: manualUnit.value.trim() || "each",
    sourceId: sid,
  });
  const src = store.sources.find((s) => s.id === sid);
  if (src) src.itemCount++;
  toast.add({
    title: "Added to library",
    description: manualName.value.trim(),
    color: "success",
  });
  manualName.value = "";
  manualPrice.value = undefined;
  manualUnit.value = "";
}

// ── CSV ───────────────────────────────────────────────────────
function handleCSVDrop(e: DragEvent) {
  e.preventDefault();
  csvIsDragging.value = false;
  const file = e.dataTransfer?.files[0];
  if (file) {
    csvFile.value = file;
    loadCSVPreview();
  }
}

function handleFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    csvFile.value = file;
    loadCSVPreview();
  }
}

async function loadCSVPreview() {
  if (!csvFile.value) return;
  const text = await csvFile.value.text();
  previewItems.value = parseCSV(text, "preview").slice(0, 10);
}

async function importCSV() {
  if (!csvFile.value) return;
  const text = await csvFile.value.text();
  const sid = getOrCreateSource();
  const items = parseCSV(text, sid);
  if (!items.length) {
    toast.add({
      title: "No valid rows found",
      description: "Check the CSV format",
      color: "warning",
    });
    return;
  }
  store.addLibraryItems(items);
  const src = store.sources.find((s) => s.id === sid);
  if (src) src.itemCount += items.length;
  toast.add({
    title: `${items.length} items added to library`,
    color: "success",
  });
  close();
}

// ── Paste ─────────────────────────────────────────────────────
function updatePastePreview() {
  previewItems.value = pasteText.value.trim()
    ? parseText(pasteText.value, "preview").slice(0, 10)
    : [];
}

function importPaste() {
  const sid = getOrCreateSource();
  const items = parseText(pasteText.value, sid);
  if (!items.length) {
    toast.add({
      title: "No items found",
      description: "Use format: Name, Price, Category",
      color: "warning",
    });
    return;
  }
  store.addLibraryItems(items);
  const src = store.sources.find((s) => s.id === sid);
  if (src) src.itemCount += items.length;
  toast.add({
    title: `${items.length} items added to library`,
    color: "success",
  });
  close();
}

const catOptions = CATEGORIES.map((c) => ({ label: c, value: c }));

const tabs: Array<{ label: string; value: Tab }> = [
  { label: "CSV file", value: "csv" },
  { label: "Paste", value: "paste" },
  { label: "Manual", value: "manual" },
];
</script>
