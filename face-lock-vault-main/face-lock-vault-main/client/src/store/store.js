import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import { userReducer } from './reducers'

const rootReducer = combineReducers({
    user: userReducer,
})

const middleware = [thunk]
const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(...middleware))
)

export default store
