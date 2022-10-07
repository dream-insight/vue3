<script setup>
import { ref } from 'vue'

let total = ref(16723)
let pageSize = ref(10)
let page = ref(1)
</script>

<template>
  <p>현제 페이지는 {{ page }} 입니다.</p>
  <div class="wrap">
    <Pagination :total="total" :size="pageSize" v-model="page" />
  </div>
</template>

<style>
@import url('https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css');
.wrap {
  width: 90%;
  margin: auto;
}
</style>