<script setup>
import { ref, watch, computed, defineEmits, defineProps, defineExpose } from 'vue'

const emit = defineEmits()
const props = defineProps({
  modelValue: [String, Number, Array, Boolean],
  // checkbox, radio
  type: {
    type: String,
    default: 'checkbox'
  },
  // 전체 버튼 추가
  all: {
    type: Boolean,
    default: false
  },
  items: {
    type: Array,
    required: true
  },
  // 최대 체크 가능한 수량
  maxCheck: {
    type: Number,
    default: 0
  },
  validate: {
    type: Array,
    default: () => []
  },
  name: {
    type: String,
    required: true
  },
  // 강제 에러 출력 - check함수를 수행 하지 않음
  errorMessage: {
    type: String,
    default: ''
  },
  button: {
    type: Boolean,
    default: false,
  },
})

let list = ref([])
let val = (props.type === 'checkbox') ? ref(['']) : ref('')
let clickIndex = ref(-1)
let isValidate = ref(true)
let checkPass = ref(false)
let message = ref('')
let errorTransition = ref(false)

watch(() => props.modelValue, (v) => {
  val.value = props.modelValue
  resetValidate()
})

watch(val, (v) => {
  resetValidate()
})

watch(() => props.items, (items) => {
  if (items.length > 0) {
    list.value = [...items]
  }
})

watch(() => props.validate, () => {
  resetValidate()
})

watch(errorTransition, (v) => {
  if (v) {
    setTimeout(() => {
      errorTransition.value = false
    }, 300)
  }
})

const successful = computed(() => props.isValidate && checkPass.value)

const setIndex = (index) => {
  clickIndex.value = index
  emit('update:modelValue', val.value)
}

const checkValue = (index, v) => {
  setIndex(index)

  if (props.type === 'checkbox') {
    let model = ['']

    if (v !== '') {
      if (props.maxCheck > 0) {
        val.value.splice(props.maxCheck, 1)
      } else {
        if (val.value.indexOf('') > -1) {
          val.value.splice(0, 1)
        }
      }

      model = val.value
    }

    val.value = model
  }

  emit('update:modelValue', val.value)
}

/**
 * 폼을 검수하여 값을 반환, 임의로 지정된 에러가 없는 경우
 *
 * @return { Boolean }
*/
const check = () => {
  if (props.errorMessage === '') {
    // validate check
    if (props.validate.length > 0) {
      for (let i = 0; i < props.validate.length; i++) {
        let result = ''

        if (props.type == 'checkbox') {
          result = props.validate[i].call(null, Array.from(val.value))
        } else {
          result = props.validate[i].call(null, val.value)
        }

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

const resetValidate = () => {
  message.value = ''
  isValidate.value = true
  errorTransition.value = false
}

const resetForm = () => {
  val.value = (props.type == 'checkbox') ? [''] : ''
}

if (props.items) {
  list.value = [...props.items]
}

if (props.all) {
  list.value.unshift({ text: '전체 선택', value: '' })
}

if (props.modelValue) {
  val.value = props.modelValue
}

defineExpose({
  clickIndex,
  check,
  resetForm,
  resetValidate
})
</script>

<template>
  <div :class="['check-button', { button }]">
    <template v-if="button">
      <label
        style="margin-top: 5px;"
        :key="`keyword${i}`" v-for="({ text, value }, i) in list">
        <input
          type="checkbox"
          :name="name"
          :value="value"
          @change="checkValue(i, value)"
          v-model="val"
        />
        <span>{{ text }}</span>
      </label>
    </template>
    <template v-else>
      <label
        :key="'check-button-' + i"
        v-for="({ text, value }, i) in list">
        <input
          type="radio"
          :id="`${name}${i}`"
          :name="name"
          :value="value"
          @change="setIndex(i)"
          v-model="val"
          v-if="type == 'radio'"
        />

        <input
          type="checkbox"
          :id="`${name}${i}`"
          :name="name"
          :value="value"
          @change="checkValue(i, value)"
          v-model="val"
          v-else
        />

        {{ text }}
      </label>
    </template>

    <p
      :class="['description', { error: errorTransition }]"
      v-if="message !== '' || successful">
      <FontAwesomeIcon :icon="['fas', 'exclamation-circle']" />
      {{ message }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
@import './checkButton.scss';
</style>