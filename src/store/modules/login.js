const state = {
  isLogin: false
}
const mutations = {
  doLogin(state){
    state.isLogin = true;
  }
}


const actions = {
  doLogin(context){
    context.commit('doLogin')
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}
