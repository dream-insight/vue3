# Pagination component

# 1. 사용방법
```javascript
// main.js
import Pagination from '@/components/pagination'
app.component('Pagination', Pagination)
```

```vue
<script setup>
import { ref } from 'vue'

let total = ref(16723)
let pageSize = ref(10)
let page = ref(1)
</script>

<template>
  <p>현제 페이지는 {{ page }} 입니다.</p>
  <div class="wrap">
    <Pagination :total="total" :size="pageSize" v-model="page" />
  </div>
</template>

<style>
@import url('https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css');

.wrap {
  width: 90%;
  margin: auto;
}
</style>
```

# 2. Props
| Name | Type | Default | Require | Description |
|------|------|---------|---------|-------------|
| modelValue | Number | <code>none</code> | *true* | page 번호 (v-model) |
| total | Number | <code>0</code> | false | 페이지 넘버링을 만들 전체 수량 |
| size | Number | <code>10</code> | false | 페이지당 나눌 크키 (total / size) |
| block | Number | <code>10</code> | false | 페이지 넘버링 수량 |

## 3. 그 외
### Fontawsome 과 함께 사용하여야 icon 표시 가능
```vue
<style>
@import url("https://use.fontawesome.com/releases/v5.4.2/css/all.css");
</style>
```
> Fontawesome component는 표시 안되는 오류로 인해 사용 불가(추후 수정 가능)

:arrow_left: [컴포넌트 목록으로이동](https://github.com/dream-insight/frontEnd/tree/main/src)