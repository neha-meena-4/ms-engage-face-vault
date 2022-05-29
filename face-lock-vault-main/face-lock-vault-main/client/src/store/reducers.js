import * as actionTypes from './actionTypes'

const userInitialState = {
    loading: false,
    error: null,
    success: false,
    user: null,
}

export const userReducer = (state = userInitialState, action) => {
    switch (action.type) {
        case actionTypes.SAVE_USER:
            return { ...state, user: action.payload }

        case actionTypes.REMOVE_USER:
            return userInitialState

        default:
            return state
    }
}
