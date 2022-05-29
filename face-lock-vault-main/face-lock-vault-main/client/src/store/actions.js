import * as actionTypes from './actionTypes'

export const loginUser = (userData) => (dispatch) => {
    dispatch({
        type: actionTypes.SAVE_USER,
        payload: userData,
    })
}

export const logoutUser = () => (dispatch) => {
    dispatch({
        type: actionTypes.REMOVE_USER,
    })
}
