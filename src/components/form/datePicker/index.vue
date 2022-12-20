<script setup>
import DateController from './dateController'

import { ref, reactive, watch, computed, onMounted, defineProps, defineEmits, defineExpose } from 'vue'

const emit = defineEmits()
const props = defineProps({
  modelValue: [String, Array],
  validate: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: [String, Array],
  },
  range: {
    type: Boolean,
    default: false
  },
  // 년, 월, 일 사이 구분 표시
  separator: {
    type: String,
    default: '-'
  },
  minYear: {
    type: Number,
    default: 1900,
  },
  maxYear: {
    type: Number,
    default: parseInt(new Date().getFullYear()) + 10
  }
})

const el = ref(null)

let isShow = ref(false)
let picker = ref(null)
let holderText = ref('')

let nowChecked = ref(0)
let toggleDateButton = ref([
  { text: '오늘', checked: false },
  { text: '어제', checked: false },
  { text: '최근 7일', checked: false },
  { text: '최근 30일', checked: false },
  { text: '이번 달', checked: false },
  { text: '지난 달', checked: false }
])

const show = reactive({
  start: true,
  end: true
})

const transitionName = reactive({
  start: '',
  end: ''
})

const timeout = {
  start: null,
  end: null
}

let curYear = ref(2019)
let curMonth = ref(12)
let curDay = ref(1)

const head = ['일', '월', '화', '수', '목', '금', '토']

const dateRender = reactive({
  start: [],
  end: [],
})

const dateState = reactive({
  start: {
    year: 2019,
    month: 11,
    day: 1,
  },
  end: {
    year: 2019,
    month: 11,
    day: 1,
  }
})

const opt = reactive({
  year: [],
  month: []
})

const selected = reactive({
  start: {
    date: '',
    day: 0
  },
  end: {
    date: '',
    day: 0
  },
})

const timeState = {
  start: 0,
  end: 0,
}

let selectedError = ref('')

let message = ref('')
let onError = ref(false)
let errorTransition = ref(false)
let isValidate = ref(true)

watch([() => selected.start.date, () => selected.end.date], () => {
  resetError()
})

watch(errorTransition, (v) => {
  if (v) {
    setTimeout(() => {
      errorTransition.value = false
    }, 300)
  }
})

watch(() => props.modelValue, (v) => {
  if (props.range) {
    selected.start.date = v[0]
    selected.end.date = v[1]
  } else {
    selected.start.date = v
  }
})

watch(() => props.validate, () => {
  message.value = ''
  isValidate.value = true
  errorTransition.value = false
})

const startDate = computed(() => {
  let v = selected.start.date

  // 시작일 종료일 텍스트 표시 선택된 날짜가 있는 경우 선택된 날짜로 표시
  if (selected.start.day === 0) {
    v = dateFormat(dateState.start.year, dateState.start.month, dateState.start.day)
  }

  return v
})

const endDate = computed(() => {
  let v = selected.end.date

  if (selected.end.day === 0) {
    v = dateFormat(dateState.end.year, dateState.end.month, dateState.end.day)
  }

  return v
})

const selectedDateView = computed(() => {
  let v = ''

  if (selectedError.value != '') {
    v = selectedError.value
  } else if (selected.start.date !== '' && selected.end.date !== '') {
    v = `${selected.start.date} ~ ${selected.end.date}`
  }

  return ''
})

const init = () => {
  const date = new Date()

  curYear.value = date.getFullYear()
  curMonth.value = date.getMonth()
  curDay.value = date.getDate()

  dateState.start.year = date.getFullYear()
  dateState.start.month = date.getMonth()
  dateState.start.day = date.getDate()
  dateState.end.year = date.getFullYear()
  dateState.end.month = date.getMonth()
  dateState.end.day = date.getDate()

  selected.start.date = ''
  selected.end.date = ''
  timeState.start = 0
  timeState.end = 0
}

const toggleCalendar = () => {
  // 달력 표시 전 처리
  const bodyRect = document.body.getBoundingClientRect()
  const rect = el.value.getBoundingClientRect()
  const pickerWidth = props.range ? 480 : 230
  const pickerHeight = props.range ? 454 : 280

  // 포지션이 아래쪽으로 치우쳤다면 위로 나오게 변경한다.
  if (window.innerHeight < rect.bottom + pickerHeight) {
    picker.value.style.top = ''
    picker.value.style.bottom = `${Math.floor(window.innerHeight - rect.top) + 5}px`

    if (bodyRect.width / 2 < rect.x) {
      picker.value.style.transformOrigin = 'bottom right'
      picker.value.style.left = `${Math.floor(rect.x + rect.width) - pickerWidth}px`
    } else {
      picker.value.style.transformOrigin = 'bottom left'
    }
  } else {
    picker.value.style.bottom = ''
    picker.value.style.top = `${Math.floor(rect.top + rect.height) + 5}px`

    if (bodyRect.width / 2 < rect.x) {
      picker.value.style.transformOrigin = 'top right'
      picker.value.style.left = `${Math.floor(rect.x + rect.width) - pickerWidth}px`
    } else {
      picker.value.style.transformOrigin = 'top left'
    }
  }

  isShow.value = !isShow.value
}

const makeCanlendar = (flag) => {
  // 달력 생성
  const startWeek = new Date(dateState[flag].year, dateState[flag].month, 1).getDay()
  const lastDay = new Date(dateState[flag].year, dateState[flag].month + 1, 0).getDate()

  let day = 1
  let afterDay = 1
  let beforeDay = getBeforeDay(dateState[flag].year, dateState[flag].month, startWeek)

  // 달력 총 7일 6줄을 생성한다
  for (let i = 0; i < 6; i++) {
    dateRender[flag][i] = []
  }

  let objData = {}

  for (let j = 0; j < (6 * 7); j++) {
    if (j >= startWeek && day <= lastDay) {
      let formatDate = dateFormat(dateState[flag].year, dateState[flag].month, day)

      if (selected[flag].date === formatDate) {
        objData = { day, type: 'date-start' }
      } else if (dateState[flag].year === curYear.value && dateState[flag].month === curMonth.value && day === curDay.value) {
        objData = { day, type: 'today' }
      } else {
        objData = { day, type: 'current' }
      }

      // 시작 날짜와 끝 날짜 사이에 색상 표시
      if (objData.type !== 'today') {
        if (props.range && selected.start.date !== '' && selected.end.date !== '') {
          let time = new Date(dateState[flag].year, dateState[flag].month, day).getTime()

          if (time >= timeState.start && time <= timeState.end) {
            if (flag === 'start' && time > timeState.start) {
              objData.type = 'date-range'
            } else if (flag === 'end' && time < timeState.end) {
              objData.type = 'date-range'
            }
          }
        }
      }

      day++
    } else if (day > lastDay) {
      objData = { day: afterDay, type: 'afterMonth' }
      afterDay++
    } else if (j < startWeek) {
      objData = { day: beforeDay, type: 'beforeMonth' }
      beforeDay++
    }

    dateRender[flag][Math.floor(j / 7)][j % 7] = objData
  }
}

const getBeforeDay = (year, month, week) => {
  // 전달의 마지막 날짜 표시
  const day = new Date(year, month, 0).getDate()

  return day - week + 1
}

const changeMonth = (flag, increase) => {
  // 버튼을 통해 달을 변경
  let change = false

  if (increase === 1 || increase === -1) {
    // 월별 이동 (computed 에서 최종 처리)
    if (dateState[flag].month === 11 && increase > 0) {
      // 지정된 최대 년도보다 높아지지 않도록 처리
      if (dateState[flag].year + 1 < props.maxYear) {
        dateState[flag].month = 0
        dateState[flag].year += 1
        change = true
      }
    } else if (dateState[flag].month === 0 && increase < 0) {
      if (dateState[flag].year - 1 > 1900) {
        dateState[flag].month = 11
        dateState[flag].year -= 1
        change = true
      }
    } else {
      dateState[flag].month += increase
      change = true
    }
  } else {
    // 년 단위 이동
    if (increase === 12 && dateState[flag].year < props.maxYear) {
      dateState[flag].year += 1
      change = true
    } else if (increase === -12 && dateState[flag].year > 1900) {
      dateState[flag].year -= 1
      change = true
    }
  }

  if (change) {
    // transition animate
    if (increase > 0) {
      transitionName[flag] = 'trans-left'
    } else {
      transitionName[flag] = 'trans-right'
    }
    show[flag] = false

    clearTimeout(timeout[flag])

    timeout[flag] = setTimeout(() => {
      makeCanlendar(flag)
      show[flag] = true
    }, 150)
  }
}

const changeYearMonth = (flag, target, value) => {
  // 년 월 select box 변경 이벤트
  dateState[flag][target] = value

  // transition animate
  transitionName[flag] = 'trans-down'
  show[flag] = false

  clearTimeout(timeout[flag])

  timeout[flag] = setTimeout(() => {
    makeCanlendar(flag)
    show[flag] = true
  }, 150)
}

const pickCaseDate = (flag) => {
  toggleDateButton.value[nowChecked.value].checked = false
  toggleDateButton.value[flag].checked = true

  nowChecked.value = flag

  let date = new Date()

  if (flag === 4) {
    date = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  } else if (flag === 5) {
    date = new Date(date.getFullYear(), date.getMonth(), 0)
  }

  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()

  if (month.toString().length === 1) {
    month = '0' + month.toString()
  }

  if (day.toString().length === 1) {
    day = '0' + day.toString()
  }

  let format = `Y${props.separator}m${props.separator}d`

  switch (flag) {
    case 0:
      selected.start.date = date.getDateFormat(format, 0)
      selected.endd.date = date.getDateFormat(format, 0)
      break
    case 1:
      selected.start.date = date.getDateFormat(format, -1)
      selected.end.date = date.getDateFormat(format, -1)
      break
    case 2:
      selected.start.date = date.getDateFormat(format, -6)
      selected.end.date = date.getDateFormat(format, 0)
      break
    case 3:
      selected.start.date = date.getDateFormat(format, -29)
      selected.end.date = date.getDateFormat(format, 0)
      break
    case 4:
    case 5:
      selected.start.date = `${year}${props.separator}${month}${props.separator}01`
      selected.end.date = `${year}${props.separator}${month}${props.separator}${day}`
      break
  }

  // 해당 달력으로 변환
  let start = selected.start.date.split(props.separator)
  let end = selected.end.date.split(props.separator)

  dateState.start.year = parseInt(start[0], 10)
  dateState.start.month = parseInt(start[1], 10) - 1
  dateState.start.day = parseInt(start[2], 10)

  dateState.end.year = parseInt(end[0], 10)
  dateState.end.month = parseInt(end[1], 10) - 1
  dateState.end.day = parseInt(end[2], 10)

  timeState.start = new Date(dateState.start.year, dateState.start.month, dateState.start.day).getTime()
  timeState.end = new Date(dateState.end.year, dateState.end.month, dateState.end.day).getTime()

  // transition animate
  clearInterval(timeout.start)

  transitionName.start = 'trans-down'
  transitionName.end = 'trans-down'

  show.start = false
  show.end = false

  timeout.start = setTimeout(() => {
    makeCanlendar('start')
    makeCanlendar('end')

    show.start = true
    show.end = true
  }, 150)

  updateValue()
}

const selectedDay = (tr, td, flag = 'start') => {
  selectedError.value = ''

  // 날짜 선택
  const type = dateRender[flag][tr][td].type
  const day = dateRender[flag][tr][td].day

  if (type === 'current' || type === 'today' || type === 'date-range') {
    selected[flag].day = day

    if (flag === 'start') {
      selected.start.date = dateFormat(dateState.start.year, dateState.start.month, selected.start.day)
      timeState.start = new Date(dateState.start.year, dateState.start.month, selected.start.day).getTime()
    } else {
      selected.end.date = dateFormat(dateState.end.year, dateState.end.month, selected.end.day)
      timeState.end = new Date(dateState.end.year, dateState.end.month, selected.end.day).getTime()
    }

    if (props.range && timeState.start > 0 && timeState.end > 0) {
      // 범위 선택 달력일 경우 종료일이 시작일보다 빠르지 않도록 처리
      if (timeState.start > timeState.end) {
        selected.end.date = ''
        timeState.end = 0

        selectedError.value = '종료일이 시작일 보다 날짜가 빠릅니다.'
      }
    }

    // 달력을 다시 그려준다.
    makeCanlendar('start')

    if (props.range) {
      makeCanlendar('end')
    } else {
      emit('update:modelValue', selected.start.date)
      isShow.value = false
    }
  }
}

const dateFormat = (year, month, day) => {
  let date = `${year}-`

  if (month + 1 < 10) {
    date += `0${(month + 1)}-`
  } else {
    date += `${(month + 1)}-`
  }

  if (day < 10) {
    date += `0${day}`
  } else {
    date += day.toString()
  }

  return date
}

const cancel = () => {
  resetForm()
  isShow.value = false
}

const accept = () => {
  updateValue()
  isShow.value = false
}

const updateValue = () => {
  // 종료 날짜가 시작 날짜보다 작지 않을 경우 데이터 적용
  if (props.range) {
    if (selected.start.date && selected.end.date) {
      emit('update:modelValue', [selected.start.date, selected.end.date])
    } else {
      selected.start.date = ''
      selected.end.date = ''

      emit('update:modelValue', ['', ''])
    }
  } else {
    emit('update:modelValue', selected.start.date)
  }
}

const resetForm = () => {
  init()

  if (props.range) {
    makeCanlendar('start')
    makeCanlendar('end')
    emit('update:modelValue', ['', ''])
  } else {
    makeCanlendar('start')
    mit('update:modelValue', '')
  }
}

const resetError = () => {
  message.value = ''
  onError.value = false
  errorTransition.value = false
  isValidate.value = true
}

const check = () => {
  // 데이터 검증
  if (props.validate.length) {
    for (let i = 0; i < props.validate.length; i++) {
      let result1 = true
      let result2 = true

      if (props.range) {
        result1 = props.validate[i].call(null, selected.start.date)
        result2 = props.validate[i].call(null, selected.end.date)
      } else {
        result1 = props.validate[i].call(null, selected.start.date)
      }

      if (result1 !== true || result2 !== true) {
        message.value = result1
        onError.value = true
        errorTransition.value = true
        isValidate.value = false

        return false
      } else {
        message.value = ''
      }
    }
  }

  return true
}

Date.prototype.getDateFormat = function(format, days = 0) {
  let date = this

  if (days !== 0) {
    const time = date.getTime()
    date = new Date(time + (86400 * days * 1000))
  }

  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let dYear = date.getFullYear()
  let dMonth = month
  let dDay = day

  if (month.toString().length === 1) {
    dMonth = `0${month}`
  }

  if (day.toString().length === 1) {
    dDay = `0${day}`
  }

  return format
    .replace('Y', dYear)
    .replace('m', dMonth)
    .replace('d', dDay)
    .replace('y', year)
    .replace('n', month)
    .replace('j', day)
}

init()
makeCanlendar('start')

if (props.range) {
  makeCanlendar('end')
  holderText.value = ['', '']
}

if (props.placeholder) {
  holderText.value = props.placeholder
}

if (props.modelValue) {
  if (props.range) {
    selected.start.date = props.modelValue[0]
    selected.end.date = props.modelValue[1]
  } else {
    selected.start.date = props.modelValue
  }
}

onMounted(() => {
  picker.value = el.value.querySelector('#picker')

  document.addEventListener('click', evt => {
    if (isShow.value) {
      const classList = evt.target.classList.value
      const indexOf1 = classList.indexOf('current')
      const indexOf2 = classList.indexOf('today')
      const indexOf3 = classList.indexOf('date-range')

      if (indexOf1 === -1 && indexOf2 === -1 && indexOf3 === -1) {
        isShow.value = el.value.contains(evt.target)
      }
    }
  })

  document.addEventListener('scroll', () => {
    const rect = el.value.getBoundingClientRect()
    picker.value.style.top = (rect.top + rect.height + 5) + 'px'

    if (isShow.value) {
      isShow.value = false
    }
  })
})

defineExpose({
  check,
  resetForm
})
</script>

<template>
  <div ref="el" :class="['date-picker', { error: onError }]">
    <div class="wrap" @click="toggleCalendar">
      <div class="picker-date-text">
        <template v-if="range">
          <input
            type="text"
            :placeholder="holderText[0]"
            :value="modelValue[0]"
          />
          <FontAwesomeIcon class="icon-cal" :icon="['fas', 'calendar-alt']" />
          &nbsp;&nbsp;~&nbsp;&nbsp;
          <input
            type="text"
            :placeholder="holderText[1]"
            :value="modelValue[1]"
          />
          <FontAwesomeIcon class="icon-cal" :icon="['fas', 'calendar-alt']" />
        </template>

        <template v-else>
          <input
            type="text"
            :placeholder="holderText"
            :value="modelValue"
          />
          <FontAwesomeIcon class="icon-cal" :icon="['fas', 'calendar-alt']" />
        </template>
      </div>

      <p :class="['description', { error: errorTransition }]" v-if="!isValidate">
        <FontAwesomeIcon class="ml-1" :icon="['fas', 'exclamation-circle']" />
        {{ message }}
      </p>
    </div>

    <template v-if="range">
      <transition name="picker-scale">
        <div id="picker" class="picker-popup" v-show="isShow">
          <div class="search-date">
            <a
              href="#"
              :class="[v.checked ? 'active' : '']"
              :key="v.text" @click.prevent="pickCaseDate(i)"
              v-for="(v, i) in toggleDateButton">
              {{ v.text }}
            </a>
          </div>
          <div class="picker-wrap" tabindex="0">
            <div class="calendar start_calendar">
              <div class="start-end-text">시작일</div>

              <date-controller
                :is-show="isShow"
                :year="dateState.start.year"
                :month="dateState.start.month"
                :max-year="maxYear"
                :min-year="minYear"
                @change-month="changeMonth('start', $event)"
                @set-year="changeYearMonth('start', 'year', $event)"
                @set-month="changeYearMonth('start', 'month', $event)"
              />

              <div class="select-calendar-wrap">
                <transition :name="transitionName.start">
                  <div class="select-calendar" v-show="show.start">
                    <ul class="header">
                      <li
                        :class="{ sun: i === 0, sat: i === 6 }"
                        :key="`start-head-${name}`"
                        v-for="(name, i) in head">
                        {{ name }}
                      </li>
                    </ul>
                    <ul
                      :key="`start-tr-${i}`"
                      v-for="(li, i) in dateRender.start">
                      <li
                        :key="`start-${item.type}-${item.day}`"
                        :class="[item.type, { sun: j === 0, sat: j === 6 }]"
                        @click.prevent="selectedDay(i, j)"
                        v-for="(item, j) in li">
                        {{ item.day }}
                      </li>
                    </ul>
                  </div>
                </transition>
              </div>
            </div>
            <div class="calendar end_calendar">
              <div class="start-end-text">종료일</div>

              <DateController
                :is-show="isShow"
                :year="dateState.end.year"
                :month="dateState.end.month"
                :max-year="maxYear"
                :min-year="minYear"
                @change-month="changeMonth('end', $event)"
                @set-year="changeYearMonth('end', 'year', $event)"
                @set-month="changeYearMonth('end', 'month', $event)"
              />

              <div class="select-calendar-wrap">
                <transition :name="transitionName.end">
                  <div class="select-calendar" v-show="show.end">
                    <ul class="header">
                      <li
                        :class="{ sun: i === 0, sat: i === 6 }"
                        :key="`end-head-${name}`"
                        v-for="(name, i) in head" >
                        {{ name }}
                      </li>
                    </ul>
                    <ul
                      :key="`end-tr-${i}`"
                      v-for="(li, i) in dateRender.end">
                      <li
                        :key="`end-${item.type}-${item.day}`"
                        :class="[item.type, { sun: j === 0, sat: j === 6 }]"
                        @click.prevent="selectedDay(i, j, 'end')"
                        v-for="(item, j) in li">
                        {{ item.day }}
                      </li>
                    </ul>
                  </div>
                </transition>
              </div>
            </div>

            <div class="btn-area">
              <div :class="['select-date', { 'selected-error': selectedError }]">
                {{ selectedDateView }}
              </div>
              <div>
                <a href="#" class="btn cancel" @click.prevent="cancel">취소</a>
                <a href="#" class="btn okay" @click.prevent="accept">확인</a>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </template>

    <!-------------------------------- 날짜 단일 선택 달력 ---------------------------------->
    <template v-else>
      <transition name="picker-scale">
        <div id="picker" class="picker-popup single" v-show="isShow">
          <div class="picker-wrap">
            <div class="calendar-inner">
              <div class="calendar">

                <DateController
                  :is-show="isShow"
                  :year="dateState.start.year"
                  :month="dateState.start.month"
                  :max-year="maxYear"
                  :min-year="minYear"
                  @change-month="changeMonth('start', $event)"
                  @set-year="changeYearMonth('start', 'year', $event)"
                  @set-month="changeYearMonth('start', 'month', $event)"
                />

                <div class="select-calendar-wrap">
                  <transition :name="transitionName.start">
                    <div class="select-calendar" v-show="show.start">
                      <ul class="header">
                        <li
                          :key="`start-head-${name}`"
                          :class="{ sun: i === 0, sat: i === 6 }"
                          v-for="(name, i) in head">
                          {{ name }}
                        </li>
                      </ul>
                      <ul
                        :key="`start-tr-${i}`"
                        v-for="(li, i) in dateRender.start">
                        <li
                          :key="`start-${item.type}-${item.day}`"
                          :class="[item.type, { sun: j === 0, sat: j === 6 }]"
                          @click.prevent="selectedDay(i, j)"
                          v-for="(item, j) in li">
                          {{ item.day }}
                        </li>
                      </ul>
                    </div>
                  </transition>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </template>
  </div>
</template>

<style lang="scss">
@import './style.scss';
</style>