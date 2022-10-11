<script setup>
import { ref, watch, computed, defineProps, defineEmits, defineExpose } from 'vue'

const emit = defineEmits()
const props = defineProps({
  modelValue: [String, Boolean],
  small: {
    type: Boolean,
    default: false
  },
  // [0 => false label, 1 => true label]
  label: {
    type: [Array, Object],
    default: () => ['미설정', '설정'],
  },
  // form check validate
  validate: {
    type: [Boolean, String],
    default: false
  },
  trueValue: {
    type: [String, Boolean],
    default: true
  },
  falseValue: {
    type: [String, Boolean],
    default: false
  }
})

let onError = ref(false)
let errorTransition = ref(false)
let message = ref('')
let isValidate = ref(true)

watch(() => props.modelValue, () => {
  resetForm()
})

watch(errorTransition, (v) => {
  if (v) {
    setTimeout(() => {
      errorTransition.value = false
    }, 300)
  }
})

const labelText = computed(() => props.modelValue === props.trueValue ? props.label[1] : props.label[0])

const check = () => {
  // validate check
  if (props.validate) {
    if (props.modalValue === true) {
      resetForm()

      return true
    } else {
      message.value = (typeof props.validate == 'string') ? props.validate : `${props.label[1]}을(를) 선택해주세요.`
      onError.value = true
      isValidate.value = false
      errorTransition.value = true

      return false
    }
  }

  return true
}

const resetForm = () => {
  message.value = ''
  onError.value = false
  isValidate.value = true
  errorTransition.value = false
}

const updateValue = (evt) => {
  emit('update:modelValue', evt.target.checked ? props.trueValue : props.falseValue)
}

defineExpose({
  check,
  resetForm
})
</script>

<template>
  <div class="switch-wrap">
    <label
      :class="['switch', { small, error: onError }]">
      <input
        type="checkbox"
        :checked="modelValue == trueValue"
        @change="updateValue"
      />
      <span></span>
      {{ labelText }}
    </label>

    <p
      :class="['description', { error: errorTransition }]"
      v-if="!isValidate">
      <FontAwesomeIcon :icon="['fas', 'exclamation-circle']" />
      {{ message }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
@import './switchButton.scss';
</style>