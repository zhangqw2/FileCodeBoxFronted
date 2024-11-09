<template>
  <div class="flex flex-col">
    <textarea
      id="text-content"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      rows="7"
      :class="[
        'flex-grow px-4 py-3 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 resize-none',
        isDarkMode
          ? 'bg-gray-800 bg-opacity-50 text-white'
          : 'bg-white text-gray-900 border border-gray-300'
      ]"
      placeholder="在此输入要发送的文本..."
    ></textarea>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  isDarkMode: Boolean
})

defineEmits(['update:modelValue'])
</script>
