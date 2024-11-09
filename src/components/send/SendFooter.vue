<template>
  <div
    class="px-8 py-4 bg-opacity-50 flex justify-between items-center"
    :class="[isDarkMode ? 'bg-gray-800' : 'bg-gray-100']"
  >
    <span
      class="text-sm flex items-center"
      :class="[isDarkMode ? 'text-gray-300' : 'text-gray-800']"
    >
      <ShieldCheckIcon class="w-4 h-4 mr-1 text-green-400" />
      安全加密
    </span>
    <button
      @click="$emit('toggle-drawer')"
      class="text-sm hover:text-indigo-300 transition duration-300 flex items-center"
      :class="[isDarkMode ? 'text-indigo-400' : 'text-indigo-600']"
    >
      发件记录
      <ClipboardListIcon class="w-4 h-4 ml-1" />
    </button>
  </div>
</template>

<script setup>
import { ShieldCheckIcon, ClipboardListIcon } from 'lucide-vue-next'

defineProps({
  isDarkMode: Boolean
})

defineEmits(['toggle-drawer'])
</script>
