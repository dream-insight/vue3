<script setup>
import { ref, onMounted, defineProps, defineExpose } from 'vue'

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

let isShow = ref(true)
let btnOkay = ref(null)

const hide = () => {
  let modalCheck = document.body.querySelectorAll('.modal-bg')

  if (modalCheck.length == 0) {
    document.body.classList.remove('no-scroll')
  }

  isShow.value = false
}

const close = () => {
  if (props.destroy instanceof Function)
    props.destroy.call()
}

const clickOkay = () => {
  if (props.okay instanceof Function) {
    props.okay.call()
  }

  hide()
}

const clickCancel = () => {
  if (props.cancel instanceof Function) {
    props.cancel.call()
  }

  hide()
}

const keyupEvent = (evt) => {
  // Enter 키를 눌렀을 때 okay 실행
  if (evt.keyCode === 13) {
    clickOkay()
  }

  // ESC 키를 눌렀을때 창을 닫아 줌(cancel과 동일)
  if (evt.keyCode === 27) {
    clickCancel()
  }
}

onMounted(() => {
  document.body.classList.add('no-scroll')

  btnOkay.value.focus()
  btnOkay.value.blur()

  document.addEventListener('keyup', keyupEvent)
})

defineExpose({
  hide
})
</script>

<template>
  <transition name="modal-fade">
    <div class="alert-modal" tabindex="0" v-show="isShow">
      <transition appear name="modal-scale" @after-leave="close">
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
