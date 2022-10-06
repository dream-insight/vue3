<script setup>
import { ref, onBeforeUpdate, onMounted, defineProps, defineExpose } from 'vue'

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: '',
  },
  width: {
    type: [Number, String],
    default: 400,
  },
  okay: {
    type: Function,
    default: null,
  },
  cancel: {
    type: Function,
    default: null,
  },
  btnOkayText: {
    type: String,
    default: '확인'
  },
  btnCancelText: {
    type: String,
    default: '취소'
  },
  modalStyleClass: {
    type: String
  },
  noScrollStyleClass: {
    type: String
  },
  destroy: Function
})

let isOpen = ref(false)
let isShow = ref(false)
let modalShow = ref(true)
let btnOkay = ref(null)

function show() {
  document.body.classList.add('no-scroll')
  modalShow.value = true
  isShow.value = true
}

function hide() {
  let modalCheck = document.body.querySelectorAll('.modal-bg')

  if (modalCheck.length == 0) {
    document.body.classList.remove('no-scroll')
  }

  isShow.value = false

  setTimeout(() => {
    props.destroy.call()
  }, 300)
}

function destory() {
  isOpen.value = false
}

function clickOkay() {
  if (typeof props.okay === 'function') {
    props.okay.call()
  }

  hide()
}

function clickCancel() {
  if (typeof props.cancel === 'function') {
    props.cancel.call()
  }

  hide()
}

onBeforeUpdate(() => {
  isOpen.value = true
})

onMounted(() => {
  isOpen.value = true

  setTimeout(() => {
    btnOkay.value.focus()
    btnOkay.value.blur()
  }, 300)

  document.addEventListener('keyup', keyupEvent)
})

defineExpose({
  show, hide
})
</script>

<template>
  <transition name="modal-fade">
    <div class="alert-modal" tabindex="0" v-if="isOpen">
      <transition appear name="modal-scale" @after-leave="destory">
        <div class="modal-box"
          :style="{ width: `${width}px` }"
          v-show="isShow">
          <h3 class="title">{{ title }}</h3>
          <div class="contents" v-html="message"></div>
          <div class="actions">
            <a
              href="#"
              class="btn btn-cancel"
              @click.prevent="clickCancel"
              v-if="type == 'confirm'">
              {{ btnCancelText }}
            </a>
            <a
              href="#"
              ref="btnOkay"
              class="btn btn-okay"
              @click.prevent="clickOkay">
              {{ btnOkayText }}
            </a>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
@import './style.scss';
</style>
