<template>
  <transition name="drawer">
    <div
      v-if="show"
      class="fixed inset-y-0 right-0 w-full sm:w-120 bg-opacity-70 backdrop-filter backdrop-blur-xl shadow-2xl z-50 overflow-hidden flex flex-col"
      :class="[isDarkMode ? 'bg-gray-900' : 'bg-white']"
    >
      <!-- Drawer Header -->
      <div
        class="flex justify-between items-center p-6 border-b"
        :class="[isDarkMode ? 'border-gray-700' : 'border-gray-200']"
      >
        <h2 class="text-xl font-semibold" :class="[isDarkMode ? 'text-white' : 'text-gray-900']">
          发送记录
        </h2>
        <button
          @click="$emit('close')"
          class="p-2 rounded-lg transition duration-300"
          :class="[isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100']"
        >
          <XIcon class="h-6 w-6" :class="[isDarkMode ? 'text-white' : 'text-gray-900']" />
        </button>
      </div>

      <!-- Records List -->
      <div class="flex-grow overflow-y-auto p-6">
        <transition-group name="list" tag="div" class="space-y-4">
          <div
            v-for="record in records"
            :key="record.id"
            class="p-4 rounded-lg transition duration-300"
            :class="[
              isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50 shadow-md'
            ]"
          >
            <div class="flex items-start justify-between">
              <div class="flex items-center space-x-3">
                <FileIcon
                  class="h-5 w-5 text-indigo-500"
                  :class="[record.type === 'text' ? 'text-purple-500' : 'text-indigo-500']"
                />
                <div>
                  <h3 class="font-medium" :class="[isDarkMode ? 'text-white' : 'text-gray-900']">
                    {{ record.filename }}
                  </h3>
                  <p class="text-sm text-gray-500">{{ record.size }} · {{ record.date }}</p>
                </div>
              </div>
              <div class="flex space-x-2">
                <button
                  @click="$emit('view-details', record)"
                  class="p-2 rounded-lg transition duration-300"
                  :class="[
                    isDarkMode
                      ? 'hover:bg-gray-600 text-gray-400'
                      : 'hover:bg-gray-200 text-gray-600'
                  ]"
                >
                  <EyeIcon class="h-4 w-4" />
                </button>
                <button
                  @click="$emit('delete', record.id)"
                  class="p-2 rounded-lg transition duration-300"
                  :class="[
                    isDarkMode
                      ? 'hover:bg-gray-600 text-gray-400'
                      : 'hover:bg-gray-200 text-gray-600'
                  ]"
                >
                  <TrashIcon class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { FileIcon, EyeIcon, TrashIcon, XIcon } from 'lucide-vue-next'

defineProps({
  show: Boolean,
  records: Array,
  isDarkMode: Boolean
})

defineEmits(['close', 'view-details', 'delete'])
</script>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.3s ease-out;
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
