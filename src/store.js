import { createStore } from 'redux'

const initialState = {
  sidebarShow: true,
  isAuthenticated: false,
  token: null,
  isLogout: false
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest };
      case 'SET_AUTHENTICATED':
        return { ...state, isAuthenticated: rest.payload };
      case 'SET_TOKEN':
        return { ...state, token: rest.payload };
        case 'SET_Logout':
        return { ...state, isLogout: rest.payload };
    default:
      return state
  }
}

const store = createStore(changeState)
export default store
