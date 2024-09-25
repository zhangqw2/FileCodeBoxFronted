<template>
  <div class="min-h-screen flex items-center justify-center p-4 overflow-hidden transition-colors duration-300">
    <div
      class="rounded-3xl shadow-2xl overflow-hidden border p-8 w-full max-w-md transition-colors duration-300"
      :class="[
        isDarkMode 
          ? 'bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl border-gray-700' 
          : 'bg-white border-gray-200'
      ]"
    >
      <h2
        class="text-3xl font-extrabold text-center mb-8 cursor-pointer transition-colors duration-300"
        :class="[
          isDarkMode
            ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300'
            : 'text-indigo-600'
        ]"
        @click="toRetrieve" 
      >
        FileCodeBox
      </h2>
      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- 发送类型选择 -->
        <div class="flex justify-center space-x-4 mb-6">
          <button
            type="button"
            @click="sendType = 'file'"
            :class="[
              'px-4 py-2 rounded-lg',
              sendType === 'file' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'
            ]"
          >
            发送文件
          </button>
          <button
            type="button"
            @click="sendType = 'text'"
            :class="[
              'px-4 py-2 rounded-lg',
              sendType === 'text' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'
            ]"
          >
            发送文本
          </button>
        </div>

        <div class="grid grid-cols-1 gap-8">
          <!-- 文件上传区域 -->
          <div
            v-if="sendType === 'file'"
            class="rounded-xl p-6 flex flex-col items-center justify-center border-2 border-dashed transition-all duration-300 group cursor-pointer"
            :class="[
              isDarkMode
                ? 'bg-gray-800 bg-opacity-50 border-gray-600 hover:border-indigo-500'
                : 'bg-gray-100 border-gray-300 hover:border-indigo-500'
            ]"
            @click="triggerFileUpload"
            @dragover.prevent
            @drop.prevent="handleFileDrop"
          >
            <input
              id="file-upload"
              type="file"
              class="hidden"
              @change="handleFileUpload"
              ref="fileInput"
            />
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
                'mt-4 text-sm transition-colors duration-300',
                isDarkMode
                  ? 'text-gray-400 group-hover:text-indigo-400'
                  : 'text-gray-600 group-hover:text-indigo-600'
              ]"
            >
              {{ selectedFile ? selectedFile.name : '点击或拖放文件到此处上传' }}
            </p>
            <p :class="['mt-2 text-xs', isDarkMode ? 'text-gray-500' : 'text-gray-400']">
              支持各种常见格式，最大20MB
            </p>
          </div>

          <!-- 文本输入区域 -->
          <div v-if="sendType === 'text'" class="flex flex-col">
            <label for="text-content" :class="['text-sm font-medium mb-2', isDarkMode ? 'text-gray-300' : 'text-gray-700']">
              文本内容
            </label>
            <textarea
              id="text-content"
              v-model="textContent"
              rows="8"
              :class="[
                'flex-grow px-4 py-3 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 resize-none',
                isDarkMode
                  ? 'bg-gray-800 bg-opacity-50 text-white'
                  : 'bg-white text-gray-900 border border-gray-300'
              ]"
              placeholder="在此输入要发送的文本..."
            ></textarea>
          </div>
        </div>

        <!-- 过期方式选择 -->
        <div class="flex flex-col space-y-4">
          <label :class="['text-sm font-medium', isDarkMode ? 'text-gray-300' : 'text-gray-700']">过期方式</label>
          <select
            v-model="expirationMethod"
            :class="[
              'px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500',
              isDarkMode
                ? 'bg-gray-800 bg-opacity-50 text-white'
                : 'bg-white text-gray-900 border border-gray-300'
            ]"
          >
            <option value="time">按时间</option>
            <option value="views">按查看次数</option>
          </select>
          <input
            v-if="expirationMethod === 'time'"
            v-model="expirationTime"
            type="number"
            placeholder="过期时间（小时）"
            :class="[
              'px-4 py-2 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500',
              isDarkMode
                ? 'bg-gray-800 bg-opacity-50 text-white'
                : 'bg-white text-gray-900 border border-gray-300'
            ]"
          />
          <input
            v-if="expirationMethod === 'views'"
            v-model="expirationViews"
            type="number"
            placeholder="查看次数"
            :class="[
              'px-4 py-2 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500',
              isDarkMode
                ? 'bg-gray-800 bg-opacity-50 text-white'
                : 'bg-white text-gray-900 border border-gray-300'
            ]"
          />
        </div>
        <!-- 提交按钮 -->
        <button
          type="submit"
          class="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg relative overflow-hidden group"
        >
          <span
            class="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"
          ></span>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { UploadCloudIcon, SendIcon } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()
// 修改这里：使用 inject 来获取 isDarkMode
const isDarkMode = inject('isDarkMode')

const sendType = ref('file')
const selectedFile:any = ref(null)
const textContent = ref('')
const fileInput:any = ref(null)
const expirationMethod = ref('time')
const expirationTime = ref('')
const expirationViews = ref('')
const triggerFileUpload = () => {
  fileInput.value.click()
}

const handleFileUpload = (event:any) => {
  selectedFile.value = event.target.files[0]
}

const handleFileDrop = (event:any) => {
  selectedFile.value = event.dataTransfer.files[0]
}
const handleSubmit = () => {
  if (sendType.value === 'file' && !selectedFile.value) {
    alert('请选择要上传的文件')
    return
  }
  if (sendType.value === 'text' && !textContent.value.trim()) {
    alert('请输入要发送的文本')
    return
  }
  if (expirationMethod.value === 'time' && !expirationTime.value) {
    alert('请输入过期时间')
    return
  }
  if (expirationMethod.value === 'views' && !expirationViews.value) {
    alert('请输入查看次数')
    return
  }

  // 这里处理文件/文本上传和过期设置的逻辑
  console.log('Send Type:', sendType.value)
  console.log('Selected File:', selectedFile.value)
  console.log('Text Content:', textContent.value)
  console.log('Expiration Method:', expirationMethod.value)
  console.log('Expiration Time:', expirationTime.value)
  console.log('Expiration Views:', expirationViews.value)
}

const toRetrieve = () => {
  router.push('/')
}
</script>