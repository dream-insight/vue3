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