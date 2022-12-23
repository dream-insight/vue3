<script setup>
import { ref, watch, defineProps, defineExpose } from 'vue'

const props = defineProps({
  delay: {
    type: [Number, String],
    defalt: 3000,
  },
  maxShowMessage: {
    type: Number,
    default: 4
  }
})

let color = ref('success')
let icon = ref('check-circle')
let message = ref('')

let list = ref([])
let timeout = []
let key = 0

watch(list, (items) => {
  if (items.length === 0) {
    key = 0
    timeout = []
  }
})

const show = () => {
  list.value.push({
    key,
    color: color.value,
    icon: 'fas fa-' + icon.value,
    message: message.value,
  })

  // 표시 시간이 지나면 자동으로 메시지 삭제
  timeout.push(setTimeout(() => {
    hide(0)
  }, props.delay))

  key++

  let len = list.value.length

  if (len > props.maxShowMessage) {
    hide(0)
  }
}

const hide = (index = 0) => {
  try {
    clearTimeout(timeout[list.value[index].key])

    if (list.value.length > 0) {
      list.value.splice(index, 1)
    }
  } catch { }
}

defineExpose({
  color,
  icon,
  message,
  show
})
</script>

<template>
  <div id="toast">
    <transition-group name="toast-view">
      <div
        :class="['toast-body', (item.color != '' ? `bg-${item.color}` : '')]"
        :key="`toast-${item.key}`"
        @click="hide(i)"
        v-for="(item, i) in list">

        <template v-if="item.icon">
          <FontAwesomeIcon class="icon" :icon="['fas', item.icon]" />
        </template>

        <span class="message">{{ item.message }}</span>
      </div>
    </transition-group>
  </div>
</template>

<style lang="scss" scoped>
@import './style.scss';
</style>