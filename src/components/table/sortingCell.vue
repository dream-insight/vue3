<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const emit = defineEmits()
const props = defineProps({
  target: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
})

let sorting = ref(true)

const changeSorting = () => {
  sorting.value = !sorting.value
  emit('sorting', props.target + ' ' + (sorting.value ? 'desc' : 'asc'))
}
</script>

<template>
  <div class="sort-wrap">
    <span>{{ text }}</span>
    <a
      href="#"
      :class="['sorting', {rotate: !sorting}]"
      @click.prevent="changeSorting">
      <i name="fas fa-arrow-down"></i>
    </a>
  </div>
</template>

<style lang="scss" scoped>
.sort-wrap {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  .sorting {
    transition: all .2s;
    transform-origin: center;
    text-align: center;
    font-size: 14px;
    width: 21px;
    height: 21px;
    color: #528ff2;
  }

  .sorting:hover {
    color: #3c69b1;
  }

  .rotate {
    transform: rotate(180deg);
  }
}
</style>