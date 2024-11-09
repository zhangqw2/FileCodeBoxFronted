<template>
  <div
    class="min-h-screen flex flex-col lg:flex-row transition-colors duration-300"
    :class="[isDarkMode ? 'bg-gray-900' : 'bg-gray-50']"
  >
    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-50 w-64 transform transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 border-r"
      :class="[
        isDarkMode
          ? 'bg-gray-800 bg-opacity-90 backdrop-filter backdrop-blur-xl border-gray-700'
          : 'bg-white border-gray-200',
        { '-translate-x-full': !isSidebarOpen }
      ]"
    >
      <!-- Logo区域 -->
      <div
        class="flex items-center justify-between h-16 px-4 border-b"
        :class="[isDarkMode ? 'border-gray-700' : 'border-gray-200']"
      >
        <div class="flex items-center">
          <div
            class="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 animate-spin-slow"
          >
            <div class="rounded-full p-1" :class="[isDarkMode ? 'bg-gray-800' : 'bg-white']">
              <BoxIcon
                class="w-6 h-6"
                :class="[isDarkMode ? 'text-indigo-400' : 'text-indigo-600']"
              />
            </div>
          </div>
          <h1
            class="ml-2 text-xl font-semibold"
            :class="[isDarkMode ? 'text-white' : 'text-gray-800']"
          >
            FileCodeBox
          </h1>
        </div>
        <button @click="toggleSidebar" class="lg:hidden">
          <XIcon class="w-6 h-6" :class="[isDarkMode ? 'text-gray-400' : 'text-gray-600']" />
        </button>
      </div>

      <!-- 导航菜单 -->
      <nav class="flex-1 overflow-y-auto">
        <ul class="p-4 space-y-2">
          <li v-for="item in menuItems" :key="item.id">
            <a
              href="#"
              @click="currentSection = item.id"
              class="flex items-center p-2 rounded-lg transition-colors duration-200"
              :class="[
                currentSection === item.id
                  ? isDarkMode
                    ? 'bg-indigo-900 text-indigo-400'
                    : 'bg-indigo-100 text-indigo-600'
                  : isDarkMode
                    ? 'text-gray-400 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
              ]"
            >
              <component :is="item.icon" class="w-5 h-5 mr-3" />
              {{ item.name }}
            </a>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-h-screen">
      <!-- Header -->
      <header
        class="shadow-md border-b transition-colors duration-300"
        :class="[isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200']"
      >
        <div class="flex items-center justify-between h-16 px-4">
          <button @click="toggleSidebar" class="lg:hidden">
            <MenuIcon class="w-6 h-6" :class="[isDarkMode ? 'text-gray-400' : 'text-gray-600']" />
          </button>
        </div>
      </header>

      <!-- Content -->
      <main
        class="flex-1 p-6 overflow-y-auto transition-colors duration-300"
        :class="[isDarkMode ? 'bg-gray-900' : 'bg-gray-50']"
      >
        <div v-if="currentSection === 'dashboard'">
          <h2
            class="text-2xl font-bold mb-6"
            :class="[isDarkMode ? 'text-white' : 'text-gray-800']"
          >
            仪表盘
          </h2>

          <!-- 统计卡片区域 -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div
              class="p-6 rounded-lg shadow-md transition-colors duration-300"
              :class="[isDarkMode ? 'bg-gray-800 bg-opacity-70' : 'bg-white']"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm" :class="[isDarkMode ? 'text-gray-400' : 'text-gray-600']">
                    总文件数
                  </p>
                  <h3
                    class="text-2xl font-bold mt-1"
                    :class="[isDarkMode ? 'text-white' : 'text-gray-800']"
                  >
                    128
                  </h3>
                </div>
                <div
                  class="p-3 rounded-full"
                  :class="[isDarkMode ? 'bg-indigo-900' : 'bg-indigo-100']"
                >
                  <FileIcon
                    class="w-6 h-6"
                    :class="[isDarkMode ? 'text-indigo-400' : 'text-indigo-600']"
                  />
                </div>
              </div>
              <p class="text-sm mt-2" :class="[isDarkMode ? 'text-green-400' : 'text-green-600']">
                <span>↑ 12% </span>
                <span :class="[isDarkMode ? 'text-gray-400' : 'text-gray-600']">较上月</span>
              </p>
            </div>

            <div
              class="p-6 rounded-lg shadow-md transition-colors duration-300"
              :class="[isDarkMode ? 'bg-gray-800 bg-opacity-70' : 'bg-white']"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm" :class="[isDarkMode ? 'text-gray-400' : 'text-gray-600']">
                    存储空间
                  </p>
                  <h3
                    class="text-2xl font-bold mt-1"
                    :class="[isDarkMode ? 'text-white' : 'text-gray-800']"
                  >
                    1.2 TB
                  </h3>
                </div>
                <div
                  class="p-3 rounded-full"
                  :class="[isDarkMode ? 'bg-purple-900' : 'bg-purple-100']"
                >
                  <HardDriveIcon
                    class="w-6 h-6"
                    :class="[isDarkMode ? 'text-purple-400' : 'text-purple-600']"
                  />
                </div>
              </div>
              <div class="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-purple-500" style="width: 75%"></div>
              </div>
              <p class="text-sm mt-2" :class="[isDarkMode ? 'text-gray-400' : 'text-gray-600']">
                已使用 75%
              </p>
            </div>

            <div
              class="p-6 rounded-lg shadow-md transition-colors duration-300"
              :class="[isDarkMode ? 'bg-gray-800 bg-opacity-70' : 'bg-white']"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm" :class="[isDarkMode ? 'text-gray-400' : 'text-gray-600']">
                    活跃用户
                  </p>
                  <h3
                    class="text-2xl font-bold mt-1"
                    :class="[isDarkMode ? 'text-white' : 'text-gray-800']"
                  >
                    25
                  </h3>
                </div>
                <div
                  class="p-3 rounded-full"
                  :class="[isDarkMode ? 'bg-green-900' : 'bg-green-100']"
                >
                  <UsersIcon
                    class="w-6 h-6"
                    :class="[isDarkMode ? 'text-green-400' : 'text-green-600']"
                  />
                </div>
              </div>
              <p class="text-sm mt-2" :class="[isDarkMode ? 'text-red-400' : 'text-red-600']">
                <span>↓ 5% </span>
                <span :class="[isDarkMode ? 'text-gray-400' : 'text-gray-600']">较上周</span>
              </p>
            </div>

            <div
              class="p-6 rounded-lg shadow-md transition-colors duration-300"
              :class="[isDarkMode ? 'bg-gray-800 bg-opacity-70' : 'bg-white']"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm" :class="[isDarkMode ? 'text-gray-400' : 'text-gray-600']">
                    系统状态
                  </p>
                  <h3
                    class="text-2xl font-bold mt-1"
                    :class="[isDarkMode ? 'text-white' : 'text-gray-800']"
                  >
                    正常
                  </h3>
                </div>
                <div class="p-3 rounded-full" :class="[isDarkMode ? 'bg-blue-900' : 'bg-blue-100']">
                  <ActivityIcon
                    class="w-6 h-6"
                    :class="[isDarkMode ? 'text-blue-400' : 'text-blue-600']"
                  />
                </div>
              </div>
              <p class="text-sm mt-2" :class="[isDarkMode ? 'text-gray-400' : 'text-gray-600']">
                服务器运行时间: 30天
              </p>
            </div>
          </div>

          <!-- 最近活动 -->
          <div
            class="rounded-lg shadow-md overflow-hidden transition-colors duration-300"
            :class="[isDarkMode ? 'bg-gray-800 bg-opacity-70' : 'bg-white']"
          >
            <div
              class="px-6 py-4 border-b"
              :class="[isDarkMode ? 'border-gray-700' : 'border-gray-200']"
            >
              <h3
                class="text-lg font-medium"
                :class="[isDarkMode ? 'text-white' : 'text-gray-800']"
              >
                最近活动
              </h3>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div
                  v-for="(activity, index) in recentActivities"
                  :key="index"
                  class="flex items-center space-x-4"
                >
                  <div class="flex-shrink-0">
                    <component
                      :is="activity.icon"
                      class="w-5 h-5"
                      :class="[isDarkMode ? 'text-gray-400' : 'text-gray-600']"
                    />
                  </div>
                  <div class="flex-1">
                    <p :class="[isDarkMode ? 'text-gray-300' : 'text-gray-700']">
                      {{ activity.description }}
                    </p>
                    <p class="text-sm" :class="[isDarkMode ? 'text-gray-400' : 'text-gray-500']">
                      {{ activity.time }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentSection === 'files'">
          <h2
            class="text-2xl font-bold mb-6"
            :class="[isDarkMode ? 'text-white' : 'text-gray-800']"
          >
            文件管理
          </h2>

          <!-- 添加文件操作栏 -->
          <div
            class="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
          >
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
              <input
                ref="fileInput"
                type="file"
                multiple
                class="hidden"
                @change="handleFileUpload"
              />
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
            <div
              class="px-6 py-4 border-b"
              :class="[isDarkMode ? 'border-gray-700' : 'border-gray-200']"
            >
              <h3
                class="text-lg font-medium"
                :class="[isDarkMode ? 'text-white' : 'text-gray-800']"
              >
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
                        <span
                          class="font-medium"
                          :class="[isDarkMode ? 'text-white' : 'text-gray-900']"
                        >
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
                  <span
                    v-else
                    class="px-2"
                    :class="[isDarkMode ? 'text-gray-400' : 'text-gray-500']"
                  >
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

        <div v-if="currentSection === 'settings'">
          <h2
            class="text-2xl font-bold mb-6"
            :class="[isDarkMode ? 'text-white' : 'text-gray-800']"
          >
            系统设置
          </h2>
          <div
            class="rounded-lg shadow-md p-6 transition-colors duration-300"
            :class="[
              isDarkMode
                ? 'bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-xl border border-gray-700'
                : 'bg-white border border-gray-200'
            ]"
          >
            <div class="space-y-6">
              <div>
                <h3
                  class="text-lg font-medium mb-2"
                  :class="[isDarkMode ? 'text-white' : 'text-gray-800']"
                >
                  常规设置
                </h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <span :class="[isDarkMode ? 'text-gray-300' : 'text-gray-700']">启用通知</span>
                    <label class="switch">
                      <input type="checkbox" v-model="settings.notifications" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                  <div class="flex items-center justify-between">
                    <span :class="[isDarkMode ? 'text-gray-300' : 'text-gray-700']">自动更新</span>
                    <label class="switch">
                      <input type="checkbox" v-model="settings.autoUpdate" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3
                  class="text-lg font-medium mb-2"
                  :class="[isDarkMode ? 'text-white' : 'text-gray-800']"
                >
                  安全设置
                </h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <span :class="[isDarkMode ? 'text-gray-300' : 'text-gray-700']"
                      >双因素认证</span
                    >
                    <label class="switch">
                      <input type="checkbox" v-model="settings.twoFactor" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                  <div>
                    <label
                      for="password"
                      class="block text-sm font-medium mb-1"
                      :class="[isDarkMode ? 'text-gray-300' : 'text-gray-700']"
                    >
                      更改密码
                    </label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="password"
                        id="password"
                        v-model="newPassword"
                        class="block w-full pr-10 sm:text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        :class="[
                          isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'border-gray-300 text-gray-900 placeholder-gray-400'
                        ]"
                        placeholder="新密码"
                      />
                      <button
                        @click="changePassword"
                        class="absolute inset-y-0 right-0 px-3 flex items-center bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                      >
                        更改
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, onUnmounted, computed, watch } from 'vue'
import {
  BoxIcon,
  MenuIcon,
  XIcon,
  FileIcon,
  FolderIcon,
  CogIcon,
  LayoutDashboardIcon,
  HardDriveIcon,
  UsersIcon,
  ActivityIcon,
  UploadIcon,
  TrashIcon,
  UserIcon,
  SearchIcon,
  UploadCloudIcon
} from 'lucide-vue-next'

interface MenuItem {
  id: string
  name: string
  icon: any
}

interface File {
  id: number
  name: string
  size: string
  type: string
  lastModified: string
}

interface Settings {
  notifications: boolean
  autoUpdate: boolean
  twoFactor: boolean
}

const isDarkMode = inject('isDarkMode')
const menuItems: MenuItem[] = [
  { id: 'dashboard', name: '仪表盘', icon: LayoutDashboardIcon },
  { id: 'files', name: '文件管理', icon: FolderIcon },
  { id: 'settings', name: '系统设置', icon: CogIcon }
]

const currentSection = ref('dashboard')
const isSidebarOpen = ref(true)
const newPassword = ref('')

const settings = ref<Settings>({
  notifications: true,
  autoUpdate: false,
  twoFactor: false
})

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

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const downloadFile = (file: File) => {
  console.log('Downloading file:', file.name)
}

const deleteFile = (file: File) => {
  console.log('Deleting file:', file.name)
}

const changePassword = () => {
  console.log('Changing password to:', newPassword.value)
  newPassword.value = ''
}

// 响应式处理
const handleResize = () => {
  if (window.innerWidth >= 1024) {
    isSidebarOpen.value = true
  } else {
    isSidebarOpen.value = false
  }
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 添加最近活动数据
const recentActivities = [
  {
    icon: UploadIcon,
    description: '张三上传了文件 "项目计划.pdf"',
    time: '10分钟前'
  },
  {
    icon: UserIcon,
    description: '新用户李四加入了系统',
    time: '30分钟前'
  },
  {
    icon: TrashIcon,
    description: '王五删除了文件 "旧文档.doc"',
    time: '1小时前'
  },
  {
    icon: FileIcon,
    description: '系统自动备份完成',
    time: '2小时前'
  }
]

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

const handleFileDrop = (event: Event) => {
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
const handlePageChange = async (page: number) => {
  if (page < 1 || page > totalPages.value) return
  params.value.page = page
  await loadFiles() // 重新加载文件列表
}

// 加载文件列表
const loadFiles = async () => {
  try {
    // 这里实现实际的API调用
    // const response = await api.getFiles({
    //   page: params.value.page,
    //   size: params.value.size,
    //   search: fileSearchQuery.value,
    //   type: fileTypeFilter.value
    // });

    // params.value.total = response.total;
    // files.value = response.data;

    // 模拟API响应
    params.value.total = 85 // 示例总数
    // 更新文件列表数据...
  } catch (error) {
    console.error('加载文件列表失败:', error)
    // 处理错误...
  }
}

// 监听搜索和筛选条件变化
watch(
  [fileSearchQuery, fileTypeFilter],
  () => {
    params.value.page = 1 // 重置页码
    loadFiles()
  },
  { debounce: 300 }
)

// 初始加载
onMounted(() => {
  loadFiles()
})
</script>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e5e7eb;
  transition: 0.4s;
}

.dark .slider {
  background-color: #4b5563;
}

input:checked + .slider {
  background-color: #4f46e5;
}

.dark input:checked + .slider {
  background-color: #4f46e5;
}

.slider:before {
  position: absolute;
  content: '';
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
}

.dark .slider:before {
  background-color: #e5e7eb;
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin 8s linear infinite;
}

.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>
