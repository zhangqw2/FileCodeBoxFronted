<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div  class="app-container bg-gradient-to-br from-gray-900 via-indigo-900 to-black overflow-hidden">
    <transition name="page" mode="out-in">
      <RouterView />
    </transition>
  </div>
</template>

<style>
.app-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.5s ease-out;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  @apply bg-gray-900 text-white overflow-y-auto;
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-800;
}

::-webkit-scrollbar-thumb {
  @apply bg-indigo-600 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-indigo-500;
}
</style>
