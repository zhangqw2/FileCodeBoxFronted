<template>
  <div>
    <h2 class="text-2xl font-bold mb-6" :class="[isDarkMode ? 'text-white' : 'text-gray-800']">
      文件管理
    </h2>

    <!-- 添加文件操作栏 -->
    <div class="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <!-- 搜索和过滤 -->
      <div class="flex flex-1 gap-4">
        <div class="relative flex-1">
          <input
            type="text"
            v-model="fileSearchQuery"
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

        <select
          v-model="fileTypeFilter"
          :class="[
            isDarkMode
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-white border-gray-300 text-gray-900'
          ]"
          class="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">所有类型</option>
          <option value="PDF">PDF</option>
          <option value="Image">图片</option>
          <option value="Video">视频</option>
          <option value="Document">文档</option>
        </select>
      </div>

      <!-- 上传按钮 -->
      <div class="flex gap-4">
        <button
          @click="$refs.fileInput.click()"
          class="flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200"
        >
          <UploadIcon class="w-5 h-5 mr-2" />
          上传文件
        </button>
        <input ref="fileInput" type="file" multiple class="hidden" @change="handleFileUpload" />
      </div>
    </div>

    <!-- 拖拽上传区域 -->
    <div
      v-if="showDropZone"
      class="mb-6 border-2 border-dashed rounded-lg p-8 text-center"
      :class="[isDarkMode ? 'border-gray-600 bg-gray-800/50' : 'border-gray-300 bg-gray-50']"
      @drop.prevent="handleFileDrop"
      @dragover.prevent="showDropZone = true"
      @dragleave.prevent="showDropZone = false"
    >
      <UploadCloudIcon
        class="mx-auto w-12 h-12 mb-4"
        :class="[isDarkMode ? 'text-gray-400' : 'text-gray-500']"
      />
      <p :class="[isDarkMode ? 'text-gray-300' : 'text-gray-700']">拖拽文件到此处上传</p>
    </div>

    <!-- File List -->
    <div
      class="rounded-lg shadow-md overflow-hidden transition-colors duration-300"
      :class="[isDarkMode ? 'bg-gray-800 bg-opacity-70' : 'bg-white']"
    >
      <div class="px-6 py-4 border-b" :class="[isDarkMode ? 'border-gray-700' : 'border-gray-200']">
        <h3 class="text-lg font-medium" :class="[isDarkMode ? 'text-white' : 'text-gray-800']">
          所有文件
        </h3>
      </div>
      <div class="overflow-x-auto">
        <table
          class="min-w-full divide-y"
          :class="[isDarkMode ? 'divide-gray-700' : 'divide-gray-200']"
        >
          <thead :class="[isDarkMode ? 'bg-gray-900' : 'bg-gray-100']">
            <tr>
              <th
                v-for="header in fileTableHeaders"
                :key="header"
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="[isDarkMode ? 'text-gray-400' : 'text-gray-500']"
              >
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody
            :class="[
              isDarkMode
                ? 'bg-gray-800 divide-y divide-gray-700'
                : 'bg-white divide-y divide-gray-200'
            ]"
          >
            <tr v-for="file in files" :key="file.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <FileIcon
                    class="w-5 h-5 mr-2"
                    :class="[isDarkMode ? 'text-indigo-400' : 'text-indigo-500']"
                  />
                  <span class="font-medium" :class="[isDarkMode ? 'text-white' : 'text-gray-900']">
                    {{ file.name }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[isDarkMode ? 'text-gray-400' : 'text-gray-500']">
                  {{ file.size }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[isDarkMode ? 'text-gray-400' : 'text-gray-500']">
                  {{ file.type }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[isDarkMode ? 'text-gray-400' : 'text-gray-500']">
                  {{ file.lastModified }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="downloadFile(file)"
                  class="mr-3 transition-colors duration-200"
                  :class="[
                    isDarkMode
                      ? 'text-indigo-400 hover:text-indigo-300'
                      : 'text-indigo-600 hover:text-indigo-900'
                  ]"
                >
                  下载
                </button>
                <button
                  @click="deleteFile(file)"
                  class="transition-colors duration-200"
                  :class="[
                    isDarkMode
                      ? 'text-red-400 hover:text-red-300'
                      : 'text-red-600 hover:text-red-900'
                  ]"
                >
                  删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 在文件列表表格下方添加分页组件 -->
    <div
      class="mt-4 flex items-center justify-between px-6 py-3 border-t"
      :class="[isDarkMode ? 'border-gray-700' : 'border-gray-200']"
    >
      <!-- 分页信息 -->
      <div
        class="flex items-center text-sm"
        :class="[isDarkMode ? 'text-gray-400' : 'text-gray-500']"
      >
        显示第 {{ (params.page - 1) * params.size + 1 }} 到
        {{ Math.min(params.page * params.size, params.total) }} 条，共 {{ params.total }} 条
      </div>

      <!-- 分页控制器 -->
      <div class="flex items-center space-x-2">
        <!-- 上一页 -->
        <button
          @click="handlePageChange(params.page - 1)"
          :disabled="params.page === 1"
          class="px-3 py-1 rounded-md transition-colors duration-200"
          :class="[
            isDarkMode
              ? params.page === 1
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : params.page === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          上一页
        </button>

        <!-- 页码 -->
        <div class="flex items-center space-x-1">
          <template v-for="pageNum in displayedPages" :key="pageNum">
            <button
              v-if="pageNum !== '...'"
              @click="handlePageChange(pageNum)"
              class="px-3 py-1 rounded-md transition-colors duration-200"
              :class="[
                params.page === pageNum
                  ? 'bg-indigo-600 text-white'
                  : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ pageNum }}
            </button>
            <span v-else class="px-2" :class="[isDarkMode ? 'text-gray-400' : 'text-gray-500']">
              ...
            </span>
          </template>
        </div>

        <!-- 下一页 -->
        <button
          @click="handlePageChange(params.page + 1)"
          :disabled="params.page >= totalPages"
          class="px-3 py-1 rounded-md transition-colors duration-200"
          :class="[
            isDarkMode
              ? params.page >= totalPages
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : params.page >= totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, computed } from 'vue'
const isDarkMode = inject('isDarkMode')

// 新增的响应式变量
const fileSearchQuery = ref('')
const fileTypeFilter = ref('')
const showDropZone = ref(false)

const handleFileUpload = (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (files && files.length > 0) {
    console.log('Uploading files:', files)
  }
}

interface File {
  id: number
  name: string
  size: string
  type: string
  lastModified: string
}

const fileTableHeaders = ['名称', '大小', '类型', '最后修改', '操作']

const files: File[] = [
  { id: 1, name: 'document.pdf', size: '2.5 MB', type: 'PDF', lastModified: '2024-01-15' },
  { id: 2, name: 'image.jpg', size: '1.8 MB', type: 'Image', lastModified: '2024-01-14' },
  {
    id: 3,
    name: 'spreadsheet.xlsx',
    size: '3.2 MB',
    type: 'Spreadsheet',
    lastModified: '2024-01-13'
  },
  {
    id: 4,
    name: 'presentation.pptx',
    size: '5.1 MB',
    type: 'Presentation',
    lastModified: '2024-01-12'
  },
  { id: 5, name: 'video.mp4', size: '15.7 MB', type: 'Video', lastModified: '2024-01-11' }
]

const handleFileDrop = (event: any) => {
  const files = (event.dataTransfer as DataTransfer).files
  if (files && files.length > 0) {
    console.log('Dropped files:', files)
  }
}

// 分页参数
const params = ref({
  page: 1,
  size: 10,
  total: 0
})

// 计算总页数
const totalPages = computed(() => Math.ceil(params.value.total / params.value.size))

const downloadFile = (file: File) => {
  console.log('Downloading file:', file.name)
}

const deleteFile = (file: File) => {
  console.log('Deleting file:', file.name)
}

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

// 页码改变处理函数
const handlePageChange = async (page: any) => {
  if (page < 1 || page > totalPages.value) return
  params.value.page = page
  await loadFiles() // 重新加载文件列表
}

// 加载文件列表
const loadFiles = async () => {
  try {
    params.value.total = 85
    // 更新文件列表数据...
  } catch (error) {
    console.error('加载文件列表失败:', error)
    // 处理错误...
  }
}
</script>
