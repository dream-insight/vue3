<script setup>
import { inject } from 'vue'

const Toast = inject('Toast')

function showToast(color) {
  if (color == 'success') {
    Toast('success toast message')
  } else {
    Toast({ color, message: `${color} toast message` })
  }
}
</script>

<template>
  <div>
    <p><button type="button" @click="showToast('success')">success toast</button></p>
    <p><button type="button" @click="showToast('info')">info toast</button></p>
    <p><button type="button" @click="showToast('warning')">warning toast</button></p>
    <p><button type="button" @click="showToast('error')">error toast</button></p>
  </div>
</template>