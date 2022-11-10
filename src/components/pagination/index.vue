<script setup>
import { ref, watch, defineEmits, defineProps } from 'vue'

const emit = defineEmits()
const props = defineProps({
  modelValue: [String, Number],
  size: [String, Number],         // 한 페이지 목록 사이즈
  block: [String, Number],        // 표시할 페이지 개수
  total: [String, Number],        // 전체 수량
  addClass: String,
  inline: {
    type: Boolean,
    default: false
  }
})

let pageList = ref([])
let nowPage = ref(1)
let maxPage = ref(1)
let pageBlock = ref(10)
let startPage = ref(1)
let endPage = ref(1)
let prev = ref(0)
let next = ref(0)

watch(() => props.total, () => {
  makePageList()
})

watch(() => props.size, () => {
  makePageList()
})

watch(() => props.block, () => {
  makePageList()
})

watch(() => props.modelValue, (v) => {
  if (nowPage.value !== v && v) {
    makePageList()
    nowPage.value = v
  }
})

const makePageList = () => {
  pageList.value = []
  maxPage.value = Math.ceil(props.total / props.size)
  startPage.value = Math.floor((nowPage.value - 1) / pageBlock.value) * pageBlock.value + 1
  endPage.value = ((startPage.value + pageBlock.value - 1) > maxPage.value) ? maxPage.value : (startPage.value + pageBlock.value - 1)

  if (endPage.value === 0) {
    endPage.value = 1
  }

  prev.value = (startPage.value - 1 > 0) ? startPage.value - 1 : 1
  next.value = (startPage.value + pageBlock.value <= maxPage.value) ? endPage.value + 1 : maxPage.value

  for (let num = startPage.value; num <= endPage.value; num++) {
    pageList.value.push({
      num,
      isOn: (nowPage.value === num) ? true : false
    })
  }
}

const updateValue = (v) => {
  if (parseInt(v) != nowPage) {
    nowPage.value = v
    emit('update:modelValue', v)

    makePageList()
  }
}

if (props.block) {
  pageBlock.value = parseInt(props.block)
}

nowPage.value = props.modelValue
makePageList()
</script>

<template>
  <!-- bootstrap pagination -->
  <nav :class="['page navigation', { inline }]">
    <ul class="pagination">
      <li class="page-item">
        <a class="page-link" href="#" @click.prevent="updateValue(1)">
          <font-awesome-icon :icon="['fas', 'angle-double-left']" />
        </a>
      </li>
      <li class="page-item">
        <a class="page-link" href="#" @click.prevent="updateValue(prev)">
          <font-awesome-icon :icon="['fas', 'angle-left']" />
        </a>
      </li>

      <li
        :class="['page-item', { active: v.num === nowPage }]"
        :key="`page-key-${v.num}`"
        v-for="v in pageList">
        <a class="page-link" href="#" @click.prevent="updateValue(v.num)">{{ v.num }}</a>
      </li>

      <li class="page-item">
        <a class="page-link" href="#" @click.prevent="updateValue(next)">
          <font-awesome-icon :icon="['fas', 'angle-right']" />
        </a>
      </li>
      <li class="page-item">
        <a class="page-link" href="#" @click.prevent="updateValue(maxPage)">
          <font-awesome-icon :icon="['fas', 'angle-double-right']" />
        </a>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
.pagination {
  .page-item.active .page-link {
    z-index: 0 !important;
  }

  .page-item a {
    transition: all .2s;
  }
}
</style>