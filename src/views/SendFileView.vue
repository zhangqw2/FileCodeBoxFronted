<template>
  <div class="min-h-screen flex items-center justify-center p-4 overflow-hidden transition-colors duration-300">
    <div class="rounded-3xl shadow-2xl overflow-hidden border w-full max-w-md transition-colors duration-300" :class="[
      isDarkMode
        ? 'bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl border-gray-700'
        : 'bg-white border-gray-200'
    ]">
      <div class="p-8">
        <h2 class="text-3xl font-extrabold text-center mb-8 cursor-pointer transition-colors duration-300" :class="[
          isDarkMode
            ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300'
            : 'text-indigo-600'
        ]" @click="toRetrieve">
          {{ config.name }}
        </h2>
        <form @submit.prevent="handleSubmit" class="space-y-8">
          <!-- 发送类型选择 -->
          <div class="flex justify-center space-x-4 mb-6">
            <button type="button" @click="sendType = 'file'" :class="[
              'px-4 py-2 rounded-lg',
              sendType === 'file' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'
            ]">
              发送文件
            </button>
            <button type="button" @click="sendType = 'text'" :class="[
              'px-4 py-2 rounded-lg',
              sendType === 'text' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'
            ]">
              发送文本
            </button>
          </div>

          <transition name="fade" mode="out-in">
            <div v-if="sendType === 'file'" key="file" class="grid grid-cols-1 gap-8">
              <!-- 文件上传区域 -->
              <div
                class="rounded-xl p-8 flex flex-col items-center justify-center border-2 border-dashed transition-all duration-300 group cursor-pointer relative"
                :class="[
                  isDarkMode
                    ? 'bg-gray-800 bg-opacity-50 border-gray-600 hover:border-indigo-500'
                    : 'bg-gray-100 border-gray-300 hover:border-indigo-500'
                ]" @click="triggerFileUpload" @dragover.prevent @drop.prevent="handleFileDrop">
                <input id="file-upload" type="file" class="hidden" @change="handleFileUpload" ref="fileInput" />
                <div class="absolute inset-0 w-full h-full" v-if="uploadProgress > 0">
                  <BorderProgressBar :progress="uploadProgress" />
                </div>
                <UploadCloudIcon :class="[
                  'w-16 h-16 transition-colors duration-300',
                  isDarkMode
                    ? 'text-gray-400 group-hover:text-indigo-400'
                    : 'text-gray-600 group-hover:text-indigo-600'
                ]" />
                <p :class="[
                  'mt-4 text-sm transition-colors duration-300 w-full text-center',
                  isDarkMode
                    ? 'text-gray-400 group-hover:text-indigo-400'
                    : 'text-gray-600 group-hover:text-indigo-600'
                ]">
                  <span class="block truncate">
                    {{ selectedFile ? selectedFile.name : '点击或拖放文件到此处上传' }}
                  </span>
                </p>
                <p :class="['mt-2 text-xs', isDarkMode ? 'text-gray-500' : 'text-gray-400']">
                  支持各种常见格式，最大{{ getStorageUnit(config.uploadSize) }}
                </p>
              </div>
            </div>
            <div v-else key="text" class="grid grid-cols-1 gap-8">
              <!-- 文本输入区域 -->
              <div v-if="sendType === 'text'" class="flex flex-col">
                <textarea id="text-content" v-model="textContent" rows="7" :class="[
                  'flex-grow px-4 py-3 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 resize-none',
                  isDarkMode
                    ? 'bg-gray-800 bg-opacity-50 text-white'
                    : 'bg-white text-gray-900 border border-gray-300'
                ]" placeholder="在此输入要发送的文本..."></textarea>
              </div>
            </div>
          </transition>
          <!-- 过期方式选择 -->
          <div class="flex flex-col space-y-4">
            <label :class="['text-sm font-medium', isDarkMode ? 'text-gray-300' : 'text-gray-700']">
              过期方式
            </label>
            <select v-model="expirationMethod" :class="[
              'px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500',
              isDarkMode
                ? 'bg-gray-800 bg-opacity-50 text-white'
                : 'bg-white text-gray-900 border border-gray-300'
            ]">
              <option v-for="item in config.expireStyle" :value="item" :key="item">
                {{ getUnit(item) }}
              </option>
            </select>
            <div v-if="expirationMethod !== 'forever'" class="flex items-center space-x-2">
              <div class="relative flex-grow">
                <input v-model="expirationValue" type="number" :placeholder="getPlaceholder()" :class="[
                  'w-full px-4 py-2 pr-16 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500',
                  isDarkMode
                    ? 'bg-gray-800 bg-opacity-50 text-white'
                    : 'bg-white text-gray-900 border border-gray-300'
                ]" />
                <span :class="[
                  'absolute right-3 top-1/2 transform -translate-y-1/2',
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                ]">
                  {{ getUnit() }}
                </span>
              </div>
            </div>
          </div>
          <!-- 提交按钮 -->
          <button type="submit"
            class="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg relative overflow-hidden group">
            <span
              class="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
            <span class="relative z-10 flex items-center justify-center text-lg">
              <SendIcon class="w-6 h-6 mr-2" />
              <span>安全寄送</span>
            </span>
          </button>
        </form>
        <div class="mt-6 text-center">
          <router-link to="/" class="text-indigo-400 hover:text-indigo-300 transition duration-300">
            需要取件？点击这里
          </router-link>
        </div>
      </div>

      <div class="px-8 py-4 bg-opacity-50 flex justify-between items-center"
        :class="[isDarkMode ? 'bg-gray-800' : 'bg-gray-100']">
        <span class="text-sm flex items-center" :class="[isDarkMode ? 'text-gray-300' : 'text-gray-800']">
          <ShieldCheckIcon class="w-4 h-4 mr-1 text-green-400" />
          安全加密
        </span>
        <button @click="toggleDrawer" class="text-sm hover:text-indigo-300 transition duration-300 flex items-center"
          :class="[isDarkMode ? 'text-indigo-400' : 'text-indigo-600']">
          发件记录
          <ClipboardListIcon class="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>

    <!-- 抽屉式发件记录 -->
    <transition name="drawer">
      <div v-if="showDrawer"
        class="fixed inset-y-0 right-0 w-full sm:w-120 bg-opacity-70 backdrop-filter backdrop-blur-xl shadow-2xl z-50 overflow-hidden flex flex-col"
        :class="[isDarkMode ? 'bg-gray-900' : 'bg-white']">
        <div class="flex justify-between items-center p-6 border-b"
          :class="[isDarkMode ? 'border-gray-700' : 'border-gray-200']">
          <h3 class="text-2xl font-bold" :class="[isDarkMode ? 'text-white' : 'text-gray-800']">
            发件记录
          </h3>
          <button @click="toggleDrawer" class="hover:text-white transition duration-300"
            :class="[isDarkMode ? 'text-gray-400' : 'text-gray-800']">
            <XIcon class="w-6 h-6" />
          </button>
        </div>
        <div class="flex-grow overflow-y-auto p-6">
          <transition-group name="list" tag="div" class="space-y-4">
            <div v-for="record in sendRecords" :key="record.id"
              class="bg-opacity-50 rounded-lg p-4 flex items-center shadow-md hover:shadow-lg transition duration-300 transform hover:scale-102"
              :class="[isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-white']">
              <div class="flex-shrink-0 mr-4">
                <FileIcon class="w-10 h-10" :class="[isDarkMode ? 'text-indigo-400' : 'text-indigo-600']" />
              </div>
              <div class="flex-grow min-w-0 mr-4">
                <p class="font-medium text-lg truncate" :class="[isDarkMode ? 'text-white' : 'text-gray-800']">
                  {{ record.filename ? record.filename : 'Text' }}
                </p>
                <p class="text-sm truncate" :class="[isDarkMode ? 'text-gray-400' : 'text-gray-600']">
                  {{ record.date }} · {{ record.size }}
                </p>
              </div>
              <div class="flex-shrink-0 flex space-x-2">
                <button @click="copyRetrieveLink(record.retrieveCode)"
                  class="p-2 rounded-full hover:bg-opacity-20 transition duration-300" :class="[
                    isDarkMode
                      ? 'hover:bg-blue-400 text-blue-400'
                      : 'hover:bg-blue-100 text-blue-600'
                  ]">
                  <ClipboardCopyIcon class="w-5 h-5" />
                </button>
                <button @click="viewDetails(record)"
                  class="p-2 rounded-full hover:bg-opacity-20 transition duration-300" :class="[
                    isDarkMode
                      ? 'hover:bg-green-400 text-green-400'
                      : 'hover:bg-green-100 text-green-600'
                  ]">
                  <EyeIcon class="w-5 h-5" />
                </button>
                <button @click="deleteRecord(record.id)"
                  class="p-2 rounded-full hover:bg-opacity-20 transition duration-300" :class="[
                    isDarkMode ? 'hover:bg-red-400 text-red-400' : 'hover:bg-red-100 text-red-600'
                  ]">
                  <TrashIcon class="w-5 h-5" />
                </button>
              </div>
            </div>
          </transition-group>
        </div>
      </div>
    </transition>

    <!-- 记录详情弹窗 -->
    <transition name="fade">
      <div v-if="selectedRecord" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div
          class="p-8 rounded-2xl max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 ease-out backdrop-filter backdrop-blur-lg bg-opacity-70"
          :class="[isDarkMode ? 'bg-gray-800' : 'bg-white']">
          <h3 class="text-2xl font-bold mb-6" :class="[isDarkMode ? 'text-white' : 'text-gray-800']">
            文件详情
          </h3>
          <div class="space-y-4">
            <div class="flex items-center">
              <FileIcon class="w-6 h-6 mr-3" :class="[isDarkMode ? 'text-indigo-400' : 'text-indigo-600']" />
              <p :class="[isDarkMode ? 'text-gray-300' : 'text-gray-800']">
                <span class="font-medium">文件名：</span>{{ selectedRecord.filename }}
              </p>
            </div>
            <div class="flex items-center">
              <CalendarIcon class="w-6 h-6 mr-3" :class="[isDarkMode ? 'text-indigo-400' : 'text-indigo-600']" />
              <p :class="[isDarkMode ? 'text-gray-300' : 'text-gray-800']">
                <span class="font-medium">发送日期：</span>{{ selectedRecord.date }}
              </p>
            </div>
            <div class="flex items-center">
              <HardDriveIcon class="w-6 h-6 mr-3" :class="[isDarkMode ? 'text-indigo-400' : 'text-indigo-600']" />
              <p :class="[isDarkMode ? 'text-gray-300' : 'text-gray-800']">
                <span class="font-medium">文件大小：</span>{{ selectedRecord.size }}
              </p>
            </div>
            <div class="flex items-center">
              <ClockIcon class="w-6 h-6 mr-3" :class="[isDarkMode ? 'text-indigo-400' : 'text-indigo-600']" />
              <p :class="[isDarkMode ? 'text-gray-300' : 'text-gray-800']">
                <span class="font-medium">过期时间：</span>{{ selectedRecord.expiration }}
              </p>
            </div>
          </div>

          <!-- 取件码和二维码部分 -->
          <div class="mt-6 flex justify-between items-center">
            <div class="flex flex-col items-center w-1/2 pr-2">
              <h4 class="text-lg font-semibold mb-3" :class="[isDarkMode ? 'text-white' : 'text-gray-800']">
                取件码
              </h4>
              <div
                class="bg-gray-100 p-3 rounded-lg shadow-md cursor-pointer hover:bg-gray-200 transition-colors duration-300 w-full text-center"
                @click="copyRetrieveCode(selectedRecord.retrieveCode)">
                <p class="text-2xl font-bold text-indigo-600">{{ selectedRecord.retrieveCode }}</p>
              </div>
              <p class="mt-2 text-sm" :class="[isDarkMode ? 'text-gray-400' : 'text-gray-600']">
                点击复制取件码
              </p>
            </div>
            <div class="flex flex-col items-center w-1/2 pl-2">
              <h4 class="text-lg font-semibold mb-3" :class="[isDarkMode ? 'text-white' : 'text-gray-800']">
                二维码
              </h4>
              <div class="bg-white p-2 rounded-lg shadow-md">
                <QRCode :value="getQRCodeValue(selectedRecord)" :size="128" level="M" />
              </div>
              <p class="mt-2 text-sm" :class="[isDarkMode ? 'text-gray-400' : 'text-gray-600']">
                扫描二维码快速取件
              </p>
            </div>
          </div>

          <button @click="selectedRecord = null"
            class="mt-8 w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-300 transform hover:scale-105">
            关闭
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, computed } from 'vue'
import {
  UploadCloudIcon,
  SendIcon,
  ClipboardListIcon,
  XIcon,
  TrashIcon,
  FileIcon,
  CalendarIcon,
  HardDriveIcon,
  ClockIcon,
  EyeIcon,
  ShieldCheckIcon,
  ClipboardCopyIcon
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import BorderProgressBar from '@/components/common/BorderProgressBar.vue'
import QRCode from 'qrcode.vue'
import SparkMD5 from 'spark-md5'
import { useFileDataStore } from '../stores/fileData'
import api from '@/utils/api'
import { copyRetrieveLink, copyRetrieveCode } from '@/utils/clipboard'
import { getStorageUnit } from '@/utils/convert'

const config: any = JSON.parse(localStorage.getItem('config') || '{}')

const router = useRouter()
const isDarkMode = inject('isDarkMode')
const fileDataStore = useFileDataStore()

const sendType = ref('file')
const selectedFile = ref<File | null>(null)
const textContent = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const expirationMethod = ref('day')
const expirationValue = ref('1')
const uploadProgress = ref(0)
const showDrawer = ref(false)
const selectedRecord = ref<any>(null)
import { useAlertStore } from '@/stores/alertStore'

const alertStore = useAlertStore()
const sendRecords = computed(() => fileDataStore.shareData)

// 新增状态
const fileHash = ref('')

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
    fileHash.value = await calculateFileHash(selectedFile.value)
    // startChunkUpload()
  }
}

const handleFileDrop = async (event: DragEvent) => {
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    selectedFile.value = event.dataTransfer.files[0]
    fileHash.value = await calculateFileHash(selectedFile.value)
  }
}

const calculateFileHash = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const chunkSize = 2097152
    const spark = new SparkMD5.ArrayBuffer()
    const fileReader = new FileReader()

    let currentChunk = 0
    const chunks = Math.ceil(file.size / chunkSize)

    fileReader.onload = (e) => {
      spark.append(e.target!.result as ArrayBuffer)
      currentChunk++

      if (currentChunk < chunks) {
        loadNext()
      } else {
        resolve(spark.end())
      }
    }

    const loadNext = () => {
      const start = currentChunk * chunkSize
      const end = start + chunkSize >= file.size ? file.size : start + chunkSize
      fileReader.readAsArrayBuffer(file.slice(start, end))
    }

    loadNext()
  })
}

const getPlaceholder = (value: string = expirationMethod.value) => {
  switch (value) {
    case 'day':
      return '输入天数'
    case 'hour':
      return '输入小时数'
    case 'minute':
      return '输入分钟数'
    case 'count':
      return '输入查看次数'
    case 'forever':
      return '永久'
    default:
      return '输入值'
  }
}

const getUnit = (value: string = expirationMethod.value) => {
  switch (value) {
    case 'day':
      return '天'
    case 'hour':
      return '小时'
    case 'minute':
      return '分钟'
    case 'count':
      return '次'
    case 'forever':
      return '永久'
    default:
      return ''
  }
}

const handleSubmit = async () => {
  if (sendType.value === 'file' && !selectedFile.value) {
    alertStore.showAlert('请选择要上传的文件', 'error')
    return
  }
  if (sendType.value === 'text' && !textContent.value.trim()) {
    alertStore.showAlert('请输入要发送的文本', 'error')
    return
  }
  if (expirationMethod.value !== 'forever' && !expirationValue.value) {
    alertStore.showAlert('请输入过期值', 'error')
    return
  }

  try {
    let response: any
    const formData = new FormData()
    const isFile = sendType.value === 'file'
    if (isFile) {
      formData.append('file', selectedFile.value!)
    } else {
      formData.append('text', textContent.value)
      // const textBlob = new Blob([textContent.value], { type: 'text/plain' })
      // formData.append('file', textBlob, 'text_content.txt')
    }

    if (expirationMethod.value !== 'forever') {
      formData.append('expire_value', expirationValue.value)
    }
    formData.append('expire_style', expirationMethod.value)

    // 添加上传进度监听
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent: any) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        uploadProgress.value = percentCompleted
      }
    }
    if (isFile) {
      response = await api.post('/share/file/', formData, config)
    } else {
      response = await api.post('/share/text/', formData, config)
    }

    if (response && response.code === 200) {
      const retrieveCode = response.detail.code
      const fileName = response.detail.name
      // 添加新的发送记录
      const newRecord = {
        id: Date.now(),
        filename: fileName,
        date: new Date().toISOString().split('T')[0],
        size:
          sendType.value === 'text'
            ? `${(textContent.value.length / 1024).toFixed(2)} KB`
            : `${(selectedFile.value!.size / (1024 * 1024)).toFixed(1)} MB`,
        expiration:
          expirationMethod.value === 'forever'
            ? '永久'
            : `${expirationValue.value}${getUnit()}后过期`,
        retrieveCode: retrieveCode
      }
      fileDataStore.addShareData(newRecord)

      // 显示发送成功消息
      alertStore.showAlert(`文件发送成功！取件码：${retrieveCode}`, 'success')
      // 重置表单
      selectedFile.value = null
      textContent.value = ''
      expirationValue.value = ''
      uploadProgress.value = 0

      // 自动打开抽屉
      showDrawer.value = true

      // 自动复制取件码链接
      await copyRetrieveLink(retrieveCode)
    } else {
      throw new Error('服务器响应异常')
    }
  } catch (error: any) {
    console.error('发送失败:', error)
    if (error.response.data.detail) {
      alertStore.showAlert(error.response.data.detail, 'error')
    } else {
      alertStore.showAlert('发送失败,请稍后重试', 'error')
    }
  } finally {
    // 确保无论成功还是失败,最后都重置进度条
    uploadProgress.value = 0
  }
}

const toRetrieve = () => {
  router.push('/')
}

const toggleDrawer = () => {
  showDrawer.value = !showDrawer.value
}

const viewDetails = (record: any) => {
  selectedRecord.value = record
}

const deleteRecord = (id: number) => {
  const index = fileDataStore.shareData.findIndex((record: any) => record.id === id)
  if (index !== -1) {
    fileDataStore.deleteShareData(index)
  }
}
const baseUrl = window.location.origin + '/#/'
const getQRCodeValue = (record: any) => {
  return `${baseUrl}?code=${record.retrieveCode}`
}

// 使用 onMounted 钩子延迟加载一些非关键资源或初始化
onMounted(() => {
  // 这里可以放置一些非立即需要的初始化代码
  console.log('SendFileView mounted')
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (min-width: 640px) {
  .sm\:w-120 {
    width: 30rem;
    /* 480px */
  }
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
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
