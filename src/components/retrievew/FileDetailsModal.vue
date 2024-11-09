<template>
  <transition name="fade">
    <div
      v-if="record"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="p-8 rounded-2xl max-w-md w-full mx-4 shadow-2xl"
        :class="[isDarkMode ? 'bg-gray-900' : 'bg-white']"
      >
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold" :class="[isDarkMode ? 'text-white' : 'text-gray-900']">
            文件详情
          </h3>
          <button
            @click="$emit('close')"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-300"
          >
            <XIcon class="h-6 w-6" :class="[isDarkMode ? 'text-white' : 'text-gray-900']" />
          </button>
        </div>

        <div class="space-y-6">
          <div class="flex items-center space-x-4">
            <FileIcon class="h-12 w-12 text-indigo-500" />
            <div>
              <h4 class="font-medium" :class="[isDarkMode ? 'text-white' : 'text-gray-900']">
                {{ record.filename }}
              </h4>
              <p class="text-sm text-gray-500">{{ record.size }}</p>
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <CalendarIcon class="h-5 w-5 text-gray-400" />
              <span :class="[isDarkMode ? 'text-gray-300' : 'text-gray-600']">
                上传时间：{{ record.date }}
              </span>
            </div>
            <div class="flex items-center space-x-3">
              <HardDriveIcon class="h-5 w-5 text-gray-400" />
              <span :class="[isDarkMode ? 'text-gray-300' : 'text-gray-600']">
                文件大小：{{ record.size }}
              </span>
            </div>
          </div>

          <div class="flex justify-center">
            <QRCode
              :value="baseUrl + '/retrieve/' + record.code"
              :size="200"
              level="M"
              render-as="svg"
              :foreground="isDarkMode ? '#FFFFFF' : '#000000'"
              :background="isDarkMode ? '#111827' : '#FFFFFF'"
            />
          </div>

          <div class="flex space-x-4">
            <button
              @click="$emit('show-preview')"
              class="flex-1 px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition duration-300"
            >
              预览内容
            </button>
            <button
              @click="$emit('download')"
              class="flex-1 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition duration-300"
            >
              <DownloadIcon class="h-5 w-5 inline-block mr-2" />
              下载
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { FileIcon, CalendarIcon, HardDriveIcon, DownloadIcon, XIcon } from 'lucide-vue-next'
import QRCode from 'qrcode.vue'

defineProps({
  record: Object,
  isDarkMode: Boolean,
  baseUrl: String
})

defineEmits(['close', 'show-preview', 'download'])
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
</style>
