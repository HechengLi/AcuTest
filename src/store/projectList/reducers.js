import {
  REQUEST_PROJECT_LIST,
  RECEIVED_PROJECT_LIST
} from './actions'

export function projectListReducer(state = { fetching: false, list: [] }, action) {
  switch(action.type) {
    case REQUEST_PROJECT_LIST:
      return Object.assign({}, state, { fetching: true })
    case RECEIVED_PROJECT_LIST:
      return Object.assign({}, state, { fetching: false, list: action.projectList })
    default:
      return state
  }
}