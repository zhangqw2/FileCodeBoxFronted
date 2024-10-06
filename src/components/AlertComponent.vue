<template>
  <transition name="alert-fade">
    <div v-if="show" class="fixed top-4 right-4 max-w-sm w-full z-50">
      <div
        :class="[
          'rounded-lg shadow-lg overflow-hidden transform transition-all duration-300',
          alertTypeClasses[type]
        ]"
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <CheckCircle v-if="type === 'success'" class="h-6 w-6 text-white" />
              <AlertTriangle v-else-if="type === 'error'" class="h-6 w-6 text-white" />
              <AlertCircle v-else-if="type === 'warning'" class="h-6 w-6 text-white" />
              <Info v-else class="h-6 w-6 text-white" />
            </div>
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-sm font-medium text-white" v-html="message"></p>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
              <button
                @click="$emit('close')"
                class="inline-flex text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
              >
                <span class="sr-only">关闭</span>
                <X class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        <div class="h-1 bg-white bg-opacity-25">
          <div
            :class="[
              'h-full transition-all duration-300 ease-out bg-white',
              { 'w-full': !autoClose }
            ]"
            :style="{ width: `${progressWidth}%` }"
          ></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-vue-next'

const props = defineProps({
  show: Boolean,
  message: String,
  type: {
    type: String,
    default: 'info',
    validator: (value: string) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000
  },
  autoClose: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

const alertTypeClasses: { [key: string]: string } = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500'
}

const progressWidth = ref(100)
let timer: number | null = null

const startTimer = () => {
  if (timer) {
    clearInterval(timer)
  }
  progressWidth.value = 100
  const startTime = Date.now()
  const endTime = startTime + props.duration

  timer = setInterval(() => {
    const now = Date.now()
    const remaining = endTime - now
    progressWidth.value = (remaining / props.duration) * 100

    if (remaining <= 0) {
      clearInterval(timer!)
      emit('close')
    }
  }, 10)
}

watch(
  () => props.show,
  (newValue) => {
    if (newValue && props.autoClose) {
      startTimer()
    } else if (!newValue && timer) {
      clearInterval(timer)
    }
  }
)

onMounted(() => {
  if (props.show && props.autoClose) {
    startTimer()
  }
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.alert-fade-enter-active,
.alert-fade-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}

.alert-fade-enter-from,
.alert-fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
