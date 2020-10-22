import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { Button, Card, message, Popconfirm } from 'antd'
import { SettingOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

const ProjectListItem = ({
  projectName
}) => {
  const [testing, setTesting] = useState(false)
  const history = useHistory()

  const startProject = () => {
    if (testing) return
    setTesting(true)
    axios.patch(`/api/project/${projectName}/status`, { running: true })
      .then(() => {
        message.success(`Project ${projectName} testing completed`, 5)
      }).catch(err => {
        message.error(err.response.data, 5)
      }).finally(() => {
        setTesting(false)
      })
  }

  const configProject = () => {
    if (testing) return
    history.push(`/project/${projectName}`)
  }
  const deleteProject = () => {
    if (testing) return
  }

  return (
    <Card
      title={projectName}
      size="small"
      extra={
        <React.Fragment>
          <SettingOutlined style={
            testing
              ? { color: 'gray', cursor: 'default', marginLeft: '15px' }
              : { color: 'blue', cursor: 'pointer', marginLeft: '15px' }
            } onClick={configProject}
          />
          {
            testing
              ? <DeleteOutlined style={{ color: 'gray', marginLeft: '5px' }} />
              : <Popconfirm
                title="Are you sure delete this project?"
                onConfirm={deleteProject}
                okText="Yes"
                cancelText="No"
                icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
              >
                <DeleteOutlined style={{ color: 'red', marginLeft: '5px' }} />
              </Popconfirm>
          }
        </React.Fragment>
      }
    >
      <Button type="primary" onClick={() => {startProject()}} loading={testing}>{ testing ? 'Testing' : 'Start Test' }</Button>
    </Card>
  )
}

export default ProjectListItem