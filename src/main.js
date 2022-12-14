import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Modal from '@/components/modal'
import Spinner from '@/components/spinner'
import Toast from '@/components/toast'

import Tooltip from '@/components/tooltip'
import Pagination from '@/components/pagination'
import ListTable from '@/components/table'

import InputField from '@/components/form/inputField'
import NumberFormat from '@/components/form/numberFormat'
import SelectBox from '@/components/form/selectBox'
import CheckButton from '@/components/form/checkButton'
import SwitchButton from '@/components/form/switchButton'
import ValidateWrap from '@/components/form/validateWrap'
import ValidateForm from '@/components/form/validateForm'
import DatePicker from '@/components/form/datePicker'

// fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faExclamationTriangle, faInfoCircle, faBan, faCheckCircle,
  faAngleDoubleLeft, faAngleLeft, faAngleRight, faAngleDoubleRight,
  faQuestionCircle, faExclamationCircle, faArrowDown, faCalendarAlt
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faCheckCircle, faInfoCircle, faExclamationTriangle, faBan,
  faAngleDoubleLeft, faAngleLeft, faAngleRight, faAngleDoubleRight,
  faQuestionCircle, faExclamationCircle, faArrowDown, faCalendarAlt
)

async () => await router.isReady()

createApp(App)
  .use(store)
  .use(router)
  .use(Modal)
  .use(Spinner)
  .use(Toast)
  .component('Tooltip', Tooltip)
  .component('Pagination', Pagination)
  .component('ListTable', ListTable)
  .component('InputField', InputField)
  .component('NumberFormat', NumberFormat)
  .component('SelectBox', SelectBox)
  .component('CheckButton', CheckButton)
  .component('SwitchButton', SwitchButton)
  .component('DatePicker', DatePicker)
  .component('ValidateWrap', ValidateWrap)
  .component('ValidateForm', ValidateForm)
  .component('FontAwesomeIcon', FontAwesomeIcon)
  .mount('#app')
