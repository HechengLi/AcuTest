import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Spinner from '../../components/spinner/Spinner'
import ProjectListItem from '../../components/project/ProjectListItem'
import { getProjectList } from '../../store/projectList/actions'

const ProjectList = ({
  projectList,
  fetchingProjectList,
  getProjectList
}) => {
  useEffect(() => {
    getProjectList()
  }, [getProjectList])

  if (fetchingProjectList) {
    return (
      <Spinner />
    )
  }

  return (
    <div className="project-list">
      {
        projectList.map((projectName, i) => <ProjectListItem projectName={projectName} key={i} />)
      }
    </div>
  )
}

const mapStateToProps = state => ({
  projectList: state.projectList.list,
  fetchingProjectList: state.projectList.fetching
})

const mapDispatchToProps = dispatch => ({
  getProjectList: () => dispatch(getProjectList())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectList)