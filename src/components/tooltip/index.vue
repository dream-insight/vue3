<script setup>
import { ref, reactive, computed, onMounted, defineProps, useSlots } from 'vue'

const slots = useSlots()
const props = defineProps({
  message: {
    type: [Array, String],
    required: true
  },
  left: {
    type: Boolean,
    default: false,
  },
  right: {
    type: Boolean,
    default: false,
  },
  top: {
    type: Boolean,
    default: false,
  },
  bottom: {
    type: Boolean,
    default: true,
  },
  width: {
    type: [Number, String],
    default: 300
  }
})

// 현 컴포넌트 ref
const el = ref(null)

let position = ref('')
let isShow = ref(true)
let transitionName = ref('')
const addStyle = reactive({})

let rect = {}
let boxRect = {}

const showIcon = computed(() => slots.default !== undefined)

const init = () => {
  if (position.value === 'top') {
    addStyle.top = ''
    addStyle.bottom = '100%'
    addStyle.left = ((rect.width - boxRect.width) / 2) + 'px'
    addStyle.marginBottom = '7px'
    addStyle.marginTop = 0
  } else if (position.value === 'right') {
    addStyle.top = ((rect.height - boxRect.height) / 2) + 'px'
    addStyle.left = '100%'
    addStyle.marginLeft = '7px'
    addStyle.marginTop = 0
  } else if (position.value === 'left') {
    addStyle.top = ((rect.height - boxRect.height) / 2) + 'px'
    addStyle.right = '100%'
    addStyle.marginRight = '7px'
    addStyle.marginTop = 0
  } else {
    addStyle.top = '100%'
    addStyle.left = ((rect.width - boxRect.width) / 2) + 'px'
    addStyle.marginTop = '7px'
  }
}

const onMouse = (show) => {
  init()
  isShow.value = show
}

if (props.top) {
  position.value = 'top'
} else if (props.left) {
  position.value = 'left'
} else if (props.right) {
  position.value = 'right'
} else {
  position.value = 'bottom'
}

transitionName.value = `tooltip-${position.value}`

onMounted(() => {
  rect = el.value.getBoundingClientRect()

  const interval = setInterval(() => {
    boxRect = el.value.querySelector('.message-box').getBoundingClientRect()

    if (boxRect.width > 0) {
      isShow.value = false
      clearInterval(interval)
    }
  }, 10)
})
</script>

<template>
  <div ref="el" class="tooltip-wrap" @mouseenter="onMouse(true)" @mouseleave="onMouse(false)">
    <slot v-if="showIcon"></slot>
    <FontAwesomeIcon class="icon" :icon="['fas', 'question-circle']" v-else />

    <transition :name="transitionName">
      <div
        :class="['message-box', position]"
        :style="[{width: `${width}px`}, addStyle]"
        v-if="isShow">
        <template v-if="Array.isArray(message)">
          <ul>
            <li
              :key="`tooltip-message-list${msg}`"
              v-for="msg in message">
              {{ msg }}
            </li>
          </ul>
        </template>
        <template v-else>
          {{ message }}
        </template>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
@import './style.scss';
</style>