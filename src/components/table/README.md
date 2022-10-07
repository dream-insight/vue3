# Tooltip component

# 1. 사용방법
```javascript
// main.js
import tooltip from '@/components/tooltip'

Vue.component('tooltip', tooltip)
```

```vue
<template>
  <div class="wrap">
    <p>
      <tooltip top message="위에 나오는 메시지" />
    </p>
    <p>
      <tooltip right message="오른쪽에 나오는 메시지" />
    </p>
    <p>
      <tooltip left width="200" message="왼쪽에 나오는 메시지">
        slot 활용가능
        <font-awesome-icon icon="fas fa-question-circle" />
      </tooltip>
    </p>
    <p>
      <tooltip :message="message">
        <font-awesome-icon icon="fas fa-question-circle" />
        slot 활용가능
      </tooltip>
    </p>
  </div>
</template>

<script>
export default {
  name: 'tooltipPrev',
  data() {
    return {
      message: [
        '아래에서 나오는 메시지',
        '매시지를 목록으로 전달 가능'
      ]
    }
  }
}
</script>

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

```
npm install @fortawesome/fontawesome-svg-core
npm install @fortawesome/free-solid-svg-icons
npm install @fortawesome/vue-fontawesome
```

```javascript
// main.js
// fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

library.add(faQuestionCircle)

Vue.component('font-awesome-icon', FontAwesomeIcon)
```

:arrow_left: [컴포넌트 목록으로이동](https://github.com/dream-insight/vue3/tree/main/src)