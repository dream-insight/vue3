<script setup>
import { ref, defineExpose } from 'vue'

const frm = ref(null)

let checkState = true
let firstEl = null

const validate = () => {
  checkState = true
  firstEl = null

  // traverse(ins.subTree)
  traverse(frm.value.__vnode)

  // 검수에 통과하지 못한 가장 첫번째 폼에 포커스
  if (firstEl !== null) {
    try {
      firstEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } catch (e) { }
  }

  return checkState
}

const resetForm = () => {
  traverse(frm.value.__vnode, 'reset')
}

const traverse = (el, flag = 'dom') => {
  if (Array.isArray(el.children)) {
    const len = el.children.length

    if (len > 0) {
      const vueNodes = el.children

      // vue node 전체(chilren)을 탐색 하여 chidren이 또 있는 경우 재귀한다.
      for (let i = 0; i < len; i++) {
        if (vueNodes[i].component !== null) {
          traverse(vueNodes[i].component.subTree, flag)
        }

        if (!!vueNodes[i].children) {
          if (vueNodes[i].children.length > 0) {
            traverse(vueNodes[i], flag)
          }
        } else {
          componentCheck(vueNodes[i], flag)
        }
      }
    }
  } else if (!!el.component) {
    if (el.component.subTree !== undefined) {
      traverse(el.component.subTree, flag)
    }
  }
}

const componentCheck = (el, flag) => {
  const vueDom = [
    'inputField', 'numberFormat', 'selectBox',
    'switchButton', 'checkButton', 'datePicker',
    'validateWrap'
  ]

  // 컴포넌트인지 체크 후 필요한 처리를 한다.
  if (typeof el.type === 'object') {
    // npm install 된 컴포넌트는 __file property 없기 때문에 통과
    if (el.type.hasOwnProperty('__name') ) {
      let tagName = el.type.__name

      if (vueDom.indexOf(tagName) > -1) {
        if (flag == 'reset') {
          el.component.exposed.resetForm()
        } else {
          if (!el.component.exposed.check() && checkState) {
            checkState = false

            // 가장 처음 검수에 통과 하지 못한 폼 저장 (라인 포커스)
            if (firstEl === null) {
              firstEl = el.el
            }
          }
        }
      }
    }
  }
}

defineExpose({
  resetForm,
  validate
})
</script>

<template>
  <form ref="frm" @submit.prevent>
    <slot></slot>
  </form>
</template>