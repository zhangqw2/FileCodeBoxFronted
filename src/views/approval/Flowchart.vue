<script setup>
import { ref, h, watch } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { ControlButton, Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { initialEdges, initialNodes } from './components/initial-elements.js'
import Icon from './components/Icon.vue'
import useDragAndDrop from './components/useDnD.js'
import DropzoneBackground from './components/DropzoneBackground.vue'
import Sidebar from './components/Sidebar.vue'
import { useDialog } from './components/useDialog'
import Dialog from './components/Dialog.vue'
import { TransitionPresets, useTransition } from '@vueuse/core'
const { onInit, onNodeDragStop, onConnect, addEdges, 
    setViewport, toObject, setNodes, setEdges,
    onNodesChange, onEdgesChange, applyNodeChanges, applyEdgeChanges,
    onNodeDoubleClick 
} = useVueFlow()

const nodes = ref(initialNodes)

const edges = ref(initialEdges)

// our dark mode toggle flag
const dark = ref(false)

const dialog = useDialog()

const isHidden = ref(false)

const editingNode = ref(null)
const newNodeLabel = ref('')
const newEmployeeId = ref('')    // 新增工号
const newEmployeeName = ref('')  // 新增姓名

onInit((vueFlowInstance) => {
  vueFlowInstance.fitView()
})

onNodeDragStop(({ event, nodes, node }) => {
  console.log('Node Drag Stop', { event, nodes, node })
})

onConnect((connection) => {
  addEdges(connection)
})

function updatePos() {
  nodes.value = nodes.value.map((node) => {
    return {
      ...node,
      position: {
        x: Math.random() * 400,
        y: Math.random() * 400,
      },
    }
  })
}

function logToObject() {
  console.log(toObject())
}

function resetTransform() {
  setViewport({ x: 0, y: 0, zoom: 1 })
}

function toggleDarkMode() {
  dark.value = !dark.value
}

function onClear() {
  setNodes([])
  setEdges([])
}

function onDelete() {
  if (nodes.value.length > 0) {
    nodes.value.pop()
  }
  if (edges.value.length > 0) {
    edges.value.pop()
  }
}

function onSave() {
  const data = toObject()
  console.log('Saved Data:', data)
  // 这里可以添加保存数据到服务器的逻辑
}

watch(isHidden, (newValue) => {
  nodes.value = nodes.value.map((node) => ({ ...node, hidden: newValue }))
  edges.value = edges.value.map((edge) => ({ ...edge, hidden: newValue }))
})
function dialogMsg(id) {
  return h(
    'span',
    {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      },
    },
    [`Are you sure?`, h('br'), h('span', `[ELEMENT_ID: ${id}]`)],
  )
}
onNodesChange(async (changes) => {
  const nextChanges = []

  for (const change of changes) {
    if (change.type === 'remove') {
      const isConfirmed = await dialog.confirm(dialogMsg(change.id))

      if (isConfirmed) {
        nextChanges.push(change)
      }
    } else {
      nextChanges.push(change)
    }
  }

  applyNodeChanges(nextChanges)
})
onEdgesChange(async (changes) => {
  const nextChanges = []

  for (const change of changes) {
    if (change.type === 'remove') {
      const isConfirmed = await dialog.confirm(dialogMsg(change.id))

      if (isConfirmed) {
        nextChanges.push(change)
      }
    } else {
      nextChanges.push(change)
    }
  }

  applyEdgeChanges(nextChanges)
})

onNodeDoubleClick(({ node }) => {
  editingNode.value = node
  newNodeLabel.value = node.data.label
  newEmployeeId.value = node.data.employeeId || ''    // 获取现有工号或设为空
  newEmployeeName.value = node.data.employeeName || '' // 获取现有姓名或设为空
})

function saveNodeLabel() {
  if (editingNode.value) {
    nodes.value = nodes.value.map((node) => {
      if (node.id === editingNode.value.id) {
        return {
          ...node,
          data: {
            ...node.data,
            label: newNodeLabel.value,
            employeeId: newEmployeeId.value,
            employeeName: newEmployeeName.value,
          },
        }
      }
      return node
    })
    editingNode.value = null
    newNodeLabel.value = ''
    newEmployeeId.value = ''
    newEmployeeName.value = ''
  }
}

const { onDragOver, onDrop, onDragLeave, isDragOver } = useDragAndDrop()

// 简化的测试函数，使用内置动画
function startTesting() {
  // 为所有边添加动画效果
  edges.value = edges.value.map(edge => ({
    ...edge,
    animated: true,
  }))
  
  // 3秒后关闭动画效果
  setTimeout(() => {
    edges.value = edges.value.map(edge => ({
      ...edge,
      animated: false,
    }))
  }, 5000)
}

</script>

<template>
  <div class="flow-container" @drop="onDrop">
    <VueFlow
      :nodes="nodes"
      :edges="edges"
      :class="{ dark }"
      class="flow-container basic-flow"
      :default-viewport="{ zoom: 1.5 }"
      :min-zoom="0.2"
      :max-zoom="4"
      @dragover="onDragOver" 
      @dragleave="onDragLeave"
      :apply-default="false"
      @node-dblclick="onNodeDoubleClick"
    >

      <Background pattern-color="#aaa" :gap="16" />
      <MiniMap />

      <Controls position="top-right">
        <ControlButton title="Reset Transform" @click="resetTransform">
          <Icon name="reset" />
        </ControlButton>

        <ControlButton title="Shuffle Node Positions" @click="updatePos">
          <Icon name="update" />
        </ControlButton>

        <ControlButton title="Toggle Dark Mode" @click="toggleDarkMode">
          <Icon v-if="dark" name="sun" />
          <Icon v-else name="moon" />
        </ControlButton>

        <ControlButton title="Log `toObject`" @click="logToObject">
          <Icon name="log" />
        </ControlButton>
        <ControlButton title="Clear" @click="onClear">
          <Icon name="clear" />
        </ControlButton>
        <ControlButton title="Delete" @click="onDelete">
          <Icon name="delete" />
        </ControlButton>
        <ControlButton title="Save" @click="onSave">
          <Icon name="save" />
        </ControlButton>
        <ControlButton title="hide" @click="isHidden.value = !isHidden.value">
          <Icon name="hide" v-if="isHidden.value"/>
          <Icon name="nothidden" v-else/>
        </ControlButton>
        <ControlButton title="Test Flow" @click="startTesting">
          <Icon name="testing" />
        </ControlButton>
      </Controls>

      <DropzoneBackground
        :style="{
          backgroundColor: isDragOver ? '#e7f3ff' : 'transparent',
          transition: 'background-color 0.2s ease',
        }"
      >
        <p v-if="isDragOver">Drop here</p>
      </DropzoneBackground>
    </VueFlow>
    <Dialog />
    <Sidebar />
  <!-- </div> -->
  <aside>
    <div class="nodes">
      <!-- ...existing code... -->
    </div>
    <div class="description">
      <!-- ...existing code... -->
    </div>
  </aside>

  <div v-if="editingNode" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold">编辑节点</h3>
        <button @click="editingNode = null" class="text-gray-500 hover:text-gray-700">
          关闭
        </button>
      </div>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">节点标签</label>
          <input type="text" v-model="newNodeLabel"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">工号</label>
          <input type="text" v-model="newEmployeeId"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">姓名</label>
          <input type="text" v-model="newEmployeeName"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
      </div>
      <div class="flex justify-end mt-4">
        <button @click="saveNodeLabel"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
          保存
        </button>
      </div>
    </div>
  </div>
  </div>
</template>

<style>
/* import the required styles */
@import "@vue-flow/core/dist/style.css";

/* import the default theme (optional) */
@import "@vue-flow/core/dist/theme-default.css";
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.42.1/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.42.1/dist/theme-default.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/controls@latest/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/minimap@latest/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/node-resizer@latest/dist/style.css';

.flow-container {
  width: 80%;
  height: 800px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  position: relative;
  flex-direction: column; /* 调整为列方向 */
}

.flow-container aside {
  color: #fff;
  font-weight: 700;
  border-top: 1px solid #eee; /* 调整为顶部边框 */
  padding: 15px 10px;
  font-size: 12px;
  background: #10b981bf;
  -webkit-box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, .3);
  box-shadow: 0 5px 10px #0000004d;
  width: 100%; /* 占满宽度 */
  text-align: center; /* 居中对齐 */
}

.flow-container aside .nodes {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.flow-container aside .nodes>* {
  margin-bottom: 10px;
  cursor: grab;
  font-weight: 500;
  -webkit-box-shadow: 5px 5px 10px 2px rgba(0, 0, 0, .25);
  box-shadow: 5px 5px 10px 2px #00000040;
}

.flow-container aside .description {
  margin-bottom: 10px;
}

.flow-container .vue-flow-wrapper {
  flex-grow: 1;
  height: 100%;
}

.dropzone-background {
  position: relative;
  height: 100%;
  width: 100%;
}

.dropzone-background .overlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  pointer-events: none;
}
</style>
