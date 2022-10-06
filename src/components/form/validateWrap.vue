<script setup>
import { ref, watch, defineProps } from 'vue'

const props = defineProps({
  checkValue: {
    type: [],
    required: true
  },
  validate: {
    // 폼 검증 함수 ex) [v => !!v || '필수 입력항목입니다.']
    type: Array,
    default: () => []
  },
  errorMessage: {
    type: String,
    default: '',
  }
})

watch(() => props.checkValue, () => {
  resetForm()
})

watch(() => props.validate, () => {
  resetForm()
})

watch(() => props.errorMessage, (v) => {
  message.value = v
})

let isValidate = ref(true)
let checkPass = ref(false)
let message = ref('')


function check() {
  // 임의로 지정된 에러가 없는 경우
  if (props.errorMessage === '') {
    // validate check
    if (props.validate.length) {
      for (let i = 0; i < this.validate.length; i++) {
        let result = props.validate[i].call(null, props.checkValue)

        if (result !== true) {
          message.value = result
          isValidate.value = false
          checkPass.value = false

          return false
        } else {
          message.value = ''
        }
      }
    }

    isValidate.value = true
    checkPass.value = true

    return true
  }

  return false
}

function resetForm() {
  isValidate.value = true
  checkPass.value = false
  message.value = ''
}

defineExpose({
  check,
  resetForm
})
</script>

<template>
  <div class="validate-wrap">
    <slot></slot>

    <div :class="['error-message']" v-if="message !== ''">
      <i class="fas fa-exclamation-circle" v-if="!isValidate"></i>
      {{ message }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './validateWrap.scss';
</style>