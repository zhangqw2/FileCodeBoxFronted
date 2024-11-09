<template>
  <button
    type="submit"
    class="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg relative overflow-hidden group"
  >
    <span
      class="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"
    ></span>
    <span class="relative z-10 flex items-center justify-center text-lg">
      <SendIcon class="w-6 h-6 mr-2" />
      <span>安全寄送</span>
    </span>
  </button>
</template>

<script setup>
import { SendIcon } from 'lucide-vue-next'
</script>
