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
</template>

<script>
export default {
  name: 'listTablePrev',
  data() {
    return {
      header: [
        { text: '번호', width: '100' },
        { text: '제목', width: '' },
        { text: '수치', width: '' },
      ],
      items: [],
    }
  },
  created() {
    for (let i = 0; i < 20; i++) {
      this.items.push({
        no: i + 1,
        title: `테이블 목록 - ${i + 1}`,
        number: Math.floor(Math.random() * 10000000)
      })
    }
  }
}
</script>

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