<script setup>
import { ref, reactive } from 'vue'

let checkbox1 = ref([])
let checkbox2 = ref([''])
let radio = ref('')
let text = ref('')
let area = ref('')
let number = ref(0)
let select = ref('')
let bool = ref(false)
let boolValue = ref('T')
let label = ref(['동의 안함', '동의'])
let date = ref('')
let dateRange = ref(['', ''])
let files = ref([])

const form = ref(null)
const opt = reactive({
  checkbox: [],
  select: [],
})

const rules = {
  checkbox: [v => !(v.length == 0) || '항목을 하나 이상 선택해주세요.'],
  radio: [v => !!v || '항목을 하나 선택해주세요.'],
  input: [v => !!v || '필수 입력 항목입니다.'],
  select: [v => !!v || '필수 선택 항목입니다.'],
  file: [v => !!v.length || '파일을 선택해주세요.'],
  date: [v => !!v || '날짜를 선택해주세요.']
}

function fileSelected(evt) {
  if (evt.target.files.length) {
    files.value = evt.target.files
  } else {
    files.value = []
  }
}

function validate() {
  form.value.validate()
}

for (let value = 1; value <= 10; value++) {
  opt.checkbox.push({ text: `체크버튼${value}`, value })
  opt.select.push({ text: `선택 - ${value}`, value })
}
</script>

<template>
  <div>
    <div class="wrap">
      <ValidateForm ref="form">
        <p>
          <h5>버튼 형식 checkbox</h5>
          <CheckButton
            button
            name="check1"
            :max-check="3"
            :validate="rules.checkbox"
            :items="opt.checkbox"
            v-model="checkbox1"
          />
        </p>
        <p>
          <h5>일반 checkbox</h5>
          <CheckButton
            all
            name="check2"
            :items="opt.checkbox"
            v-model="checkbox2"
          />
        </p>
        <p>
          <h5>radio</h5>
          <CheckButton
            type="radio"
            name="check3"
            :validate="rules.radio"
            :items="opt.checkbox"
            v-model="radio"
          />
        </p>
        <p>
          <h5>input field</h5>
          <InputField
            block
            placeholder="이곳에 입력해주세요"
            :validate="rules.input"
            v-model="text"
          />
        </p>
        <p>
          <h5>textarea</h5>
          <InputField
            block
            multiline
            placeholder="이곳에 입력해주세요"
            :rows="10"
            :validate="rules.input"
            v-model="area"
          />
        </p>
        <p>
          <h5>input field number</h5>
          <InputField
            :validate="rules.input"
            v-model="number"
          />
        </p>
        <p>
          <h5>select box</h5>
          <select-box
            placeholder="한 가지 항목을 선택해주세요"
            :validate="rules.select"
            :options="opt.select"
            v-model="select"
          />
        </p>
        <p>
          <h5>date picker</h5>
          <DatePicker :validate="rules.date" v-model="date" />
        </p>
        <p>
          <h5>range date picker</h5>
          <DatePicker range :validate="rules.date" v-model="dateRange" />
        </p>
        <p>
          <h5>switch button</h5>
          <SwitchButton validate="설정으로 바꿔주세요." v-model="bool" />
        </p>
        <p>
          <h5>small size switch button</h5>
          <SwitchButton
            small
            validate
            true-value="T"
            false-value="F"
            :label="label"
            v-model="boolValue"
          />
        </p>
        <p>
          <h5>validate wrapping</h5>
          <ValidateWrap :validate="rules.file" :check-value="files">
            <input type="file" @change="fileSelected" />
          </ValidateWrap>
        </p>
      </ValidateForm>

      <p>
        <button type="button" @click="validate">유효성 검사</button>
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrap {
  width: 400px;
}

h5 {
  margin-bottom: 5px;
}
</style>