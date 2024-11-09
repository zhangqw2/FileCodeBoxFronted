<template>
  <div class="flex justify-center space-x-4 mb-6">
    <button
      type="button"
      @click="$emit('update:modelValue', 'file')"
      :class="[
        'px-4 py-2 rounded-lg',
        modelValue === 'file' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'
      ]"
    >
      发送文件
    </button>
    <button
      type="button"
      @click="$emit('update:modelValue', 'text')"
      :class="[
        'px-4 py-2 rounded-lg',
        modelValue === 'text' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'
      ]"
    >
      发送文本
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String
})

defineEmits(['update:modelValue'])
</script>
