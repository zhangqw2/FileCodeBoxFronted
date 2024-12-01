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
        <!-- Modal Header -->
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold" :class="[isDarkMode ? 'text-white' : 'text-gray-900']">
            文件详情
          </h3>
          <button
            @click="$emit('close')"
            class="p-2 rounded-lg transition duration-300"
            :class="[isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100']"
          >
            <XIcon class="h-6 w-6" :class="[isDarkMode ? 'text-white' : 'text-gray-900']" />
          </button>
        </div>

        <!-- File Info -->
        <div class="space-y-6">
          <div class="flex items-center space-x-4">
            <FileIcon
              class="h-12 w-12"
              :class="[record.type === 'text' ? 'text-purple-500' : 'text-indigo-500']"
            />
            <div>
              <h4 class="font-medium" :class="[isDarkMode ? 'text-white' : 'text-gray-900']">
                {{ record.filename }}
              </h4>
              <p class="text-sm text-gray-500">
                {{ record.size }}
              </p>
            </div>
          </div>

          <!-- Details -->
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <CalendarIcon class="h-5 w-5 text-gray-400" />
              <span :class="[isDarkMode ? 'text-gray-300' : 'text-gray-600']">
                上传时间：{{ record.date }}
              </span>
            </div>
            <div class="flex items-center space-x-3">
              <ClockIcon class="h-5 w-5 text-gray-400" />
              <span :class="[isDarkMode ? 'text-gray-300' : 'text-gray-600']">
                过期时间：{{ record.expireDate }}
              </span>
            </div>
            <div class="flex items-center space-x-3">
              <KeyIcon class="h-5 w-5 text-gray-400" />
              <span :class="[isDarkMode ? 'text-gray-300' : 'text-gray-600']">
                取件码：{{ record.code }}
              </span>
            </div>
          </div>

          <!-- QR Code -->
          <div class="flex justify-center">
            <QRCode
              :value="`${baseUrl}/retrieve/${record.code}`"
              :size="200"
              level="M"
              render-as="svg"
              :foreground="isDarkMode ? '#FFFFFF' : '#000000'"
              :background="isDarkMode ? '#111827' : '#FFFFFF'"
            />
          </div>

          <!-- Actions -->
          <div class="flex space-x-4">
            <button
              v-if="record.type === 'text'"
              @click="$emit('show-preview')"
              class="flex-1 px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition duration-300"
            >
              预览内容
            </button>
            <button
              class="flex-1 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition duration-300"
              @click="copyShareLink"
            >
              复制链接
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { FileIcon, CalendarIcon, ClockIcon, KeyIcon, XIcon } from 'lucide-vue-next'
import QRCode from 'qrcode.vue'
import { copyToClipboard } from '@/utils/clipboard'

const props = defineProps({
  record: Object,
  isDarkMode: Boolean,
  baseUrl: String
})

defineEmits(['close', 'show-preview'])

const copyShareLink = async () => {
  copyToClipboard(`${props.baseUrl}/#/?code=${props.record.code}`)
}
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
