<script setup>
import InputField from '@/components/inputField'

import { ref, reactive, onMounted, defineEmits } from 'vue'

const emit = defineEmits()

const obj = reactive({})

const input = ref(null)
let text = ref('')

if (obj) {
  console.log(Object.keys(obj).length)
}

onMounted(() => {
  emit('click', { text: '', value: '' })

  console.log(input.value.isValidate)
  console.log(input.value.check())
})
</script>

<template>
  <input-field ref="input" v-model="text" />
</template>