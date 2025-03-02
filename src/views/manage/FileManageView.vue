<template>
  <div class="p-6 h-screen overflow-y-auto custom-scrollbar">
    <!-- 页面标题和统计信息 -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4" :class="[isDarkMode ? 'text-white' : 'text-gray-800']">
        文件管理
      </h2>
    </div>

    <!-- 搜索和操作栏 -->
    <div class="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-opacity-70 p-4 rounded-lg shadow-sm"
      :class="[isDarkMode ? 'bg-gray-800' : 'bg-white']">
      <div class="flex flex-1 gap-4 w-full sm:w-auto">
        <div class="relative flex-1">
          <input 
            type="text" 
            v-model="params.keyword" 
            @keyup.enter="handleSearch"
            :class="[
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400',
              'w-full pl-10 pr-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
            ]"
            placeholder="搜索文件名称、描述..." 
          />
          <SearchIcon class="absolute left-3 top-3 w-5 h-5" :class="[isDarkMode ? 'text-gray-400' : 'text-gray-500']" />
        </div>
        <button 
          @click="handleSearch"
          class="px-4 py-2.5 rounded-lg inline-flex items-center transition-all duration-200 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
          <SearchIcon class="w-5 h-5 mr-2" />
          搜索
        </button>
      </div>
    </div>

    <!-- 文件列表 -->
    <div class="rounded-lg shadow-sm overflow-hidden transition-all duration-300"
      :class="[isDarkMode ? 'bg-gray-800 bg-opacity-70' : 'bg-white']">
      <div class="px-6 py-4 border-b" :class="[isDarkMode ? 'border-gray-700' : 'border-gray-200']">
        <h3 class="text-lg font-medium" :class="[isDarkMode ? 'text-white' : 'text-gray-800']">
          所有文件
        </h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y" :class="[isDarkMode ? 'divide-gray-700' : 'divide-gray-200']">
          <thead :class="[isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50']">
            <tr>
              <th v-for="header in fileTableHeaders" :key="header"
                class="px-6 py-3.5 text-left text-xs font-medium uppercase tracking-wider"
                :class="[isDarkMode ? 'text-gray-400' : 'text-gray-500']">
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody :class="[
            isDarkMode
              ? 'bg-gray-800/50 divide-y divide-gray-700'
              : 'bg-white divide-y divide-gray-200'
          ]">
            <tr v-for="file in tableData" :key="file.id" 
              class="hover:bg-opacity-50 transition-colors duration-200"
              :class="[isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50']">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span class="font-medium select-all" :class="[isDarkMode ? 'text-white' : 'text-gray-900']">
                    {{ file.code }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center group relative">
                  <FileIcon class="w-5 h-5 mr-2 flex-shrink-0" :class="[isDarkMode ? 'text-indigo-400' : 'text-indigo-500']" />
                  <span class="font-medium truncate max-w-[200px]" :class="[isDarkMode ? 'text-white' : 'text-gray-900']"
                    :title="file.prefix">
                    {{ file.prefix }}
                  </span>
                  <!-- 悬浮提示 -->
                  <div class="absolute left-0 -top-2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div class="bg-gray-900 text-white text-sm rounded px-2 py-1 max-w-xs break-all">
                      {{ file.prefix }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="[isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800']">
                  {{ Math.round((file.size / 1024 / 1024) * 100) / 100 }}MB
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="group relative">
                  <span class="block truncate max-w-[250px]" :class="[isDarkMode ? 'text-gray-400' : 'text-gray-500']">
                    {{ file.text }}
                  </span>
                  <!-- 悬浮提示 -->
                  <div class="absolute left-0 -top-2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                    <div class="bg-gray-900 text-white text-sm rounded px-2 py-1 max-w-xs break-all">
                      {{ file.text }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="[
                    file.expired_at 
                      ? (isDarkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800')
                      : (isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800')
                  ]">
                  {{ file.expired_at ? formatTimestamp(file.expired_at) : '永久' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="deleteFile(file.id)" 
                  class="inline-flex items-center px-3 py-1.5 rounded-md transition-colors duration-200"
                  :class="[
                    isDarkMode
                      ? 'bg-red-900/20 text-red-400 hover:bg-red-900/30'
                      : 'bg-red-50 text-red-600 hover:bg-red-100'
                  ]">
                  <TrashIcon class="w-4 h-4 mr-1.5" />
                  删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页控件 -->
      <div class="mt-4 flex items-center justify-between px-6 py-4 border-t"
        :class="[isDarkMode ? 'border-gray-700' : 'border-gray-200']">
        <div class="flex items-center text-sm" :class="[isDarkMode ? 'text-gray-400' : 'text-gray-500']">
          显示第 {{ (params.page - 1) * params.size + 1 }} 到
          {{ Math.min(params.page * params.size, params.total) }} 条，共 {{ params.total }} 条
        </div>

        <div class="flex items-center space-x-2">
          <button 
            @click="handlePageChange(params.page - 1)" 
            :disabled="params.page === 1"
            class="inline-flex items-center px-3 py-1.5 rounded-md transition-colors duration-200" 
            :class="[
              isDarkMode
                ? params.page === 1
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : params.page === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]">
            <ChevronLeftIcon class="w-4 h-4" />
            上一页
          </button>

          <div class="flex items-center space-x-1">
            <template v-for="pageNum in displayedPages" :key="pageNum">
              <button 
                v-if="pageNum !== '...'" 
                @click="handlePageChange(pageNum)"
                class="inline-flex items-center px-3 py-1.5 rounded-md transition-colors duration-200" 
                :class="[
                  params.page === pageNum
                    ? 'bg-indigo-600 text-white'
                    : isDarkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]">
                {{ pageNum }}
              </button>
              <span
                v-else 
                class="px-2" 
                :class="[isDarkMode ? 'text-gray-400' : 'text-gray-500']">
                ...
              </span>
            </template>
          </div>

          <button 
            @click="handlePageChange(params.page + 1)" 
            :disabled="params.page >= totalPages"
            class="inline-flex items-center px-3 py-1.5 rounded-md transition-colors duration-200" 
            :class="[
              isDarkMode
                ? params.page >= totalPages
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : params.page >= totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]">
            下一页
            <ChevronRightIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, computed } from 'vue'
import api from '@/utils/api'
import { 
  FileIcon, 
  SearchIcon, 
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UploadIcon,
  HardDriveIcon
} from 'lucide-vue-next'
function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const isDarkMode = inject('isDarkMode')
const tableData: any = ref([])

// 修改文件表头
const fileTableHeaders = ['取件码', '名称', '大小', '描述', '过期时间', '操作']

// 分页参数
const params = ref({
  page: 1,
  size: 10,
  total: 0,
  keyword: ''
})

// 下载文件处理
const downloadFile = async (id: number) => {
  try {
    const response = await api({
      url: '/admin/file/download',
      method: 'get',
      params: { id },
      responseType: 'blob'
    })

    const contentDisposition = response.headers['content-disposition']
    let filename = 'file'
    const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
    if (filenameMatch != null && filenameMatch[1]) {
      filename = filenameMatch[1].replace(/['"]/g, '')
    }

    // @ts-ignore
    if (window.showSaveFilePicker) {
      await saveFileByWebApi(response.data, filename)
    } else {
      await saveFileByElementA(response.data, filename)
    }
  } catch (error) {
    console.error('下载失败:', error)
  }
}

// 删除文件处理
const deleteFile = async (id: number) => {
  try {
    await api({
      url: '/admin/file/delete',
      method: 'delete',
      data: { id }
    })
    await loadFiles()
  } catch (error) {
    console.error('删除失败:', error)
  }
}

// 文件保存辅助函数
async function saveFileByElementA(fileBlob: Blob, filename: string) {
  const downloadUrl = window.URL.createObjectURL(fileBlob)
  const link = document.createElement('a')
  link.href = downloadUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  window.URL.revokeObjectURL(downloadUrl)
  document.body.removeChild(link)
}

async function saveFileByWebApi(fileBlob: Blob, filename: string) {
  // @ts-ignore
  const newHandle = await window.showSaveFilePicker({
    suggestedName: filename
  })
  const writableStream = await newHandle.createWritable()
  await writableStream.write(fileBlob)
  await writableStream.close()
}

// 加载文件列表
const loadFiles = async () => {
  try {
    const res: any = await api({
      url: '/admin/file/list',
      method: 'get',
      params: params.value
    })
    tableData.value = res.detail.data
    params.value.total = res.detail.total
  } catch (error) {
    console.error('加载文件列表失败:', error)
  }
}

// 页码改变处理函数
const handlePageChange = async (page: any) => {
  if (page < 1 || page > totalPages.value) return
  params.value.page = page
  await loadFiles()
}

// 初始加载
loadFiles()

// 计算总页数
const totalPages = computed(() => Math.ceil(params.value.total / params.value.size))

// 计算要显示的页码
const displayedPages = computed(() => {
  const current = params.value.page
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

// 添加搜索处理函数
const handleSearch = async () => {
  params.value.page = 1 // 重置页码到第一页
  await loadFiles()
}
</script>
