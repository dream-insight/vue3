<script setup>
let text = 'before async'

async function ayncTest() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('after async')
    }, 1000)
  })
}

(async () => {
  text = await ayncTest()
  console.log(text)
})()
</script>

<template>
  <router-view />
</template>

<style>
/* @import url("https://use.fontawesome.com/releases/v5.4.2/css/all.css"); */
</style>