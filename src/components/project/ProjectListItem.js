import React from 'react'
import axios from 'axios'
import { Button, Card, Popconfirm } from 'antd'
import { SettingOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

const ProjectListItem = ({
  projectName
}) => {
  const startProject = () => {
    axios.patch(`/api/project/${projectName}/status`, { running: true, port: 5000, mockServerUrl: 'http://localhost:8000' })
  }
  const deleteProject = () => {}

  return (
    <Card
      title={projectName}
      size="small"
      extra={
        <React.Fragment>
          <SettingOutlined style={{ color: 'blue', cursor: 'pointer', marginLeft: '15px' }} onClick={() => {console.log(123)}} />
          <Popconfirm
            title="Are you sure delete this project?"
            onConfirm={() => deleteProject()}
            okText="Yes"
            cancelText="No"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          >
            <DeleteOutlined style={{ color: 'red', marginLeft: '5px' }} />
          </Popconfirm>
        </React.Fragment>
      }
    >
      <Button type="primary" onClick={() => {startProject()}}>Start Test</Button>
    </Card>
  )
}

export default ProjectListItem