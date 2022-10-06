<script setup>
import { ref, watch, computed, defineProps, defineEmits, defineExpose } from 'vue'

const emit = defineEmits()
const props = defineProps({
  modelValue: [String, Number],
  options: {
    type: Array,
    default: []
  },
  placeholder: {
    type: String,
    default: ''
  },
  block: Boolean,               // 행 단위 넓이
  validate: {
    type: Array,
    default: () => []
  },
  errorMessage: {
    type: String,
    default: ''
  },
  width: [String, Number],
})

let val = ref('')
let isValidate = ref(true)
let message = ref('')
let errorTransition = ref(false)
let selectedIndex = ref(-1)
let selectBox = ref(null)

const styleWidth = computed(() => {
  if (props.width) {
    const index = props.width.toString().indexOf('%') >= 0
    return (index) ? props.width : props.width + 'px'
  } else {
    return false
  }
})

watch(() => props.errorMessage, (v) => {
  if (v !== '') {
    isValidate.value = false
    message.value = props.errorMessage
  }
})

watch(errorTransition, (v) => {
  if (v) {
    setTimeout(() => {
      errorTransition.value = false
    }, 300)
  }
})

watch(() => props.validate, () => {
  message.value = ''
  isValidate.value = true
  errorTransition.value = false
})

function getText() {
  return selectBox.value.options[selectedIndex.value].text
}

function updateValue(evt) {
  let v = evt.target.value
  selectedIndex.value = selectBox.value.selectedIndex

  emit('update:modelValue', v, selectBox.value.selectedIndex)
  check()
}

function check() {
  // 폼을 검수하여 값을 반환
  // 임의로 지정된 에러가 없는 경우
  if (props.errorMessage === '') {
    // validate check
    if (props.validate.length > 0) {
      for (let i = 0; i < props.validate.length; i++) {
        let result = props.validate[i].call(null, selectBox.value.value)

        if (result !== true) {
          message.value = result
          isValidate.value = false
          errorTransition.value = true

          return false
        }
      }
    }
  }

  message.value = ''
  isValidate.value = true

  return true
}

function resetForm() {
  if (props.placeholder == '') {
    val.value = props.options[0].value
  } else {
    val.value = ''
  }

  emit('update:modelValue', val.value)
}

if (props.modelValue !== '') {
  val.value = props.modelValue
} else {
  if (props.placeholder === '') {
    // placeholder가 없는 경우 옵션의 첫번째 값을 기본으로 잡아줌
    emit('update:modelValue', props.options[0].value)
  }
}

defineExpose({
  getText,
  check,
  resetForm
})
</script>

<template>
  <div
    :style="{ width: styleWidth }"
    :class="['select-box', 'ml-1', { error: !isValidate, block: block }]">
    <select
      ref="selectBox"
      :class="{ size: parseInt(width) > 0 }"
      @change="updateValue">
      <option
        value=""
        :selected="modelValue == ''"
        v-if="placeholder">
        {{ placeholder }}
      </option>
      <option
        :value="item.value"
        :selected="modelValue == item.value"
        :key="'select-' + i"
        v-for="(item, i) in options">
        {{ item.text }}
      </option>
    </select>

    <p
      :class="['description', { error: errorTransition }]"
      v-if="!isValidate">
      <i class="fas fa-exclamation-circle"></i>
      {{ message }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
@import './selectBox.scss';
</style>