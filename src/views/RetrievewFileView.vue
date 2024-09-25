<template>
  <div class="min-h-screen flex items-center justify-center p-4 overflow-hidden transition-colors duration-300">
    <div class="w-full max-w-md relative z-10">
      <div 
        class="rounded-3xl shadow-2xl overflow-hidden border transform transition-all duration-300"
        :class="[
          isDarkMode 
            ? 'bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl border-gray-700' 
            : 'bg-white border-gray-200'
        ]"
      >
        <div class="p-8">
          <div class="flex justify-center mb-8">
            <div class="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 animate-spin-slow">
              <div class="rounded-full bg-gray-900 p-2">
                <BoxIcon class="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <h2 @click="toSend"  class="text-3xl cursor-pointer font-extrabold text-center mb-6" :class="[isDarkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300' : 'text-indigo-600']">FileCodeBox</h2>
          <form @submit.prevent="handleSubmit">
            <div class="mb-6 relative">
              <label for="password" class="block text-sm font-medium mb-2" :class="[isDarkMode ? 'text-gray-300' : 'text-gray-800']">取件口令</label>
              <div class="relative">
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  class="w-full px-4 py-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 pr-10"
                  :class="[isDarkMode ? 'bg-gray-700 bg-opacity-50' : 'bg-gray-100', { 'ring-2 ring-red-500': error }]"
                  placeholder="请输入您的口令"
                  required
                  @focus="isInputFocused = true"
                  @blur="isInputFocused = false"
                />
                <button
                  @click="togglePasswordVisibility"
                  type="button"
                  class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-white focus:outline-none"
                >
                  <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                  <EyeOffIcon v-else class="w-5 h-5" />
                </button>
              </div>
              <div class="absolute -bottom-0.5 left-2 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 ease-in-out" :class="{'w-97-100': isInputFocused, 'w-0': !isInputFocused}"></div>
              <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
            </div>
            <button
              type="submit"
              class="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-3 px-4 rounded-lg hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-300 transform hover:scale-105 hover:shadow-lg relative overflow-hidden group"
            >
              <span class="flex items-center justify-center relative z-10">
                <span>提取文件</span>
                <ArrowRightIcon class="w-5 h-5 ml-2 transition-transform duration-300 transform group-hover:translate-x-1" />
              </span>
              <span class="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
          </form>
          
          <!-- 添加一个新的按钮用于导航到发送文件页面 -->
          <div class="mt-6 text-center">
            <router-link to="/send" class="text-indigo-400 hover:text-indigo-300 transition duration-300">
              需要发送文件？点击这里
            </router-link>
          </div>
        </div>
        <div class="px-8 py-4 bg-opacity-50 flex justify-between items-center" :class="[isDarkMode ? 'bg-gray-800' : 'bg-gray-100']">
          <span class="text-sm flex items-center" :class="[isDarkMode ? 'text-gray-300' : 'text-gray-800']">
            <ShieldCheckIcon class="w-4 h-4 mr-1 text-green-400" />
            安全加密
          </span>
          <button @click="toggleDrawer" class="text-sm hover:text-indigo-300 transition duration-300 flex items-center" :class="[isDarkMode ? 'text-indigo-400' : 'text-indigo-600']">
            取件记录
            <ClipboardListIcon class="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>

    <!-- 抽屉式取件记录 -->
    <transition name="drawer">
      <div v-if="showDrawer" class="fixed inset-y-0 right-0 w-full sm:w-96 bg-opacity-70 backdrop-filter backdrop-blur-xl shadow-2xl z-50 overflow-hidden flex flex-col" :class="[isDarkMode ? 'bg-gray-900' : 'bg-white']">
        <div class="flex justify-between items-center p-6 border-b" :class="[isDarkMode ? 'border-gray-700' : 'border-gray-200']">
          <h3 class="text-2xl font-bold" :class="[isDarkMode ? 'text-white' : 'text-gray-800']">取件记录</h3>
          <button @click="toggleDrawer" class="hover:text-white transition duration-300" :class="[isDarkMode ? 'text-gray-400' : 'text-gray-800']">
            <XIcon class="w-6 h-6" />
          </button>
        </div>
        <div class="flex-grow overflow-y-auto p-6">
          <transition-group name="list" tag="div" class="space-y-4">
            <div v-for="record in records" :key="record.id" class="bg-opacity-50 rounded-lg p-4 flex justify-between items-center shadow-md hover:shadow-lg transition duration-300 transform hover:scale-102" :class="[isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-white']">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <FileIcon class="w-10 h-10" :class="[isDarkMode ? 'text-indigo-400' : 'text-indigo-600']" />
                </div>
                <div>
                  <p class="font-medium text-lg" :class="[isDarkMode ? 'text-white' : 'text-gray-800']">{{ record.filename }}</p>
                  <p class="text-sm" :class="[isDarkMode ? 'text-gray-400' : 'text-gray-600']">{{ record.date }} · {{ record.size }}</p>
                </div>
              </div>
              <div class="flex space-x-2">
                <button @click="viewDetails(record)" class="p-2 rounded-full hover:bg-opacity-20 transition duration-300" :class="[isDarkMode ? 'hover:bg-indigo-400 text-indigo-400' : 'hover:bg-indigo-100 text-indigo-600']">
                  <EyeIcon class="w-5 h-5" />
                </button>
                <button @click="deleteRecord(record.id)" class="p-2 rounded-full hover:bg-opacity-20 transition duration-300" :class="[isDarkMode ? 'hover:bg-red-400 text-red-400' : 'hover:bg-red-100 text-red-600']">
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
        <div class="p-8 rounded-2xl max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 ease-out backdrop-filter backdrop-blur-lg bg-opacity-70" :class="[isDarkMode ? 'bg-gray-800' : 'bg-white']">          <h3 class="text-2xl font-bold mb-6" :class="[isDarkMode ? 'text-white' : 'text-gray-800']">文件详情</h3>
          <div class="space-y-4">
            <div class="flex items-center">
              <FileIcon class="w-6 h-6 mr-3" :class="[isDarkMode ? 'text-indigo-400' : 'text-indigo-600']" />
              <p :class="[isDarkMode ? 'text-gray-300' : 'text-gray-800']"><span class="font-medium">文件名：</span>{{ selectedRecord.filename }}</p>
            </div>
            <div class="flex items-center">
              <CalendarIcon class="w-6 h-6 mr-3" :class="[isDarkMode ? 'text-indigo-400' : 'text-indigo-600']" />
              <p :class="[isDarkMode ? 'text-gray-300' : 'text-gray-800']"><span class="font-medium">取件日期：</span>{{ selectedRecord.date }}</p>
            </div>
            <div class="flex items-center">
              <HardDriveIcon class="w-6 h-6 mr-3" :class="[isDarkMode ? 'text-indigo-400' : 'text-indigo-600']" />
              <p :class="[isDarkMode ? 'text-gray-300' : 'text-gray-800']"><span class="font-medium">文件大小：</span>{{ selectedRecord.size }}</p>
            </div>
            <div class="flex items-center">
              <DownloadIcon class="w-6 h-6 mr-3" :class="[isDarkMode ? 'text-indigo-400' : 'text-indigo-600']" />
              <p :class="[isDarkMode ? 'text-gray-300' : 'text-gray-800']"><span class="font-medium">下载次数：</span>{{ selectedRecord.downloads }}</p>
            </div>
          </div>
          
          <!-- 取件二维码部分 -->
          <div class="mt-6 flex flex-col items-center">
            <h4 class="text-lg font-semibold mb-3" :class="[isDarkMode ? 'text-white' : 'text-gray-800']">取件二维码</h4>
            <div class="bg-white p-2 rounded-lg shadow-md">
              <QRCode :value="getQRCodeValue(selectedRecord)" :size="128" level="M" />
            </div>
            <p class="mt-2 text-sm" :class="[isDarkMode ? 'text-gray-400' : 'text-gray-600']">扫描二维码快速取件</p>
          </div>
          
          <button @click="selectedRecord = null" class="mt-8 w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-300 transform hover:scale-105">
            关闭
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { BoxIcon, EyeIcon, EyeOffIcon, ArrowRightIcon, ShieldCheckIcon, ClipboardListIcon, XIcon, TrashIcon, FileIcon, CalendarIcon, HardDriveIcon, DownloadIcon } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import QRCode from 'qrcode.vue'  // 导入 QRCode 组件

const router = useRouter()
const isDarkMode = inject('isDarkMode')

const password = ref('')
const showPassword = ref(false)
const isInputFocused = ref(false)
const error = ref('')
const selectedRecord = ref(null)
const showDrawer = ref(false)
  
const records = ref([
  { id: 1, filename: '重要文档.pdf', date: '2023-05-15', size: '2.5 MB', downloads: 3, qrCode: 'path/to/qr-code-1.png' },
  { id: 2, filename: '会议记录.docx', date: '2023-05-10', size: '1.2 MB', downloads: 2, qrCode: 'path/to/qr-code-2.png' },
  { id: 3, filename: '财务报表.xlsx', date: '2023-05-05', size: '3.7 MB', downloads: 5, qrCode: 'path/to/qr-code-3.png' },
  { id: 4, filename: '项目计划.pptx', date: '2023-05-01', size: '5.1 MB', downloads: 1, qrCode: 'path/to/qr-code-4.png' },
  { id: 5, filename: '客户名单.csv', date: '2023-04-28', size: '0.8 MB', downloads: 4, qrCode: 'path/to/qr-code-5.png' },
])

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleSubmit = () => {
  if (password.value.length < 6) {
    error.value = '密码长度不能少于6个字符'
    return
  }
  error.value = ''
  // 这里添加提交逻辑
  console.log('提交的口令:', password.value)
  // 模拟添加新记录
  const newRecord = {
    id: records.value.length + 1,
    filename: `新文件${records.value.length + 1}.pdf`,
    date: new Date().toISOString().split('T')[0],
    size: `${Math.random().toFixed(1)} MB`,
    downloads: 0,
    qrCode: `path/to/qr-code-${records.value.length + 1}.png`
  }
  records.value.unshift(newRecord)
  showDrawer.value = true
  
  // 模拟成功取件后的操作
  setTimeout(() => {
    router.push('/send')
  }, 1500)
}

const viewDetails = (record) => {
  selectedRecord.value = record
}

const deleteRecord = (id) => {
  records.value = records.value.filter(record => record.id !== id)
}

const toggleDrawer = () => {
  showDrawer.value = !showDrawer.value
}

const toSend = () => {
  router.push('/send')
}

const getQRCodeValue = (record) => {
  // 这里返回你想要在二维码中编码的信息
  // 例如,可以是一个包含文件ID的URL
  return `https://your-domain.com/retrieve/${record.id}`
}
</script>

<style scoped>
@keyframes blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(20px, -50px) scale(1.1);  }
  50% { transform: translate(-20px, 20px) scale(0.9); }
  75% { transform: translate(50px, 50px) scale(1.05); }
}

.animate-blob-1 { animation: blob 25s infinite; }
.animate-blob-2 { animation: blob 30s infinite; }
.animate-blob-3 { animation: blob 35s infinite; }
.animate-blob-4 { animation: blob 40s infinite; }

.animate-spin-slow {
  animation: spin 8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
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

.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.3s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}
.w-97-100{
  width: 97%;
}
</style>