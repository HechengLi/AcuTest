import axios from 'axios'

export const REQUEST_PROJECT_LIST = 'REQUEST_PROJECT_LIST'
export const RECEIVED_PROJECT_LIST = 'RECEIVED_PROJECT_LIST'

function requestProjectList() {
  return {
    type: REQUEST_PROJECT_LIST
  }
}

function receivedProjectList(projectList) {
  return {
    type: RECEIVED_PROJECT_LIST,
    projectList
  }
}
export function getProjectList() {
  return (dispatch, getState) => {
    if (getState().projectList.fetching) return
    dispatch(requestProjectList())
    axios.get('/api/project').then(response => {
      dispatch(receivedProjectList(response.data))
    })
  }
}