<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const event = computed(() => store.getters.getEvent)

let count = ref(0)

watch(event, (v) => {
  if (v !== '') {
    count.value = (v === 'plus') ? count.value + 1 : count.value - 1
    store.dispatch('setEvent')
  }
})

function increase() {
  store.dispatch('setEvent', 'plus')
}
</script>

<template>
  <p>{{ count }}</p>
  <p><button type="button" @click="increase">count 증가</button></p>
</template>