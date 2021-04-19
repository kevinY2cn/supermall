const state = {
  isLogin: false
}

const mutations = {
  doLogin(state){
    state.isLogin = true;
  }
}


export default {
  namespace: true,
  state,
  mutations
}
