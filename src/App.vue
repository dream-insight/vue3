<script setup>
import Child from '@/components/child'

import { useStore } from 'vuex'

const store = useStore()

function increase() {
  store.dispatch('setEvent', 'minus')
}
</script>

<template>
  <Child />
  <p>
    <button type="button" @click="increase">count 감소</button>
  </p>
</template>