import {
  REQUEST_PROJECT_LIST,
  RECEIVED_PROJECT_LIST,
  DELETE_PROJECT
} from './actions'

export function projectListReducer(state = { fetching: false, list: [] }, action) {
  switch(action.type) {
    case REQUEST_PROJECT_LIST:
      return Object.assign({}, state, { fetching: true })
    case RECEIVED_PROJECT_LIST:
      return Object.assign({}, state, { fetching: false, list: action.projectList })
    case DELETE_PROJECT:
      const index = state.list.indexOf(action.projectName)
      if (index > -1) {
        state.list.splice(index, 1)
      }
      return Object.assign({}, JSON.parse(JSON.stringify(state)))
    default:
      return state
  }
}
