<script setup>
import { ref, watch, onMounted, defineProps, defineEmits } from 'vue'

const emit = defineEmits()
const props = defineProps({
  date: Number,
  max: {
    type: Number,
    default: 0
  },
  isShow: {
    type: Boolean
  }
})

// 목록
const el = ref(null)

watch(() => props.max, (v) => {
  if (v > 0) {
    for (let i = v; i >= 1900; i--) {
      items.value.push(i)
    }
  }
})

watch(() => props.isShow, (v) => {
  if (v) {
    setTimeout(() => {
      const li = el.value.querySelector('li.active')
      const top = li.offsetTop - li.offsetHeight
      el.value.scrollTop = top
    }, 100)
  }
})

let items = ref([])

onMounted(() => {
  if (props.max > 0) {
    for (let i = props.max; i >= 1900; i--) {
      items.value.push(i)
    }
  }

  for (let i = 0; i < 12; i++) {
    items.value.push(i)
  }
})

const updateValue = (v) => {
  emit('selected', v)
}
</script>

<template>
  <transition appear name="trans-slide-down">
    <div :class="['selector-box', { month: max === 0 }]">
      <div class="selector-box-wrap">
        <div class="arrow"></div>
        <ul ref="el">
          <li
            :class="{ active: num == date }"
            @click="updateValue(num)"
            v-for="num in items">
            <template v-if="max > 0">
              {{ num }}
            </template>
            <template v-else>
              {{ num + 1 }}
            </template>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>