<script setup>
import { ref, watch, computed, defineProps, onMounted, defineExpose, getCurrentInstance } from 'vue'

const ins = getCurrentInstance()

const props = defineProps({
  modelValue: [String, Number],   // model
  type: {                         // 입력 폼 형식 String:''
    type: String,
    default: 'text'
  },
  placeholder: String,            // String:''
  rows: {                         // multiline 이 true인 경우 몇 줄 까지 보일지 설정 Number: 5
    type: [Number, String],
    default: 5
  },
  height: [String, Number],       // textarea 높이
  width: [String, Number],        // 넓이
  block: {                        // display block !!! width가 선언 된 경우 width가 우선
    type: Boolean,
    default: false
  },
  validate: {                     // 폼 검증 배열일 경우 함수에 의거, true일 경우 pattern 호출(password, email만) Array:[condition:function || message:text] or true
    type: Array,
    default: () => []
  },
  blurValidate: {
    type: Boolean,
    default: true
  },
  success: {                      // 폼 검증이 완료된 경우 check icon 표시 여부 Boolean: false
    type: Boolean,
    default: false
  },
  pattern: {                      // 체크할 패턴을 지정 String:''
    type: String,
    default: ''
  },
  maxLength: [String, Number],    // maxlength String:''
  errorMessage: {                 // 강제 에러 출력 - check함수를 수행 하지 않음 String:''
    type: String,
    default: ''
  },
  multiline: {                    // textarea 여부,
    type: Boolean,
    default: false
  },
  disabled: Boolean,              // disabled : false
  autofocus: {
    type: Boolean,
    default: false
  },             // 자동 포커스
  textRight: String,              // text 정렬 오른 쪽으로
  tabIndex: [String, Number],     // tabindex
  maxLength: [String, Number],    // 최대 입력 가능한 글자 수 (type=text 에만 적용)
  readonly: Boolean,              // readonly Boolean: false
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
    return (props.width.toString().indexOf('%') >= 0) ? props.width : props.width + 'px'
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

  ins.emit('update:modelValue', v)
}

const getPattern = (type = '') => {
  if (pattern !== undefined) {
    type = props.pattern.value
  }

  let obj = {
    pattern: '',
    message: ''
  }

  switch (type) {
    // 영문만 유효성 검사
    case 'eng':
      obj.pattern = /^[a-z|A-Z]+$/
      obj.message = '영문만 입력 가능합니다.'
      break
    // 영문,숫자 유효성 검사
    case 'engnum':
      obj.pattern = /^[(a-z|A-Z)0-9]+$/
      obj.message = '영문, 숫자만 입력 가능합니다.'
      break
    // 아이디 영문,숫자,underbar(_) 사용 유효성 검사
    case 'id':
      obj.pattern = /^[(a-z|A-Z)0-9]+[_]*[(a-z|A-Z)0-9]+$/
      obj.message = '영문, 숫자 입력만 가능합니다.( _ 중간 사용 가능)'
      break
    // 정수 유효성 검사
    case 'num':
      obj.pattern = /^[0-9]+$/
      obj.message = '숫자만 입력 가능합니다.'
      break
    // 영문,숫자 혼합사용 유효성 검사
    case 'wordnum':
      obj.pattern = /^([0-9]+[a-z|A-Z]+)|([a-z|A-Z]+[0-9]+)$/
      obj.message = '영문, 숫자 혼합하여 입력해주세요.'
      break
    case 'password':
      obj.pattern = /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])|(?=.*[a-zA-Z])(?=.*[0-9])|(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{8,16}$/
      obj.message = '영문, 숫자, 특수문자 중 2가지 이상을 조합하여 입력해주세요.(8~16자)'
      break
    // 도메인
    case 'domain':
      obj.pattern = /^([a-zA-Z0-9]{1,}\.?)[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9]{2,})+(?:\:[0-9]{1,})*$/
      obj.message = '도메인주소 형식이 일치 하지 않습니다.(http://, https:// 제외)'
      break
    // 이메일 유효성 검사
    case 'email':
      obj.pattern = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      obj.message = '이메일 형식과 일치하지 않습니다.'
      break
    // 전화 번호 유효성
    case 'tel':
      obj.pattern = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/
      obj.message = '전화번호 형식과 일치하지 않습니다.'
      break
  }

  return obj
}

const check = () => {
  // 임의로 지정된 에러가 없는 경우
  if (props.errorMessage === '') {
    // pattern check
    if (props.pattern != '') {
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
    if (props.validate.length > 0) {
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
  }
}

const resetForm = () => {
  ins.emit('update:modelValue', '')
}

onMounted(() => {
  if (props.autofocus && props.multiline) {
    textarea.value.focus()
  } else if (props.autofocus && !props.multiline) {
    input.value.focus()
  }
})

if (props.modelValue != '') {
  updateValue()
}

defineExpose({
  check,
  resetForm
})
</script>

<template>
  <div :class="['input_wrap', {error: !isValidate}, {success: successful}, {block: block}]" :style="{width: styleWidth}"
    @focus="focus">

    <textarea ref="textarea" :class="['block', 'form-control form-control-sm', {block: block}]"
      :style="[{height: height ? height + 'px' : false}]" :rows="rows" :placeholder="placeholder" :value="modelValue"
      :readonly="readonly" :tabindex="tabIndex ? tabIndex : false" :disabled="disabled" @input="updateValue"
      @submit="check()" v-if="multiline">
        </textarea>
    <input ref="input" :class="['text block form-control form-control-sm', {block: block}, {'text-right': textRight}]"
      :style="[{width: width ? width + 'px' : false}]" :type="type" :placeholder="placeholder" :value="modelValue"
      :tabindex="tabIndex ? tabIndex : false" :disabled="disabled" :readonly="readonly"
      :maxlength="maxLength ? maxLength : false" @input="updateValue" @submit="check()" v-else>

    <p :class="['description', {error: errorTransition}]" v-if="message !== '' || successful">
      <i class="fas fa-exclamation-circle" v-if="!isValidate"></i>
      {{message}}
      <i class="fas fa-check-circle" v-if="successful"></i>
    </p>
  </div>
</template>

<style scoped>
.input_wrap {
  display: inline-block;
  vertical-align: top;
}

.input_wrap.block {
  display: block !important;
}

textarea {
  resize: none;
}
</style>