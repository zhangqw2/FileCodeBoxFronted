<script setup lang="ts">
import { inject, ref, computed } from 'vue'
import api from '@/utils/api'
import { useAlertStore } from '@/stores/alertStore'

const isDarkMode = inject('isDarkMode')
const alertStore = useAlertStore()

const tableData: any = ref([])
const approvalDetail: any = ref(null)
const showApprovalDetail = ref(false)

// 审批流表头
const approvalTableHeaders = ['审批编号', '申请人', '审批状态', '提交时间', '操作']

// 分页参数
const params = ref({
  page: 1,
  size: 10,
  total: 0,
  keyword: ''
})

// 加载审批流列表
const loadApprovals = async () => {
  try {
    const res: any = await api({
      url: '/admin/approval/list',
      method: 'get',
      params: params.value
    })
    tableData.value = res.detail.data
    params.value.total = res.detail.total
    alertStore.showAlert('加载成功', 'success')
  } catch (error) {
    console.error('加载审批流列表失败:', error)
  }
}

// 页码改变处理函数
const handlePageChange = async (page: number) => {
  if (page < 1 || page > totalPages.value) return
  params.value.page = page
  await loadApprovals()
}

// 查看审批详情
const viewApproval = async (id: number) => {
  try {
    const res: any = await api({
      url: `/admin/approval/${id}`,
      method: 'get'
    })
    approvalDetail.value = res.detail
    showApprovalDetail.value = true
  } catch (error) {
    console.error('加载审批详情失败:', error)
  }
}

// 关闭审批详情
const closeApprovalDetail = () => {
  showApprovalDetail.value = false
  approvalDetail.value = null
}

// 初始加载
loadApprovals()

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
  await loadApprovals()
}
</script>

<template>
  <div class="p-6 h-screen overflow-y-auto custom-scrollbar">
    <h2 class="text-2xl font-bold mb-6" :class="[isDarkMode ? 'text-white' : 'text-gray-800']">
      审批流管理
    </h2>

    <!-- 添加审批流操作栏 -->
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
            placeholder="搜索审批流..." />
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

    <!-- Approval List -->
    <div class="rounded-lg shadow-md overflow-hidden transition-colors duration-300"
      :class="[isDarkMode ? 'bg-gray-800 bg-opacity-70' : 'bg-white']">
      <div class="px-6 py-4 border-b" :class="[isDarkMode ? 'border-gray-700' : 'border-gray-200']">
        <h3 class="text-lg font-medium" :class="[isDarkMode ? 'text-white' : 'text-gray-800']">
          所有审批流
        </h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y" :class="[isDarkMode ? 'divide-gray-700' : 'divide-gray-200']">
          <thead :class="[isDarkMode ? 'bg-gray-900' : 'bg-gray-100']">
            <tr>
              <th v-for="header in approvalTableHeaders" :key="header"
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
            <tr v-for="approval in tableData" :key="approval.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span class="font-medium" :class="[isDarkMode ? 'text-white' : 'text-gray-900']">
                    {{ approval.approvalId }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span class="font-medium" :class="[isDarkMode ? 'text-white' : 'text-gray-900']">
                    {{ approval.applicant }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span class="font-medium" :class="[isDarkMode ? 'text-white' : 'text-gray-900']">
                    {{ approval.status }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[isDarkMode ? 'text-gray-400' : 'text-gray-500']">
                  {{ approval.submittedAt }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="viewApproval(approval.id)" class="transition-colors duration-200" :class="[
                  isDarkMode
                    ? 'text-indigo-400 hover:text-indigo-300'
                    : 'text-indigo-600 hover:text-indigo-900'
                ]">
                  查看
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 在审批流列表表格下方添加分页组件 -->
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

    <!-- 审批详情 -->
    <div v-if="showApprovalDetail" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold">审批详情</h3>
          <button @click="closeApprovalDetail" class="text-gray-500 hover:text-gray-700">
            关闭
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">审批编号</label>
            <p class="mt-1 text-gray-900">{{ approvalDetail.approvalId }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">申请人</label>
            <p class="mt-1 text-gray-900">{{ approvalDetail.applicant }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">审批状态</label>
            <p class="mt-1 text-gray-900">{{ approvalDetail.status }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">提交时间</label>
            <p class="mt-1 text-gray-900">{{ approvalDetail.submittedAt }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">审批内容</label>
            <p class="mt-1 text-gray-900">{{ approvalDetail.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
