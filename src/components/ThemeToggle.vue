<script setup lang="ts">
import { computed } from 'vue'
import { SunIcon, MoonIcon } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const isDarkMode = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>

<template>
  <button
    @click="isDarkMode = !isDarkMode"
    class="fixed top-4 right-4 p-2 rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:rotate-180"
    :class="isDarkMode ? 'bg-gray-800 text-yellow-300' : 'bg-white text-gray-800'"
  >
    <SunIcon v-if="!isDarkMode" class="w-6 h-6" />
    <MoonIcon v-else class="w-6 h-6" />
  </button>
</template>