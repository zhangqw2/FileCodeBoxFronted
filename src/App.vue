<script setup lang="ts">
import { ref, watchEffect, provide, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import ThemeToggle from './components/ThemeToggle.vue'

const isDarkMode = ref(false)

// 检查系统颜色模式
const checkSystemColorScheme = () => {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

// 从本地存储获取用户之前的选择
const getUserPreference = () => {
  const storedPreference = localStorage.getItem('colorMode')
  if (storedPreference) {
    return storedPreference === 'dark'
  }
  return null
}

// 设置颜色模式
const setColorMode = (isDark: boolean) => {
  isDarkMode.value = isDark
  localStorage.setItem('colorMode', isDark ? 'dark' : 'light')
}

onMounted(() => {
  const userPreference = getUserPreference()
  if (userPreference !== null) {
    setColorMode(userPreference)
  } else {
    setColorMode(checkSystemColorScheme())
  }
})

watchEffect(() => {
  document.documentElement.classList.toggle('dark', isDarkMode.value)
})

provide('isDarkMode', isDarkMode)
provide('setColorMode', setColorMode)
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
