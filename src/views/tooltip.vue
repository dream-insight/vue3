<script setup>
import { ref } from 'vue'

let message = ref([
  '아래에서 나오는 메시지',
  '매시지를 목록으로 전달 가능'
])
</script>

<template>
  <div class="wrap">
    <p>
      <Tooltip top message="위에 나오는 메시지" />
    </p>
    <p>
      <Tooltip right width="200" message="오른쪽에 나오는 메시지" />
    </p>
    <p>
      <Tooltip left width="200" message="왼쪽에 나오는 메시지">
        slot 활용가능
        <i class="fas fa-question-circle"></i>
      </Tooltip>
    </p>
    <p>
      <Tooltip :message="message">
        <i class="fas fa-question-circle"></i>
        slot 활용가능
      </Tooltip>
    </p>
  </div>
</template>

<style lang="scss" scoped>
.wrap {
  padding: 200px;
  text-align: center;
}
</style>