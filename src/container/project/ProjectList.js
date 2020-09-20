import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import Spinner from '../../components/spinner/Spinner'
import ProjectListItem from '../../components/project/ProjectListItem'
import { getProjectList } from '../../store/projectList/actions'

const ProjectList = ({
  projectList,
  fetchingProjectList,
  getProjectList
}) => {
  const history = useHistory()

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
      <div className="new-project ant-card ant-card-bordered ant-card-small" style={{ width: 94 }} >
        <Button
          size="small"
          type="link"
          onClick={() => history.push('/new_project')}
        >
          <PlusOutlined />
        </Button>
      </div>
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