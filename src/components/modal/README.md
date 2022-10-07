# Modal component plugin

# 1. 사용방법
```javascript
// main.js
import Modal from '@/components/modal'

// opational config
const options = {
  modalStyleClass: '.modal-bg',
  noScrollStyleClass: '.no-scroll'
}

app.use(Modal, options)
```

```vue
<script setup>
import { inject } from 'vue'

// plugin
const Modal = inject('Modal')

function openModal(type = 'alert') {
  if (type == 'alert') {
    Modal.alert({
      message: 'test',
      okay: () => {
        console.log('okay!!!')
      }
    })
    // only messsage
    // Modal.alert('message...')
  } else {
    Modal.confirm({
      title: '역시 확인해주세요.',
      message: '이게 맞는 건가요?<br>맞다면 맞음 버튼 클릭',
      btnOkayText: '맞음',
      btnCancelText: '아니오',
      okay: () => {
        console.log('confirm!!!')
      }
    })
  }
}
</script>

<template>
  <p><button type="button" @click="openModal()">Alert 보기</button></p>
  <p><button type="button" @click="openModal('confirm')">Confirm 보기</button></p>
</template>
```

# 2. options
```javascript
{
  title: '',
  message: '',
  icon: '',
  width: 400,
  okay: null,
  cancel: null,
  btnOkayText: '확인',
  btnCancelText: '취소',
  modalStyleClass: '',
  noScrollStyleClass: ''
}
```
| Name | Type | Default | Require | Description |
|------|------|---------|---------|-------------|
| message | String | <code>''</code> | *true* | 표시 할 메시지를 |
| title | String | <code>''</code> | false | 창의 제목을 설정합니다. |
| icon | String | <code>''</code> | false | Font-Awesome 등의 아이콘을 표기 하기 위한 옵션 사용시에 별도의 설정이 필요합니다. |
| width | String, Number | <code>400</code> | false | 모달 창의 넓이를 조절 합니다. |
| okay | Function | <code>null</code> | false | 확인 버튼을 눌렀을때 실행할 callback 함수 |
| cancel | Function | <code>null</code> | false | 취소 버튼을 눌렀을대 실행할 callback 함수 |
| btnOkayText | String | <code>확인</code> | false | 확인 버튼에 표시할 문자열 |
| btnCancelText | String | <code>취소</code> | false | 취소 버튼에 표시할 문자열 |
| modalStyleClass | String | <code>.modal-bg</code> | false | 화면 전체를 가리는 레이아웃의 style class, <br> 꼭 .class-name 으로 입력해야 합니다.|
| noScrollStyleClass | String | <code>.no-scroll</code> | false | modal이 화면을 덮었을때 body 테그에 삽입될 스크롤 삭제 style class |

---

:arrow_left: [컴포넌트 목록으로이동](https://github.com/dream-insight/vue3/tree/main/src)