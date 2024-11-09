<template>
  <div
    class="min-h-screen flex items-center justify-center p-4 overflow-hidden transition-colors duration-300"
  >
    <div class="w-full max-w-md relative z-10">
      <div
        class="rounded-3xl shadow-2xl overflow-hidden border transform transition-all duration-300"
        :class="[
          isDarkMode
            ? 'bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl border-gray-700'
            : 'bg-white border-gray-200'
        ]"
      >
        <!-- Logo and Title Section -->
        <div class="p-8">
          <div class="flex justify-center mb-8">
            <div
              class="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 animate-spin-slow"
            >
              <div class="rounded-full bg-gray-900 p-2">
                <BoxIcon class="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <h2
            @click="toSend"
            class="text-3xl cursor-pointer font-extrabold text-center mb-6"
            :class="[
              isDarkMode
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300'
                : 'text-indigo-600'
            ]"
          >
            FileCodeBox
          </h2>

          <!-- File Input Form Component -->
          <FileInputForm :is-dark-mode="isDarkMode" @submit="handleSubmit" />

          <div class="mt-6 text-center">
            <router-link
              to="/send"
              class="text-indigo-400 hover:text-indigo-300 transition duration-300"
            >
              需要发送文件？点击这里
            </router-link>
          </div>
        </div>

        <!-- Footer Section -->
        <div
          class="px-8 py-4 bg-opacity-50 flex justify-between items-center"
          :class="[isDarkMode ? 'bg-gray-800' : 'bg-gray-100']"
        >
          <span
            class="text-sm flex items-center"
            :class="[isDarkMode ? 'text-gray-300' : 'text-gray-800']"
          >
            <ShieldCheckIcon class="w-4 h-4 mr-1 text-green-400" />
            安全加密
          </span>
          <button
            @click="toggleDrawer"
            class="text-sm hover:text-indigo-300 transition duration-300 flex items-center"
            :class="[isDarkMode ? 'text-indigo-400' : 'text-indigo-600']"
          >
            取件记录
            <ClipboardListIcon class="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>

    <!-- History Drawer Component -->
    <HistoryDrawer
      :show="showDrawer"
      :records="records"
      :is-dark-mode="isDarkMode"
      @close="toggleDrawer"
      @view-details="viewDetails"
      @download="downloadRecord"
      @delete="deleteRecord"
    />

    <!-- File Details Modal Component -->
    <FileDetailsModal
      :record="selectedRecord"
      :is-dark-mode="isDarkMode"
      :base-url="baseUrl"
      @close="selectedRecord = null"
      @show-preview="showContentPreview"
      @download="downloadRecord"
    />

    <!-- Content Preview Modal Component -->
    <ContentPreviewModal
      :show="showPreview"
      :content="selectedRecord?.content"
      :is-dark-mode="isDarkMode"
      @close="showPreview = false"
    />
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useFileDataStore } from '@/stores/fileData'
import { useAlertStore } from '@/stores/alertStore'
import api from '@/utils/api'
import { saveAs } from 'file-saver'
import { BoxIcon, ShieldCheckIcon, ClipboardListIcon } from 'lucide-vue-next'

// Components
import FileInputForm from '@/components/retrievew/FileInputForm.vue'
import HistoryDrawer from '@/components/retrievew/HistoryDrawer.vue'
import FileDetailsModal from '@/components/retrievew/FileDetailsModal.vue'
import ContentPreviewModal from '@/components/retrievew/ContentPreviewModal.vue'

// Store and Router setup
const router = useRouter()
const route = useRoute()
const fileStore = useFileDataStore()
const alertStore = useAlertStore()
const { receiveData: records } = storeToRefs(fileStore)

// Inject and Environment Variables
const isDarkMode = inject('isDarkMode')
const baseUrl =
  import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_API_BASE_URL_PROD
    : import.meta.env.VITE_API_BASE_URL_DEV

// Reactive References
const showDrawer = ref(false)
const selectedRecord = ref(null)
const showPreview = ref(false)

// Lifecycle Hooks
onMounted(() => {
  const queryCode = route.query.code
  if (queryCode) {
    handleSubmit(queryCode)
  }
})

// Methods
const handleSubmit = async (code) => {
  try {
    const res = await api.post('/share/select/', { code })

    if (res.code === 200) {
      if (res.detail) {
        const isFile = res.detail.text.startsWith('/share/download')
        const newFileData = {
          id: Date.now(),
          code: res.detail.code,
          filename: res.detail.name,
          size: formatFileSize(res.detail.size),
          downloadUrl: isFile ? res.detail.text : null,
          content: isFile ? null : res.detail.text,
          date: new Date().toLocaleString()
        }

        // Check if file already exists in history
        const exists = fileStore.receiveData.some((file) => file.code === newFileData.code)
        if (!exists) {
          fileStore.addReceiveData(newFileData)
        }

        showDrawer.value = true
        alertStore.showAlert('文件获取成功', 'success')
      } else {
        alertStore.showAlert('无效的取件码', 'error')
      }
    } else {
      alertStore.showAlert(res.detail || '获取文件失败', 'error')
    }
  } catch (err) {
    console.error('取件失败:', err)
    alertStore.showAlert('取件失败，请稍后重试', 'error')
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const viewDetails = (record) => {
  selectedRecord.value = record
}

const deleteRecord = (id) => {
  const index = records.value.findIndex((record) => record.id === id)
  if (index !== -1) {
    fileStore.deleteReceiveData(index)
  }
}

const toggleDrawer = () => {
  showDrawer.value = !showDrawer.value
}

const toSend = () => {
  router.push('/send')
}

const downloadRecord = (record) => {
  if (record.downloadUrl) {
    // If it's a file, open in new tab for download
    window.open(`${baseUrl}${record.downloadUrl}`, '_blank')
  } else if (record.content) {
    // If it's text content, download as txt file
    const blob = new Blob([record.content], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, `${record.filename}.txt`)
  }
}

const showContentPreview = () => {
  showPreview.value = true
}
</script>

<style>
@keyframes blob {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(20px, -50px) scale(1.1);
  }
  50% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  75% {
    transform: translate(50px, 50px) scale(1.05);
  }
}

.animate-spin-slow {
  animation: spin 8s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Media Queries */
@media (min-width: 640px) {
  .sm\:w-120 {
    width: 30rem;
  }
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.3s ease;
}

.drawer-leave-to,
.drawer-enter-from {
  transform: translateX(100%);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
