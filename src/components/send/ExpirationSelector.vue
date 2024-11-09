<template>
  <div class="flex flex-col space-y-4">
    <label :class="['text-sm font-medium', isDarkMode ? 'text-gray-300' : 'text-gray-700']">
      过期方式
    </label>
    <select
      :value="method"
      @input="$emit('update:method', $event.target.value)"
      :class="[
        'px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500',
        isDarkMode
          ? 'bg-gray-800 bg-opacity-50 text-white'
          : 'bg-white text-gray-900 border border-gray-300'
      ]"
    >
      <option value="day">按天数</option>
      <option value="hour">按小时</option>
      <option value="minute">按分钟</option>
      <option value="count">按查看次数</option>
      <option value="forever">永久</option>
    </select>
    <div v-if="method !== 'forever'" class="flex items-center space-x-2">
      <div class="relative flex-grow">
        <input
          :value="value"
          @input="$emit('update:value', $event.target.value)"
          type="number"
          :placeholder="getPlaceholder()"
          :class="[
            'w-full px-4 py-2 pr-16 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500',
            isDarkMode
              ? 'bg-gray-800 bg-opacity-50 text-white'
              : 'bg-white text-gray-900 border border-gray-300'
          ]"
        />
        <span
          :class="[
            'absolute right-3 top-1/2 transform -translate-y-1/2',
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          ]"
        >
          {{ getUnit() }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  method: String,
  value: [String, Number],
  isDarkMode: Boolean
})

defineEmits(['update:method', 'update:value'])

const getPlaceholder = () => {
  switch (props.method) {
    case 'day':
      return '输入天数'
    case 'hour':
      return '输入小时数'
    case 'minute':
      return '输入分钟数'
    case 'count':
      return '输入查看次数'
    default:
      return '输入值'
  }
}

const getUnit = () => {
  switch (props.method) {
    case 'day':
      return '天'
    case 'hour':
      return '小时'
    case 'minute':
      return '分钟'
    case 'count':
      return '次'
    default:
      return ''
  }
}
</script>
