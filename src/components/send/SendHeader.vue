<template>
  <div class="p-8">
    <h2
      class="text-3xl font-extrabold text-center mb-8 cursor-pointer transition-colors duration-300"
      :class="[
        isDarkMode
          ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300'
          : 'text-indigo-600'
      ]"
      @click="$emit('to-retrieve')"
    >
      FileCodeBox
    </h2>
  </div>
</template>

<script setup>
defineProps({
  isDarkMode: Boolean
})

defineEmits(['to-retrieve'])
</script>
