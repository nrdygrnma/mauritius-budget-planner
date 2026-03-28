<template>
  <UModal
    v-model:open="open"
    description="This will clear all your current settings and restore the original values. Your saved state will be erased."
    title="Reset to defaults?"
  >
    <template #content>
      <UCard>
        <template #header>
          <p class="font-semibold text-gray-900 dark:text-white">
            Reset to defaults?
          </p>
        </template>
        <p class="text-sm text-gray-500 leading-relaxed">
          This will clear all your current settings and restore the original
          values. Your saved state in localStorage will be erased.
        </p>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              color="neutral"
              label="Cancel"
              variant="ghost"
              @click="open = false"
            />
            <UButton
              color="error"
              label="Reset everything"
              @click="emit('confirm')"
            />
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
const open = defineModel<boolean>("open", { required: true });
const emit = defineEmits<{ confirm: [] }>();
</script>
