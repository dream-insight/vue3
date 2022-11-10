<script setup>
import { ref, inject } from 'vue'

const Spinner = inject('Spinner')

let timer = ref(0)
let message = ref('버튼을 클릭해서 스피너를 확인 하세요.')

const setTimer = (time) => {
  timer.value = time

  const interval = setInterval(() => {
    time--
    timer.value = time

    if (time < 0) {
      clearInterval(interval)
      message.value = '버튼을 클릭해서 스피너를 확인 하세요.'
    }
  }, 1000)
}

const show = async (flag = 0) => {
  message.value = ''

  if (flag == 0) {
    setTimer(10)
    Spinner.show()
  } else {
    setTimer(8)
    await Spinner.delay(3).show()
    Spinner.delay(5).hide()
  }
}
</script>

<template>
  <p v-if="message">{{ message }}</p>
  <p v-else>{{ timer }}초 이후 스피너가 닫힙니다.</p>
  <button type="button" @click="show()">10초 보기</button>
  <button type="button" @click="show(1)">3초 후에 5초 보기</button>
  <button type="button" @click="show(2)">스피너 보기 (3초 2초 딜레이 후 사라짐)</button>
</template>

<style lang="scss" scoped>
button + button { margin-left: 5px; }
</style>