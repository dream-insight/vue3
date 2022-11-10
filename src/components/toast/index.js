import { defineComponent, h, render } from 'vue'
import ToastComponent from './component'

export default {
  install: (app, options = null) => {
    let VNode = null
    const body = document.querySelector('body')
    const props = {
      message: '',
      icon: 'check-circle',
      delay: 3000,
      color: 'success',
    }

    const setMessage = (opt) => {
      if (options !== null) {
        if (options.maxShowMessage !== undefined) {
          props.maxShowMessage = options.maxShowMessage
        }

        if (options.delay !== undefined) {
          props.delay = options.delay
        }
      }

      if (VNode == null) {
        VNode = h(defineComponent(ToastComponent), props)
        render(VNode, body)
      } else {
        VNode.component.props = props
      }

      if (typeof opt == 'object') {
        if (opt.message !== undefined) {
          VNode.component.exposed.message.value = opt.message
        } else {
          console.error('toast message is not set')
          return
        }

        if (opt.color != undefined) {
          VNode.component.exposed.color.value = opt.color
        }

        switch (opt.color) {
          case 'warning':
            VNode.component.exposed.icon.value = 'exclamation-triangle'
            break
          case 'info':
            VNode.component.exposed.icon.value = 'info-circle'
            break
          case 'error':
            VNode.component.exposed.icon.value = 'ban'
            break
        }
      } else {
        if (opt !== undefined) {
          VNode.component.exposed.icon.value = 'check-circle'
          VNode.component.exposed.color.value = 'success'
          VNode.component.exposed.message.value = opt
        } else {
          console.error('toast message is not set')
        }
      }

      VNode.component.exposed.show()
    }

    const objectToast = (params) => {
      setMessage(params, 'toast')
    }

    objectToast.hide = () => {
      toast.hide()
    }

    app.config.globalProperties.$toast = objectToast
    app.provide('Toast', objectToast)
  }
}