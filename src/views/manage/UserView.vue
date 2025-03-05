<script setup lang="ts">
import { inject, ref, computed } from 'vue'
import api from '@/utils/api'
import { useAlertStore } from '@/stores/alertStore'

const isDarkMode = inject('isDarkMode')
const alertStore = useAlertStore()

interface User {
  id: number;
  employee_id: string;
  name: string;
  organization: string;
  status: 'active' | 'frozen';
}

const tableData = ref<User[]>([])

// 用户表头
const userTableHeaders = ['工号', '姓名', '机构', '状态', '操作']

// 分页参数
const params = ref({
  page: 1,
  size: 10,
  total: 0,
  keyword: ''
})

// 加载用户列表
const loadUsers = async () => {
  try {
    const res: any = await api({
      url: '/user/list',
      method: 'get',
      params: params.value
    })
    tableData.value = res.detail.data
    params.value.total = res.detail.total
    alertStore.showAlert('加载成功', 'success')
  } catch (error) {
    console.error('加载用户列表失败:', error)
  }
}

// 页码改变处理函数
const handlePageChange = async (page: number) => {
  if (page < 1 || page > totalPages.value) return
  params.value.page = page
  await loadUsers()
}

// 删除用户处理
const deleteUser = async (id: number) => {
  try {
    await api({
      url: '/admin/user/delete',
      method: 'delete',
      data: { id }
    })
    await loadUsers()
  } catch (error) {
    console.error('删除失败:', error)
  }
}

// 初始加载
loadUsers()

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
  await loadUsers()
}

const showAddUserModal = ref(false)
const showEditUserModal = ref(false)
const newUser = ref({
  employee_id: '',
  name: '',
  organization: '',
  status: 'active'
})
const editUser = ref({
  id: 0,
  employee_id: '',
  name: '',
  organization: '',
  status: 'active'
})

// 添加用户处理函数
const addUser = async () => {
  try {
    await api({
      url: '/user/add',
      method: 'post',
      data: newUser.value
    })
    await loadUsers()
    showAddUserModal.value = false
    alertStore.showAlert('用户添加成功', 'success')
  } catch (error) {
    console.error('添加用户失败:', error)
  }
}

// 编辑用户处理函数
const updateUser = async () => {
  try {
    await api({
      url: `/user/update/${editUser.value.id}`,
      method: 'patch',
      data: editUser.value
    })
    await loadUsers()
    showEditUserModal.value = false
    alertStore.showAlert('用户更新成功', 'success')
  } catch (error) {
    console.error('更新用户失败:', error)
  }
}

// 打开编辑用户模态框
const openEditUserModal = (user: User) => {
  editUser.value = { ...user }
  showEditUserModal.value = true
}

const statusMap = {
  active: '正常',
  frozen: '冻结'
}

const statusClassMap = {
  active: 'bg-green-100 text-green-800',
  frozen: 'bg-red-100 text-red-800'
}
</script>

<template>
  <div class="p-6 h-screen overflow-y-auto custom-scrollbar">
    <h2 class="text-2xl font-bold mb-6" :class="[isDarkMode ? 'text-white' : 'text-gray-800']">
      用户管理
    </h2>

    <!-- 添加用户操作栏 -->
    <div class="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <!-- 搜索和过滤 -->
      <div class="flex flex-1 gap-4">
        <div class="relative flex-1">
          <input type="text" v-model="params.keyword" :class="[
            isDarkMode
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
          ]"
            class="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="搜索用户..." />
        </div>
      </div>

      <!-- 搜索按钮 -->
      <div class="flex gap-4">
        <button @click="handleSearch"
          class="flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200">
          搜索
        </button>
      </div>
    </div>

    <!-- 添加用户按钮 -->
    <div class="flex justify-end mb-4">
      <button @click="showAddUserModal = true"
        class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
        新增用户
      </button>
    </div>

    <!-- 添加用户模态框 -->
    <div v-if="showAddUserModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold">新增用户</h3>
          <button @click="showAddUserModal = false" class="text-gray-500 hover:text-gray-700">
            关闭
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">工号</label>
            <input type="text" v-model="newUser.employee_id"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">姓名</label>
            <input type="text" v-model="newUser.name"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">机构</label>
            <input type="text" v-model="newUser.organization"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">状态</label>
            <select v-model="newUser.status"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              <option value="active">正常</option>
              <option value="frozen">冻结</option>
            </select>
          </div>
        </div>
        <div class="flex justify-end mt-4">
          <button @click="addUser"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
            保存
          </button>
        </div>
      </div>
    </div>

    <!-- 编辑用户模态框 -->
    <div v-if="showEditUserModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold">编辑用户</h3>
          <button @click="showEditUserModal = false" class="text-gray-500 hover:text-gray-700">
            关闭
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">工号</label>
            <input type="text" v-model="editUser.employee_id"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">姓名</label>
            <input type="text" v-model="editUser.name"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">机构</label>
            <input type="text" v-model="editUser.organization"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">状态</label>
            <select v-model="editUser.status"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              <option value="active">正常</option>
              <option value="frozen">冻结</option>
            </select>
          </div>
        </div>
        <div class="flex justify-end mt-4">
          <button @click="updateUser"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
            保存
          </button>
        </div>
      </div>
    </div>

    <!-- User List -->
    <div class="rounded-lg shadow-md overflow-hidden transition-colors duration-300"
      :class="[isDarkMode ? 'bg-gray-800 bg-opacity-70' : 'bg-white']">
      <div class="px-6 py-4 border-b" :class="[isDarkMode ? 'border-gray-700' : 'border-gray-200']">
        <h3 class="text-lg font-medium" :class="[isDarkMode ? 'text-white' : 'text-gray-800']">
          所有用户
        </h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y" :class="[isDarkMode ? 'divide-gray-700' : 'divide-gray-200']">
          <thead :class="[isDarkMode ? 'bg-gray-900' : 'bg-gray-100']">
            <tr>
              <th v-for="header in userTableHeaders" :key="header"
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="[isDarkMode ? 'text-gray-400' : 'text-gray-500']">
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody :class="[
            isDarkMode
              ? 'bg-gray-800 divide-y divide-gray-700'
              : 'bg-white divide-y divide-gray-200'
          ]">
            <tr v-for="user in tableData" :key="user.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span class="font-medium" :class="[isDarkMode ? 'text-white' : 'text-gray-900']">
                    {{ user.employee_id }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span class="font-medium" :class="[isDarkMode ? 'text-white' : 'text-gray-900']">
                    {{ user.name }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span class="font-medium" :class="[isDarkMode ? 'text-white' : 'text-gray-900']">
                    {{ user.organization }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  statusClassMap[user.status]
                ]">
                  {{ statusMap[user.status] }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="openEditUserModal(user)" class="mr-3 transition-colors duration-200" :class="[
                  isDarkMode
                    ? 'text-indigo-400 hover:text-indigo-300'
                    : 'text-indigo-600 hover:text-indigo-900'
                ]">
                  编辑
                </button>
                <button @click="deleteUser(user.id)" class="transition-colors duration-200" :class="[
                  isDarkMode
                    ? 'text-red-400 hover:text-red-300'
                    : 'text-red-600 hover:text-red-900'
                ]">
                  删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 在用户列表表格下方添加分页组件 -->
    <div class="mt-4 flex items-center justify-between px-6 py-3 border-t"
      :class="[isDarkMode ? 'border-gray-700' : 'border-gray-200']">
      <!-- 分页信息 -->
      <div class="flex items-center text-sm" :class="[isDarkMode ? 'text-gray-400' : 'text-gray-500']">
        显示第 {{ (params.page - 1) * params.size + 1 }} 到
        {{ Math.min(params.page * params.size, params.total) }} 条，共 {{ params.total }} 条
      </div>

      <!-- 分页控制器 -->
      <div class="flex items-center space-x-2">
        <!-- 上一页 -->
        <button @click="handlePageChange(params.page - 1)" :disabled="params.page === 1"
          class="px-3 py-1 rounded-md transition-colors duration-200" :class="[
            isDarkMode
              ? params.page === 1
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : params.page === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]">
          上一页
        </button>

        <!-- 页码 -->
        <div class="flex items-center space-x-1">
          <template v-for="pageNum in displayedPages" :key="pageNum">
            <button v-if="pageNum !== '...'" @click="handlePageChange(pageNum)"
              class="px-3 py-1 rounded-md transition-colors duration-200" :class="[
                params.page === pageNum
                  ? 'bg-indigo-600 text-white'
                  : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]">
              {{ pageNum }}
            </button>
            <span v-else class="px-2" :class="[isDarkMode ? 'text-gray-400' : 'text-gray-500']">
              ...
            </span>
          </template>
        </div>

        <!-- 下一页 -->
        <button @click="handlePageChange(params.page + 1)" :disabled="params.page >= totalPages"
          class="px-3 py-1 rounded-md transition-colors duration-200" :class="[
            isDarkMode
              ? params.page >= totalPages
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : params.page >= totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]">
          下一页
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
