<script setup>
import { ref, computed, defineProps, useSlots } from 'vue'

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

const showIcon = computed(() => slots.default !== undefined)

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
</script>

<template>
  <div ref="el" class="tooltip-wrap" @mouseenter="onMouse(true)" @mouseleave="onMouse(false)">
    <slot v-if="showIcon"></slot>
    <FontAwesomeIcon class="icon" :icon="['fas', 'question-circle']" v-else />

    <transition name="tooltip">
      <div
        :class="['message-box', position]"
        :style="[{width: `${width}px`}]"
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

<style lang="scss">
@import './style.scss';
</style>