<script setup>
import { ref } from 'vue'

const header = ref([])
const items = ref([])

const setHeader = (flag) => {
  if (flag == 'add') {
    header.value = [
      { text: '번호', width: '100' },
      { text: '제목', width: '' },
      { text: '수치', width: '' },
    ]
  } else {
    header.value = []
  }
}

const setItems = (flag) => {
  if (flag === 'add') {
    for (let i = 0; i < 20; i++) {
      items.value.push({
        no: i + 1,
        title: `테이블 목록 - ${i + 1}`,
        number: Math.floor(Math.random() * 10000000)
      })
    }
  } else {
    items.value = []
  }
}
</script>

<template>
  <ListTable :header="header" :items="items">
    <template v-slot:items="{ props }">
      <tr>
        <td class="center">{{ props.no }}</td>
        <td>{{ props.title }}</td>
        <td class="right">{{ props.number }}</td>
      </tr>
    </template>
  </ListTable>

  <p>
    <button type="button" @click="setHeader('add')">해더 넣기</button>
  </p>
  <p>
    <button type="button" @click="setItems('add')">아이템 넣기</button>
  </p>
</template>

<style lang="scss">
table {
  width: 100%;
  border: 1px solid #444444;
  border-collapse: collapse;

  th,
  td {
    border: 1px solid #444444;
    padding: 10px;
  }

  .right {
    text-align: right
  }
  .center {
    text-align: center;
  }
}
</style>