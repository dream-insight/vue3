import { h, render, defineComponent } from 'vue'
import SpinnerComponent from './component'

export default {
  install: (app, options = null) => {
    const body = document.querySelector('body')
    let VNode = null
    const props = {
      limitTime: 10,
      destroy: () => {
        if (VNode !== null) {
          render(null, VNode)
          VNode = null
        }
      }
    }

    const objectSpinner = {
      init() {
        if (VNode === null) {
          if (options !== null) {
            if (options.limitTime !== undefined) {
              props.limitTime = options.limitTime
            }
          }


          if (VNode === null) {
            VNode = h(defineComponent(SpinnerComponent), props)
            render(VNode, body)
          } else {
            VNode.component.props = props
          }
        }
      },

      /**
       * spinner 최대 표시 시간을 설정
       *
       * @param { Number } limit 최대 표시 시간 기본 10초
       * @returns
       */
      timeout(limit) {
        this.init()

        if (limit) {
          VNode.component.props.limitTime = limit
        }

        return this
      },

      /**
       * Spinner를 표시 하기 위한 메서드
       *
       * @param { String } msg 박스 하단 부분에 표시될 text
       */
      async show(msg = '') {
        this.init()
        await VNode.component.exposed.show(msg)
      },

      /**
       * 채이닝 이후 메서드 실행을 지연시키기 위한 메서드
       *
       * @param { Number } sec 지연 시간 (초)
       * @returns { Object } 메서드 채이닝을 위한 this 반환
       */
      delay(sec) {
        this.init()
        VNode.component.exposed.delay.value = sec

        return this
      },

      /**
       * 스피너를 닫아 줍니다.
       */
      hide() {
        this.init()
        VNode.component.exposed.hide()
      }
    }

    // window.spinner = objectSpinner
    // app.config.globalProperties.$spinner = objectSpinner
    app.provide('Spinner', objectSpinner)
  }
}