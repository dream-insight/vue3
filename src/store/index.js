import { createStore } from 'vuex'

export default createStore({
  state: {
    event: '',
  },
  mutations: {
    mutEvent(state, v) {
      state.event = v
    }
  },
  actions: {
    setEvent({ commit }, flag = '') {
      commit('mutEvent', flag)
    }
  },
  getters: {
    getEvent(state) {
      return state.event
    }
  }
})
