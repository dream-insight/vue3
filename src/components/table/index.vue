<script setup>
/**
 * 해당 컴포넌트는 정렬기능을 활성화 시킨 상태에서
 * 라인당 추가되는 하위 데이터에 대한 변화를 감지 하지 못합니다.
*/
import { ref, watch, defineProps, defineEmits } from 'vue'

const emit = defineEmits()
const props = defineProps({
  // 목록 최상단 라벨링 Array:[{text: String, width: Number, sort: Boolean, target: String(sort target)}] *
  header: {
    type: Array,
    default: () => []
  },
  footer: {
    type: Array,
    default: () => []
  },
  // 테이블 목록 Array:[] *
  items: {
    type: Array,
    required: true
  },
  // 목록이 없을 경우 표시할 텍스트 String:''
  emptyText: {
    type: String,
    default: '데이터가 없습니다.'
  },
  // 설정시 라인 색상이 적용 되지 않음
  noHoverBg: {
    type: Boolean,
    default: false
  },
  width: {
    type: String,
    default: ''
  },
  // 리스트 체크 여부 Boolean:false
  checkAll: {
    type: Boolean,
    default: false
  },
  multiHeader: {
    type: Number,
    default: 0,
  }
})

let checked = ref(false)
let colspan = ref(0)
let tableHeader = ref([])
let dataList = ref([])
let target = ref('')
let order = ref('')
let isInit = ref(false)

const listTableCheck = ref(null)

watch(() => props.header, () => setHeader())
watch(() => props.items, (data) => {
  if (target.value != '') {
    dataList.value = { ...data }
    sorting()
  }

  if (props.checkAll) {
    listTableCheck.value.checked = false
  }
})


const setHeader = () => {
  if (props.header.length) {
    // 정렬이 지정되어 있는 경우 해당 컬럼을 정렬해준다.
    if (props.multiHeader > 0) {
      props.header.forEach((head, i) => {
        tableHeader.value.push([])

        tableHeader.value[i] = head.map(item => {
          if (item.order) {
            order.value = item.order
            target.value = item.target
          }

          return {
            text: item.text,
            width: item.width,
            sort: item.sort ? true : false,
            target: item.target,
            colspan: !!item.colspan ? item.colspan : false,
            rowspan: !!item.rowspan ? item.rowspan : false,
            order: item.order,
            align: !item.align ? 'center' : item.align
          }
        })
      })
    } else {
      tableHeader.value = props.header.map(item => {
        if (item.order) {
          order.value = item.order
          target.value = item.target
        }

        return {
          text: item.text,
          width: item.width,
          sort: item.sort,
          target: item.target,
          colspan: !!item.colspan ? item.colspan : false,
          rowspan: !!item.rowspan ? item.rowspan : false,
          order: item.order,
          align: !item.align ? 'center' : item.align
        }
      })
    }
  }
}

const checkAllEvent = (evt) => {
  emit('checked', evt.target.checked)
}

const setSort = (target, order) => {
  target.value = target

  if (order === 'desc') {
    order.value = 'asc'
  } else if (order === 'asc') {
    order.value = ''
  } else {
    order.value = 'desc'
  }

  sorting()
}

const sorting = () => {
  if (target.value !== '') {
    if (order.value) {
      dataList.value.sort((a, b) => {
        let condA = parseInt(a[target.value])
        let condB = parseInt(b[target.value])

        if (order.value == 'asc') {
          if (condA > condB) {
            return 1
          } else if (condA == condB) {
            return 0
          } else if (condA < condB) {
            return -1
          }
        } else {
          if (condA > condB) {
            return -1
          } else if (condA == condB) {
            return 0
          } else if (condA < condB) {
            return 1
          }
        }
      })
    } else {
      if (props.items.length) {
        dataList.value = { ...props.items }
      }
    }

    if (props.multiHeader > 0) {
      tableHeader.value.forEach(main => {
        main.forEach(item => {
          if (item.target === target.value) {
            item.order = order.value
          } else {
            item.order = ''
          }
        })
      })
    } else {
      tableHeader.value.forEach(item => {
        if (item.target === target.value) {
          item.order = order.value
        } else {
          item.order = ''
        }
      })
    }

    emit('@sortChange', {
      data: { ...this.dataList },
      target: target.value,
      order: order.value
    })
  }
}

setHeader()

if (props.multiHeader) {
  colspan.value = props.multiHeader + (props.checkAll ? 1 : 0)
} else {
  colspan.value = props.header.length + (props.checkAll ? 1 : 0)
}

if (props.items.length && target.value !== '') {
  dataList.value = { ...this.items }
}
</script>

<template>
  <table class="list-table">
    <thead v-if="multiHeader === 0">
      <tr>
        <th width="50" v-if="checkAll">
          <input type="checkbox" ref="listTableCheck" @click="checkAllEvent" />
        </th>
        <th
          :width="(item.width ? item.width : '')"
          :key="'head' + item.text"
          v-for="item in tableHeader">
          <div
            :class="['columns', item.align]"
            @click.prevent="setSort(item.target, item.order)"
            v-if="item.sort && dataList.length">
            <div class="sort-cell-text">{{ item.text }}</div>
            <span :class="['sorting rotate', item.order]">
              <transition appear name="icon-scale">
                <span class="order-icon" v-if="item.order">
                  <i class="fas fa-drrow-down"></i>
                </span>
              </transition>
            </span>
          </div>
          <span v-else>{{ item.text }}</span>
        </th>
      </tr>
    </thead>
    <thead v-else>
      <th width="50" :rowspan="tableHeader.length" v-if="checkAll">
        <input type="checkbox" ref="listTableCheck" @click="checkAllEvent" />
      </th>
      <tr v-for="(headLine, i) in tableHeader" :key="`h${i}`">
        <th
          :colspan="item.colspan"
          :rowspan="item.rowspan"
          :width="item.width ? item.width : ''"
          :key="`th${i}${j}`"
          v-for="(item, j) in headLine">
          <div
            :class="['hand flex-row', `justify-${item.align}`]"
            @click="setSort(item.target, item.order)"
            v-if="item.sort && dataList.length">
            <div style="margin-right: 5px;">{{ item.text }}</div>
            <span :class="['sorting rotate', item.order]">
              <transition appear name="icon-scale">
                <span class="order-icon" v-if="item.order">
                  <i class="fas fa-drrow-down"></i>
                </span>
              </transition>
            </span>
          </div>
          <span v-else>{{ item.text }}</span>
        </th>
      </tr>
    </thead>

    <tbody :class="{'no-hover-bg': noHoverBg}" v-if="items.length > 0">
      <slot name="bodyTop"></slot>

      <template v-if="dataList.length > 0">
        <slot name="items" v-for="(item, index) in dataList" :props="item" :index="index"></slot>
      </template>
      <template v-else>
        <slot name="items" v-for="(item, index) in items" :props="item" :index="index"></slot>
      </template>
    </tbody>
    <tbody v-else>
      <tr>
        <td class="no-data" :colspan="colspan">
          <div>{{ emptyText }}</div>
        </td>
      </tr>
    </tbody>

    <tfoot v-if="footer.length > 0">
      <tr>
        <template v-for="(item, i) in footer">
          <th
            :colspan="item.colspan"
            :class="item.align"
            :width="item.width"
            :key="`foot${i}`"
            v-if="item.tag == 'th'">
            {{ item.value }}
          </th>
          <td
            :colspan="item.colspan"
            :class="item.align"
            :width="item.width"
            :key="`foot-${i}`"
            v-else>
            <b>{{ item.value }}</b>
          </td>
        </template>
      </tr>
    </tfoot>
    <tfoot v-else>
      <slot name="footer"></slot>
    </tfoot>
  </table>
</template>
