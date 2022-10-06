<template>
    <div :class="['find-post-code', {error: onError}]">
        <span class="form-inline mb-1">
            <input readonly type="text" class="form-control form-control-sm" placeholder="우편번호" v-model="addr[0]"  @click="findPostCode" />
            <button type="button" class="btn btn-secondary btn-sm ml-1" @click="findPostCode">주소검색</button>
        </span>
        <input readonly type="text" class="form-control form-control-sm block mb-1"  placeholder="주소" v-model="addr[1]" @click="findPostCode" />
        <input type="text" ref="extra" class="form-control form-control-sm block" placeholder="상세주소" v-model="addr[2]" />

        <p :class="['description', {error: errorTransition}]" v-if="message !== ''">
            <i class="fas fa-exclamation-circle" />
            {{message}}
        </p>

        <transition name="scale" v-if="!popup">
            <div id="postCode" v-show="showPostCode">
                <div class="wrap">
                    <div id="finder" ref="postCode"></div>
                    <a href="#" class="find-post-close" @click.prevent="close">우편번호 창 닫기</a>
                </div>
            </div>
        </transition>
        <transition appear name="fade" v-else>
            <div class="modal-bg" ref="popupPostCode" v-if="showPostCode">
                <transition appear name="scale">
                    <div class="modal-wrap" style="width: 400px;">
                        <h1>
                            우편번호 찾기
                            <a href="#" class="close" @click.prevent="close"><fa-icon name="times" /></a>
                        </h1>
                        <div class="modal-body" style="padding: 0 !important">
                            <div class="wrap" ref="postCode" style="width: 100%; height: 500px; position: relative"></div>
                        </div>
                    </div>
                </transition>
            </div>
        </transition>
    </div>
</template>

<script setup>
import {ref, reactive, watch, onMounted, defineProps, defineExpose, getCurrentInstance} from 'vue'

const ins = getCurrentInstance()
const {$loadScript} = {...ins.appContext.config.globalProperties}

const props = defineProps({
    modelValue: Array,
    popup: {
        type: Boolean,
        default: false
    },
    validate: {             // 유호성 검사
        type: [Boolean, String],
        default: false
    },
})

let showPostCode = ref(false)
let addr = ref(['', '', ''])
let message = ref('')
let onError = ref(false)
let errorTransition = ref(false)

const extra = ref(null)
const postCode = ref(null)

watch(() => props.modelValue, (a, b) => {
    if (a[0] != b[0] || a[1] != b[1] || a[2] != b[2]) {
        addr.value[0] = a[0]
        addr.value[1] = a[1]
        addr.value[2] = a[2]
    }
})

watch(addr, (v) => {
    errorTransition.value = false
    onError.value = false
    message.value = ''

    ins.emit('update:modelValue', v)
})

watch(errorTransition, (v) => {
    if (v) {
        setTimeout(() => {
            errorTransition.value = false
        }, 300)
    }
})

const findPostCode = () => {
    $loadScript('https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js')
    .then(() => {
        // 팝업으로 설정 되어 있을 경우 스크롤을 제거
        if (props.popup) {
            document.body.classList.add('no-scroll')
        }

        if (!props.popup) {
            setForm()
            showPostCode.value = true
        } else {
            showPostCode.value = true

            setTimeout(() => {
                setForm()
            }, 300)
        }
    }).catch(() => {
        toast({color: 'error', message: '주소 검색 호출에 실패 하였습니다. 다시 시도해 주세요.'})
    })
}

const setForm = () => {
    new daum.Postcode({
        oncomplete: (data) => {
            console.log(data)
            var addr = ''
            var detail = ''

            if (data.userSelectedType === 'R') {
                // 도로명 선택
                addr = data.roadAddress
            } else {
                // 지번 선택
                addr = data.jibunAddress
            }

            // 도로명 조합
            if (data.userSelectedType === 'R'){
                // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                    detail += data.bname
                }

                // 건물명이 있고, 공동주택일 경우 추가한다.
                if (data.buildingName !== '' && data.apartment === 'Y') {
                    detail += (detail !== '') ? ', ' + data.buildingName : data.buildingName
                }

                // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                if (detail !== '') {
                    detail = ` (${detail})`
                }

                addr += ' ' + detail
            }

            addr = [data.zonecode, addr, '']
            close()
            extra.focus()
        },
        width : '100%',
        height : '100%',
        maxSuggestItems : 5
    }).embed(postCode.value)
}

const check = () => {
    if (props.validate) {
        if (addr.value[0] == '' || addr.value[1] == '' || addr.value[2] == '') {
            onError.value = true
            errorTransition.value = true
            message.value = (typeof props.validate == 'string') ? props.validate : '주소는 필수 사항입니다.'

            return false
        }
    }

    return true
}

const close = () => {
    // 제거된 스크롤 원복
    if (props.popup) {
        document.body.classList.remove('no-scroll')
    }

    showPostCode.value = false
}

onMounted(() => {
    console.log(ins)
})

defineExpose({
    check
})
</script>

<style scoped>
.block {display: block; width: 100%;}
input + input {margin-left: 0 !important;}
.btn {height: 31px !important; line-height: 29px !important;}
#postCode {position: absolute; left: 0; top: 0; height: 100%; width: 100%;}
#postCode .wrap {width: 100%; height: 100%; position: relative;}
#postCode .wrap #finder {position: absolute; top: 0; left: 0; width: 100%; height: calc(100% - 40px);}
#postCode .wrap .find-post-close {
    position: absolute; display: block; left: 0; bottom: 0; z-index: 1000; width: 100%; height: 40px;
    background-color: #000; color: #fff; line-height: 40px; text-align: center; font-size: 16px; font-weight: bold
}

.find-post-code.error input {border: 2px solid #ff5252;}
.find-post-code.error .description {color: #ff5252}
.description.error {animation: shaking .3s;}
.description {padding: 0 !important; margin-bottom: 0 !important; border: 0 !important;}

/* error message shaking */
@keyframes shaking {
    0% {transform: translateX(5px)}
    25% {transform: translateX(-5px)}
    50% {transform: translateX(5px)}
    75% {transform: translateX(-5px)}
    100% {transform: translateX(5px)}
}
</style>