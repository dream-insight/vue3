import { h, render, defineComponent } from 'vue'
import modalComponent from './component'

export default {
  install(app, options = null) {
    const body = document.querySelector('body')
    const modal = {}
    let VNode = null

    let modalStyleClass = '.modal-bg'
    let noScrollStyleClass = '.no-scroll'

    if (options !== null) {
      if (options.modalStyleClass !== undefined) {
        modalStyleClass = options.modalStyleClass
      }

      if (options.noScrollStyleClass !== undefined) {
        noScrollStyleClass = options.noScrollStyleClass
      }
    }

    const destroy = () => {
      if (VNode !== null) {
        render(null, VNode)
        VNode = null
      }
    }

    const setMessage = (opt, type) => {
      const props = {
        type,
        title: (type === 'alert') ? '알림' : '확인',
      }

      if (typeof opt === 'object') {
        if (opt.title !== undefined) {
          props.title = opt.title
        }

        if (opt.icon !== undefined) {
          props.icon = opt.icon
        }

        if (opt.width !== undefined) {
          if (!isNaN(parseInt(opt.width, 10))) {
            props.width = parseInt(opt.width, 10)
          }
        }

        if (opt.btnOkayText !== undefined) {
          props.btnOkayText = opt.btnOkayText
        }

        if (opt.btnCancelText !== undefined) {
          props.btnCancelText = opt.btnCancelText
        }

        if (typeof opt.okay === 'function') {
          props.okay = opt.okay
        }

        if (typeof opt.cancel === 'function') {
          props.cancel = opt.cancel
        }

        if (opt.modalStyleClass !== undefined) {
          props.modalStyleClass = opt.modalStyleClass
        } else {
          props.modalStyleClass = modalStyleClass
        }

        if (opt.noScrollStyleClass !== undefined) {
          props.noScrollStyleClass = opt.noScrollStyleClass
        } else {
          props.noScrollStyleClass = noScrollStyleClass
        }

        // 아이콘 표시사용시 설정 (component에서 위치 설정 필요)
        if (opt.icon === undefined) {
          if (type == 'alert') {
            props.icon = 'fas fa-volume-up'
          } else if (type == 'confirm') {
            props.icon = 'fas fa-question-circle'
          }
        }

        props.destroy = destroy

        props.message = opt.message
      } else {
        props.message = opt
      }

      if (VNode == null) {
        VNode = h(defineComponent(modalComponent), props)
        render(VNode, body)
      } else {
        VNode.component.props = props
      }

      VNode.component.exposed.show()
    }

    modal.alert = (params) => {
      setMessage(params, 'alert')
    }

    modal.confirm = (params) => {
      setMessage(params, 'confirm')
    }

    app.config.globalProperties.$modal = modal
    app.provide('Modal', modal)
  }
}