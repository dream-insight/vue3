# Tooltip component

# 1. 사용방법
```javascript
// main.js
import Tooltip from '@/components/tooltip'

app.component('Tooltip', Tooltip)
```

```vue
<script setup>
import { ref } from 'vue'

let message = ref([
  '아래에서 나오는 메시지',
  '매시지를 목록으로 전달 가능'
])
</script>

<template>
  <div class="wrap">
    <p>
      <Tooltip top message="위에 나오는 메시지" />
    </p>
    <p>
      <Tooltip right message="오른쪽에 나오는 메시지" />
    </p>
    <p>
      <Tooltip left width="200" message="왼쪽에 나오는 메시지">
        slot 활용가능
        <i class="fas fa-question-circle"></i>
      </Tooltip>
    </p>
    <p>
      <Tooltip :message="message">
        <i class="fas fa-question-circle"></i>
        slot 활용가능
      </Tooltip>
    </p>
  </div>
</template>

<style lang="scss" scoped>
.wrap {
  padding: 200px;
  text-align: center;
}
</style>
```

# 2. Prop
| Name | Type | Default | Require | Description |
|-------|---- |---------|---------|-------------|
| message | String, Array | <code>''</code> | *true* | 툴팁 메시지, 배열입력시 리스트 형태로 출력 |
| left | Boolean | <code>false</code> | false | 메시지를 왼쪽에 표시 |
| right | Boolean | <code>false</code> | false | 메시지를 오른쪽에 표시 |
| top | Boolean | <code>false</code> | false | 메시지를 위쪽에 표시 |
| bottom | Boolean | <code>true</code> | false | 메시지를 아랫쪽에 표시 |
| width | Number | <code>300</code> | false | 메시지를 box의 최대 넓이(고정) |

## 3. 그 외
### Fontawsome 과 함께 사용하여야 icon 표시 가능
```vue
<style>
@import url("https://use.fontawesome.com/releases/v5.4.2/css/all.css");
</style>
```
> Fontawesome component는 표시 안되는 오류로 인해 사용 불가(추후 수정 가능)

:arrow_left: [컴포넌트 목록으로이동](https://github.com/dream-insight/vue3/tree/main/src)