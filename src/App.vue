<script setup lang="ts">
import { ref, watchEffect, provide } from 'vue'
import { RouterView } from 'vue-router'
import ThemeToggle from './components/ThemeToggle.vue'

const isDarkMode = ref(false)

watchEffect(() => {
  document.documentElement.classList.toggle('dark', isDarkMode.value)
})

provide('isDarkMode', isDarkMode)
</script>

<template>
  <div :class="['app-container', isDarkMode ? 'dark' : 'light']">
    <ThemeToggle v-model="isDarkMode" />
    <RouterView v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" :key="$route.fullPath" />
      </transition>
    </RouterView>
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
  transition: background-color 0.5s ease;
}

.light {
  @apply bg-gradient-to-br from-blue-50 via-indigo-50 to-white;
}

.dark {
  @apply bg-gradient-to-br from-gray-900 via-indigo-900 to-black;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
