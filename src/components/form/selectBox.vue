<script setup>
import { ref, watch, computed, defineProps, defineEmits, defineExpose } from 'vue'

const emit = defineEmits()
const props = defineProps({
  modelValue: [String, Number],
  selectedIndex: {
    type: Number,
    default: -1,
  },
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

const getText = () => {
  return selectBox.value.options[selectedIndex.value].text
}

const updateValue = (evt) => {
  let v = evt.target.value

  emit('update:modelValue', v)
  emit('update:selectedIndex', selectBox.value.selectedIndex)
  check()
}

const check = () => {
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

const resetForm = () => {
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
      <FontAwesomeIcon :icon="['fas', 'exclamation-circle']" />
      {{ message }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
@import './selectBox.scss';
</style>