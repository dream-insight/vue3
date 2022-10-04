const provide = {
  namespaced: true,
  state: () => ({
    count: 0,
  }),
  mutations: {
    mutIncrease(state, v) {
      state.count = v
    }
  },
  actions: {
    setIncrease({ state, commit }, flag) {
      let count = state.count

      count = (flag == '+') ? count + 1 : count -1

      commit('mutIncrease', count)
    }
  },
  getters: {
    getCount(state) {
      return state.count
    }
  }
}

export default provide