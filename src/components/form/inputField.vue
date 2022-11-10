<script setup>
import { ref, watch, computed, onMounted, defineProps, defineEmits, defineExpose } from 'vue'

const emit = defineEmits()

const props = defineProps({
  modelValue: [String, Number],
  placeholder: String,
  // multiline 이 true인 경우 몇 줄 까지 보일지 설정
  rows: {
    type: [Number, String],
    default: 5
  },
  // 높이 textarea 만 해당 (multiline option)
  height: [String, Number],
  width: [String, Number],
  // display block width가 설정 된 경우 width가 우선
  block: {
    type: Boolean,
    default: false
  },
  // 폼 검증
  validate: {
    type: Array,
    default: () => []
  },
  blurValidate: {
    type: Boolean,
    default: true
  },
  // 폼 검증이 완료된 경우 메시지 표시 사용 보류
  // success: {
  //   type: Boolean,
  //   default: false
  // },
  // 지정된 패턴의 유효성 검사 form validation 보다 우선
  pattern: {
    type: String,
    default: ''
  },
  maxLength: [String, Number],
  // 강제 에러 출력 - check함수를 수행 하지 않음
  errorMessage: {
    type: String,
    default: ''
  },
  // textarea 설정
  multiline: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  // text 정렬 오른 쪽으로
  textRight: {
    type: Boolean,
    default: false,
  },
  tabIndex: [String, Number],
  // 최대 입력 가능한 글자 수, multiline option 제외
  maxLength: [String, Number],
  readonly: {
    type: Boolean,
    default: false,
  },
  autofocus: {
    type: Boolean,
    default: false,
  }
})

let isValidate = ref(true)
let checkPass = ref(false)
let message = ref('')
let errorTransition = ref(false)

const textarea = ref(null)
const input = ref(null)

watch(() => props.errorMessage, (v) => {
  // 임의로 지정된 에러가 있는 경우 에러 아이콘 표기
  if (v != '') {
    message.value = v
    isValidate.value = false
    checkPass.value = false
    errorTransition.value = true
  } else {
    message.value = ''
    isValidate.value = true
    checkPass.value = true
    errorTransition.value = false
  }
})

watch(() => errorTransition, (v) => {
  if (v) {
    setTimeout(() => {
      errorTransition.value = false
    }, 300)
  }
})

watch(() => props.modelValue, (v) => {
  // 외부에서 model이 업데이트 되도 유효성 검사
  if (v != '') {
    message.value = ''
    isValidate.value = true
    errorTransition.value = false
  }
})

watch(() => props.validate, () => {
  message.value = ''
  isValidate.value = true
  errorTransition.value = false
})

const successful = computed(() => props.success === true && isValidate && checkPass)
const styleWidth = computed(() => {

  if (props.width) {
    const index = props.width.indexOf('%') >= 0
    return index ? props.width : props.width + 'px'
  } else {
    return false
  }
})

const updateValue = (evt = null) => {
  let v = ''

  if (evt === null) {
    v = props.modelValue
  } else {
    v = evt.target.value
  }

  emit('update:modelValue', v)
}

const getPattern = (type = '') => {
  if (pattern !== undefined) {
    type = props.pattern.value
  }

  let pattern = ''
  let message = ''

  switch (type) {
    // 영문만 유효성 검사
    case 'eng':
      pattern = /^[a-z|A-Z]+$/
      message = '영문만 입력 가능합니다.'
      break
    // 영문,숫자 유효성 검사
    case 'engnum':
      pattern = /^[(a-z|A-Z)0-9]+$/
      message = '영문, 숫자만 입력 가능합니다.'
      break
    // 아이디 영문,숫자,underbar(_) 사용 유효성 검사
    case 'id':
      pattern = /^[(a-z|A-Z)0-9]+[_]*[(a-z|A-Z)0-9]+$/
      message = '영문, 숫자 입력만 가능합니다.( _ 중간 사용 가능)'
      break
    // 정수 유효성 검사
    case 'num':
      pattern = /^[0-9]+$/
      message = '숫자만 입력 가능합니다.'
      break
    // 영문,숫자 혼합사용 유효성 검사
    case 'wordnum':
      pattern = /^([0-9]+[a-z|A-Z]+)|([a-z|A-Z]+[0-9]+)$/
      message = '영문, 숫자 혼합하여 입력해주세요.'
      break
    case 'password':
      pattern = /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])|(?=.*[a-zA-Z])(?=.*[0-9])|(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{8,16}$/
      message = '영문, 숫자, 특수문자 중 2가지 이상을 조합하여 입력해주세요.(8~16자)'
      break
    // 도메인
    case 'domain':
      pattern = /^([a-zA-Z0-9]{1,}\.?)[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9]{2,})+(?:\:[0-9]{1,})*$/
      message = '도메인주소 형식이 일치 하지 않습니다.(http://, https:// 제외)'
      break
    // 이메일 유효성 검사
    case 'email':
      pattern = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      message = '이메일 형식과 일치하지 않습니다.'
      break
    // 전화 번호 유효성
    case 'tel':
      pattern = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/
      message = '전화번호 형식과 일치하지 않습니다.'
      break
  }

  return { pattern, message }
}

const check = () => {
  // 임의로 지정된 에러가 없는 경우
  if (props.errorMessage === '') {
    // pattern check
    if (props.pattern !== '') {
      const pt = getPattern()

      if (pt.pattern.test(props.modelValue)) {
        message.value = ''
      } else {
        message.value = pt.message
        isValidate.value = false
        checkPass.value = false
        errorTransition.value = true

        return false
      }
    }

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
  }

  errorTransition.value = true
  return false
}

const resetForm = () => {
  emit('update:modelValue', '')
}

onMounted(() => {
  if (props.autofocus && props.multiline) {
    textarea.value.focus()
  } else if (props.autofocus && !props.multiline) {
    input.value.focus()
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
    :style="{ width: styleWidth }"
    @focus="focus">
    <textarea
      ref="textarea"
      :class="['block', { block: block }]"
      :style="[{ height: height ? `${height}px` : '' }]"
      :rows="rows"
      :placeholder="placeholder"
      :value="modelValue"
      :readonly="readonly"
      :tabindex="tabIndex ? tabIndex : false"
      :disabled="disabled"
      @input="updateValue"
      v-if="multiline">
    </textarea>

    <input
      autocomplete
      ref="input"
      type="text"
      :class="['block', { block: block }, { 'text-right': textRight }]"
      :style="[{ width: width ? `${width}px` : '' }]"
      :placeholder="placeholder"
      :value="modelValue"
      :tabindex="tabIndex ? tabIndex : false"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxLength ? maxLength : false"
      @input="updateValue"
      v-else />

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
@import './inputField.scss';
</style>
