# Spinner component plugin

# 1. 사용방법
```javascript
// main.js
import Spinner from '@/components/spinner'

// optional config
const options = {
  limitTimeout: 10,
  delay: 0,
}

app.use(Spinner, options)
```

```vue
<script setup>
import { ref, inject } from 'vue'

const Spinner = inject('Spinner')

let timer = ref(0)
let message = ref('버튼을 클릭해서 스피너를 확인 하세요.')

function setTimer(time) {
  timer.value = time

  const interval = setInterval(() => {
    time--
    timer.value = time

    if (time < 0) {
      clearInterval(interval)
      message.value = '버튼을 클릭해서 스피너를 확인 하세요.'
    }
  }, 1000)
}

async function show(flag = 0) {
  message.value = ''

  if (flag == 0) {
    setTimer(10)
    Spinner.show()
  } else {
    setTimer(8)
    await Spinner.delay(3).show()
    Spinner.delay(5).hide()
  }
}
</script>

<template>
  <p v-if="message">{{ message }}</p>
  <p v-else>{{ timer }}초 이후 스피너가 닫힙니다.</p>
  <button type="button" @click="show()">10초 보기</button>
  <button type="button" @click="show(1)">3초 후에 5초 보기</button>
  <button type="button" @click="show(2)">스피너 보기 (3초 2초 딜레이 후 사라짐)</button>
</template>

<style lang="scss" scoped>
button + button { margin-left: 5px; }
</style>
```

# 2. options
```javascript
{
  limitTimeout: 10,
  delay: 0,
}
```
| Name | Type | Default | Require | Description |
|-------|---- |---------|---------|-------------|
| limitTime | Number | <code>10</code> | false | 스피너가 보여진 이후 <code>hide()</code> 메서드 호출이 없을 경우 표시되는 최대 시간(초 단위) |
| delay | Number | <code>0</code> | false | <code>show(), delay()</code> 실행시 지연 시간 설정 (초 단위) |

# 3. API methods
### <code>show(?msg)</code>
* 스피너 레이아웃을 표시합니다.
```javascript
spinner.show()
// or
spinner.show('please wait...')
```

### <code>hide()</code>
* 스피너 레이아웃을 즉시 숨깁니다.
```javascript
spinner.hide()
```

### <code>delay(number)</code>
* 메서드 실행을 딜레이 시켜 줍니다. (Promise)
```javascript
await spinner.delay(2).show() // 2초 후 스피너 표시
await spinner.delay(10).hide() // 스피너가 표시 중이라면 10초 후 숨김
```

### <code>timeout(number)</code>
* limitTimeout 설정을 변경 합니다.
```javascript
await spinner.timeout(5).show() // 5초 후 스피너가 표시 중이라면 숨김
```

---

:arrow_left: [컴포넌트 목록으로이동](https://github.com/dream-insight/frontEnd/tree/main/src)