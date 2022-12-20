<script setup>
import { ref, watch, computed, defineProps, onMounted, defineEmits, defineExpose } from 'vue'

const emit = defineEmits()

const props = defineProps({
  modelValue: [String, Number],
  placeholder: String,
  // 폼 검증
  validate: {
    type: Array,
    default: () => []
  },
  // 강제 에러 출력 - check함수를 수행 하지 않음
  errorMessage: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  // display block
  block: {
    type: Boolean,
    default: false
  },
  width: [String, Number],
  autofocus: {
    type: Boolean,
    default: false
  },
  tabIndex: {
    type: [String, Number],
    default: 0
  },
  maxLength: {
    type: [String, Number],
    default: ''
  },
  readonly: {
    type: Boolean,
    default: false
  },
  // 폼 검증이 완료된 경우 check icon 표시 여부 (사용 보류)
  // success: {
  //   type: Boolean,
  //   default: false
  // },
})

let isValidate = ref(true)
let checkPass = ref(false)
let message = ref('')
let errorTransition = ref(false)

const input = ref(null)


watch(() => props.errorMessage, (v) => {
  // 임의로 지정된 에러가 있는 경우 에러 아이콘 표기
  if (v != '') {
    message.value = v
    isValidate.value = false
    errorTransition.value = true
  } else {
    message.value = ''
    isValidate.value = true
    errorTransition.value = false
  }
})

watch(errorTransition, (v) => {
  if (v) {
    setTimeout(() => {
      errorTransition.value = false
    }, 300)
  }
})

watch(() => props.modelValue, (v) => {
  // 외부에서 model이 업데이트 되도 유효성 검사
  if (v !== '') {
    message.value = ''
    isValidate.value = true
    errorTransition.value = false

    input.value.value = format(v)
  }
})

watch(() => props.validate, () => {
  message.value = ''
  isValidate.value = true
  errorTransition.value = false
})

const successful = computed(() => isValidate.value && checkPass.value)

/**
 * 입력 폼이 focus, blur 됐을때 해당 값을 체크 하여 값을 비우거나 0으로 채워 준다.
 *
 *
 * @param { Event } evt
 */
const zeroCheck = (evt) => {
  if (evt.type === 'focus' && evt.target.value === '0' && evt.target.value.length === 1) {
    evt.target.value = ''
    emit('update:modelValue', 0)
  } else if (evt.type === 'blur' && evt.target.value === '' && evt.target.value.length === 0) {
    evt.target.value = '0'
    emit('update:modelValue', 0)
  }
}

/**
 * 전달된 값을 천단위로 콤마(,)를 생성하여 반환
 *
 * @param { String } v
 * @return { String } format number string
 */
const format = (v) => {
  return new Intl.NumberFormat().format(v)
  if (v !== '') {
    let minus = parseFloat(v) >= 0 ? false : true
    let find = /(\d+)(\d{3})/
    let spNum = v.toString().split('.')
    let num = parseInt(spNum[0].replace(/[^0-9]/g, ''), 10).toString()

    while (find.test(num)) {
      num = num.replace(find, '$1' + ',' + '$2')
    }

    if (minus) {
      num = `-${num}`
    }

    return num
  }

  return ''
}

const updateValue = () => {
  let value = input.value.value.replace(/[^\d\-]/g, '').replace(/\-{2,}/g, '-').replace(/^$/, 0)

  value = (value.charAt(0) === '-') ? '-'.concat(value.replace(/[-]/g, '')) : value.replace(/[-]/g, '')

  if (!isNaN(value)) {
    input.value.value = format(value)
    emit('update:modelValue', parseInt(value, 10))
  }
}

const check = () => {
  // 임의로 지정된 에러가 없는 경우
  if (props.errorMessage === '') {
    // validate check
    if (props.validate.length) {
      for (let i = 0; i < props.validate.length; i++) {
        let result = props.validate[i].call(null, props.modelValue)

        if (result !== true) {
          message.value = result
          isValidate.value = false
          checkPass.value = false
          errorTransition.value = true

          return false
        } else {
          message.value = ''
        }
      }
    }

    isValidate.value = true
    checkPass.value = true

    return true
  } else {
    errorTransition.value = true
    return false
  }
}

const resetForm = () => {
  emit('update:modelValue', '')
}

onMounted(() => {
  if (props.autofocus) {
    input.value.focus()
  }

  if (props.modelValue !== '') {
    input.value.value = format(props.modelValue)
  }
})

defineExpose({
  check,
  resetForm
})
</script>

<template>
  <div
    :class="['input-wrap', { error: !isValidate, success: successful, block }]"
    :style="{ width: width ? width : '' }">

    <input
      ref="input"
      type="text"
      :placeholder="placeholder"
      :tabindex="tabIndex ? tabIndex : false"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxLength ? maxLength : false"
      @focus="zeroCheck"
      @blur="zeroCheck"
      @input="updateValue"
    />

    <p
      :class="['description', { error: errorTransition }]"
      v-if="message !== '' || successful">
      <FontAwesomeIcon :icon="['fas', 'exclamation-circle']" />
      {{ message }}
      <i class="fas fa-check-circle" v-if="successful"></i>
    </p>
  </div>
</template>

<style lang="scss" scoped>
@import './numberFormat.scss';
</style>
