<script setup>
import { ref, watch, onBeforeUpdate, defineProps, defineExpose } from 'vue'

const props = defineProps({
  limitTime: {
    type: Number,
    default: 10,
  },
  message: {
    type: String,
    default: 'Loading...'
  },
  destroy: Function
})

let timeout = 0
let delay = ref(0)
let progress = ref(0)
let isShow = ref(false)
let isOpen = ref(false)

watch(progress, (after) => {
  if (after <= 0) {
    delay.value = 0
    isShow.value = false
  } else if (after > 0) {
    isShow.value = true
  }
})

 const destroy = () => {
  isOpen.value = false
  props.destroy.call()
}

 const waiting = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, delay.value * 1000)
  })
}

 const show = async (msg) => {
  if (msg !== '') {
    message.value = msg
  }

  clearTimeout(timeout)

  await waiting()

  isOpen.value = true
  progress.value++

  // hide 호출이 없을 경우 최대 지속 시간 이후 사라지도록
  timeout = setTimeout(() => {
    progress.value = 0
  }, props.limitTime * 1000)
}

const hide = async () => {
  await waiting()

  if (progress.value) {
    clearTimeout(timeout)
    progress.value--
  }
}

onBeforeUpdate(() => {
  isOpen.value = true
})

defineExpose({ show, hide, delay })
</script>

<template>
  <transition name="fade">
    <div class="spinner-box" v-if="isOpen">
      <transition appear name="scale" @after-leave="destroy">
        <div class="box" v-show="isShow">
          <div class="spinner">
            <img src="./spinner.png" />
          </div>
          <p>{{ message }}</p>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
@import './style.scss';
</style>
