<template>
  <div
    class="rounded-xl p-8 flex flex-col items-center justify-center border-2 border-dashed transition-all duration-300 group cursor-pointer relative"
    :class="[
      isDarkMode
        ? 'bg-gray-800 bg-opacity-50 border-gray-600 hover:border-indigo-500'
        : 'bg-gray-100 border-gray-300 hover:border-indigo-500'
    ]"
    @click="triggerFileUpload"
    @dragover.prevent
    @drop.prevent="handleFileDrop"
  >
    <input id="file-upload" type="file" class="hidden" @change="handleFileUpload" ref="fileInput" />
    <div class="absolute inset-0 w-full h-full" v-if="uploadProgress > 0">
      <BorderProgressBar :progress="uploadProgress" />
    </div>
    <UploadCloudIcon
      :class="[
        'w-16 h-16 transition-colors duration-300',
        isDarkMode
          ? 'text-gray-400 group-hover:text-indigo-400'
          : 'text-gray-600 group-hover:text-indigo-600'
      ]"
    />
    <p
      :class="[
        'mt-4 text-sm transition-colors duration-300 w-full text-center',
        isDarkMode
          ? 'text-gray-400 group-hover:text-indigo-400'
          : 'text-gray-600 group-hover:text-indigo-600'
      ]"
    >
      <span class="block truncate">
        {{ selectedFile ? selectedFile.name : '点击或拖放文件到此处上传' }}
      </span>
    </p>
    <p :class="['mt-2 text-xs', isDarkMode ? 'text-gray-500' : 'text-gray-400']">
      支持各种常见格式，最大20MB
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { UploadCloudIcon } from 'lucide-vue-next'
import BorderProgressBar from '@/components/common/BorderProgressBar.vue'

const props = defineProps({
  isDarkMode: Boolean,
  uploadProgress: Number
})

const emit = defineEmits(['file-selected'])

const fileInput = ref(null)
const selectedFile = ref(null)

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    selectedFile.value = file
    emit('file-selected', file)
  }
}

const handleFileDrop = (event) => {
  const file = event.dataTransfer?.files[0]
  if (file) {
    selectedFile.value = file
    emit('file-selected', file)
  }
}
</script>
