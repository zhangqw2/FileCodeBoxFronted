<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="p-8 rounded-2xl max-w-3xl w-full mx-4"
        :class="[isDarkMode ? 'bg-gray-900' : 'bg-white']"
      >
        <!-- Modal Header -->
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold" :class="[isDarkMode ? 'text-white' : 'text-gray-900']">
            内容预览
          </h3>
          <button
            @click="$emit('close')"
            class="p-2 rounded-lg transition duration-300"
            :class="[isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100']"
          >
            <XIcon class="h-6 w-6" :class="[isDarkMode ? 'text-white' : 'text-gray-900']" />
          </button>
        </div>

        <!-- Content -->
        <div
          class="prose max-w-none overflow-y-auto max-h-[60vh] p-4 rounded-lg"
          :class="[isDarkMode ? 'prose-invert bg-gray-800' : 'bg-gray-50']"
          v-html="renderedContent"
        ></div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { XIcon } from 'lucide-vue-next'
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps({
  show: Boolean,
  content: String,
  isDarkMode: Boolean
})

defineEmits(['close'])

const renderedContent = computed(() => marked(props.content || ''))
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Markdown Styles */
:deep(.prose) {
  max-width: none;
}

:deep(.prose pre) {
  background-color: v-bind('isDarkMode ? "#1F2937" : "#F3F4F6"');
  padding: 1rem;
  border-radius: 0.5rem;
}

:deep(.prose code) {
  color: v-bind('isDarkMode ? "#E5E7EB" : "#1F2937"');
}

:deep(.prose a) {
  color: #6366f1;
  text-decoration: none;
}

:deep(.prose a:hover) {
  text-decoration: underline;
}
</style>
