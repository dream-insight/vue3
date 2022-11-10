<script setup>
import Selector from './selector'

import { ref, watch, defineProps, defineEmits } from 'vue'

const emit = defineEmits()
const props = defineProps({
  isShow: Boolean,
  maxYear: Number,
  minYear: Number,
  year: Number,
  month: Number,
})

let selectedYear = ref(0)
let selectedMonth = ref(0)
let showYearSelector = ref(false)
let showMonthSelector = ref(false)

watch(() => props.isShow, (bool) => {
  if (!bool) {
    showMonthSelector.value = false
    showYearSelector.value = false
  }
})

watch(() => props.year, (v) => {
  selectedYear.value = v
})

watch(() => props.month, (v) => {
  selectedMonth.value = v
})


const toggleSelector = (flag = 'year') => {
  if (flag === 'month') {
    showYearSelector.value = false
    showMonthSelector.value = !showMonthSelector.value
  } else {
    showMonthSelector.value = false
    showYearSelector.value = !showYearSelector.value
  }
}

const setYearMonth = (target, value) => {
  emit(`set-${target}`, value)
}

const changeMonth = (increase) => {
  emit('change-month', increase)
}

selectedYear.value = props.year
selectedMonth.value = props.month
</script>

<template>
  <div class="select-month">
    <button type="button" class="prev2" @click="changeMonth(-12)">
      <FontAwesomeIcon class="arrow-icon" :icon="['fas', 'angle-double-left']" />
    </button>

    <button type="button" class="prev" @click="changeMonth(-1)">
      <FontAwesomeIcon class="arrow-icon" :icon="['fas', 'angle-left']" />
    </button>

    <div class="date-text">
      <em @click="toggleSelector()">
        {{ year }}년

        <Selector
          :max="maxYear"
          :date="selectedYear"
          :is-show="showYearSelector"
          @selected="setYearMonth('year', $event)"
          v-show="showYearSelector"
        />
      </em>
      <em @click="toggleSelector('month')">
        {{ month + 1 }}월

        <Selector
          :date="selectedMonth"
          @selected="setYearMonth('month', $event)"
          :is-show="showMonthSelector"
          v-show="showMonthSelector"
        />
      </em>
    </div>

    <button type="button" class="next" @click="changeMonth(1)">
      <FontAwesomeIcon class="arrow-icon" :icon="['fas', 'angle-right']" />
    </button>

    <button type="button" class="next2" @click="changeMonth(12)">
      <FontAwesomeIcon class="arrow-icon" :icon="['fas', 'angle-double-right']" />
    </button>
  </div>
</template>
