<template>
    <div class="p-6 h-screen overflow-y-auto custom-scrollbar">
      <h2 class="text-2xl font-bold mb-6" :class="[isDarkMode ? 'text-white' : 'text-gray-800']">
        本地文件管理
      </h2>
  
      <!-- 添加搜索框 -->
      <div class="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div class="relative flex-1">
          <input
            type="text"
            v-model="searchKeyword"
            :class="[
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            ]"
            class="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="搜索文件..."
          />
          <SearchIcon
            class="absolute left-3 top-2.5 w-5 h-5"
            :class="[isDarkMode ? 'text-gray-400' : 'text-gray-500']"
          />
        </div>
        <button
          @click="handleSearch"
          class="flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200"
        >
          <SearchIcon class="w-5 h-5 mr-2" />
          搜索
        </button>
      </div>
  
      <!-- 卡片列表 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="file in paginatedFiles"
          :key="file.name"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-colors duration-300"
        >
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium dark:text-white">{{ file.file }}</h3>
            <span class="text-sm dark:text-gray-400">{{ file.ctime }}</span>
          </div>
          <div class="mb-4">
            <span class="text-sm font-medium dark:text-gray-400">所有者: {{ file.owner }}</span>
          </div>
          <div class="flex justify-end space-x-2">
            <button
              @click="shareLocalFile(file)"
              class="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200"
            >
              分享
            </button>
            <button
              @click="deleteLocalFile(file)"
              class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
            >
              删除
            </button>
          </div>
        </div>
      </div>
  
      <!-- 分页 -->
      <div class="mt-6 flex justify-end items-center">
        <span class="text-sm dark:text-gray-400 mr-4">
          显示第 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, filteredFiles.length) }} 条，共 {{ filteredFiles.length }} 条
        </span>
        <button
          @click="handlePageChange(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded-md transition-colors duration-200"
          :class="[
            isDarkMode
              ? currentPage === 1
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          上一页
        </button>
        <div class="flex justify-center space-x-2 mx-4">
          <button
            v-for="page in displayedPages"
            :key="page"
            @click="handlePageChange(page)"
            :class="[
              'px-3 py-1 rounded-md transition-colors duration-200',
              currentPage === page
                ? 'bg-indigo-600 text-white'
                : isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ page }}
          </button>
        </div>
        <button
          @click="handlePageChange(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 rounded-md transition-colors duration-200"
          :class="[
            isDarkMode
              ? currentPage === totalPages
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          下一页
        </button>
      </div>
  
      <div v-if="dialogFormVisible" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="fixed inset-0 bg-black opacity-50"></div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 z-10 w-96">
          <h3 class="text-lg font-medium mb-4 dark:text-white">分享文件</h3>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1 dark:text-gray-300">文件名</label>
            <input type="text" v-model="form.name" readonly class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1 dark:text-gray-300">过期时间</label>
            <div class="flex">
              <select v-model="form.expireStyle" class="w-1/3 px-3 py-2 border rounded-l-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option value="day">天</option>
                <option value="hour">小时</option>
                <option value="minute">分钟</option>
                <option value="forever">永久</option>
                <option value="count">次数</option>
              </select>
              <input type="number" v-model="form.expireValue" class="w-2/3 px-3 py-2 border rounded-r-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" :disabled="form.expireStyle === 'forever'" />
            </div>
          </div>
          <div class="flex justify-end">
            <button @click="dialogFormVisible = false" class="px-4 py-2 mr-2 rounded-lg bg-gray-300 dark:bg-gray-700 dark:text-white">取消</button>
            <button @click="toShareFile" class="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">确认</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, inject, computed } from 'vue'
  import api from '@/utils/api'
  import { SearchIcon } from 'lucide-vue-next'
  import { useAlertStore } from '@/stores/alertStore'
  
  const isDarkMode = inject('isDarkMode')
  const localFiles: any = ref([])
  const dialogFormVisible = ref(false)
  const form = reactive({
    name: '',
    expireStyle: 'day',
    expireValue: 1,
    relativePath: '' // 新增字段
  })
  const searchKeyword = ref('')
  const alertStore = useAlertStore()
  const currentPage = ref(1)
  const pageSize = ref(6)
  
  const loadLocalFiles = async () => {
    try {
      const data: any = await api({
        url: '/admin/local/lists',
        method: 'get'
      })
      localFiles.value = data.detail
      alertStore.showAlert('加载成功', 'success')
    } catch (error) {
      console.error('加载本地文件列表失败:', error)
      alertStore.showAlert('加载失败', 'error')
    }
  }
  
  const deleteLocalFile = async (file: any) => {
    try {
      await api({
        url: '/admin/local/delete',
        method: 'delete',
        data: { filename: file.file }
      })
      alertStore.showAlert('删除成功', 'success')
      await loadLocalFiles()
    } catch (error) {
      console.error('删除失败:', error)
      alertStore.showAlert('删除失败', 'error')
    }
  }
  
  const shareLocalFile = (file: any) => {
    form.name = file.file
    form.relativePath = file.relative_path // 添加相对位置传参
    dialogFormVisible.value = true
  }
  
  const toShareFile = async () => {
    try {
      const data: any = await api({
        url: '/admin/local/share',
        method: 'post',
        data: {
          filename: form.name,
          expire_style: form.expireStyle,
          expire_value: form.expireValue,
          relative_path: form.relativePath // 传递相对位置
        }
      })
      dialogFormVisible.value = false
      alertStore.showAlert(`Code: ${data.detail.code}`, 'success')
      await loadLocalFiles()
    } catch (error) {
      console.error('分享失败:', error)
      alertStore.showAlert('分享失败', 'error')
    }
  }
  
  const handleSearch = () => {
    // 触发搜索逻辑
  }
  
  const filteredFiles = computed(() => {
    if (!searchKeyword.value) {
      return localFiles.value
    }
    return localFiles.value.filter((file: any) =>
      file.file.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  })
  
  const paginatedFiles = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return filteredFiles.value.slice(start, end)
  })
  
  const totalPages = computed(() => Math.ceil(filteredFiles.value.length / pageSize.value))
  
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
  }
  
  const displayedPages = computed(() => {
    const current = currentPage.value
    const total = totalPages.value
    const delta = 2 // 当前页码前后显示的页码数
  
    let pages: (number | string)[] = []
  
    // 始终显示第一页
    pages.push(1)
  
    // 计算显示范围
    let left = Math.max(2, current - delta)
    let right = Math.min(total - 1, current + delta)
  
    // 添加省略号和页码
    if (left > 2) {
      pages.push('...')
    }
  
    for (let i = left; i <= right; i++) {
      pages.push(i)
    }
  
    if (right < total - 1) {
      pages.push('...')
    }
  
    // 始终显示最后一页
    if (total > 1) {
      pages.push(total)
    }
  
    return pages
  })
  
  loadLocalFiles()
  </script>
  
  <style scoped>
  .file-list {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    padding: 16px;
  }
  
  .file-card {
    align-items: center;
    justify-content: space-between;
    border-radius: 10px;
    transition: all 0.3s ease;
  }
  
  .file-card:hover {
    box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.25);
  }
  
  .file-info {
    flex: 1;
  }
  
  .file-name {
    font-size: 14px;
    font-weight: bold;
    white-space: nowrap;
  }
  
  .file-date {
    font-size: 12px;
    color: #a0a0b2;
  }
  </style>
  