import React from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { Form, Input, Upload, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

const NewProject = () => {
  const history = useHistory()

  const normFile = e => {
    if (Array.isArray(e)) {
      return e
    }
    if (e.fileList.length > 1) {
      e.fileList = [e.fileList.pop()]
    }
    return e && e.fileList
  }

  const onFinish = values => {
    const formData = new FormData()
    formData.append('projectName', values.projectName)
    formData.append('serverUrl', values.serverUrl)
    formData.append('bundle', values.bundle[0].originFileObj)
    axios.post('/api/project', formData)
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  return (
    <Form
      style={{ padding: '0.5rem' }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item label="Project Name" name="projectName">
        <Input placeholder="Project Name" />
      </Form.Item>
      <Form.Item label="Server URL" name="serverUrl">
        <Input placeholder="Server URL" />
      </Form.Item>
      <Form.Item
        label="Front End Code"
        name="bundle"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        extra="Compress project bundle to .zip before upload"
      >
        <Upload
          name="bundle"
          beforeUpload={() => false}
          accept=".zip"
        >
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Submit</Button>
        <Button style={{ marginLeft: '0.5rem' }} onClick={() => history.push('/')}>Cancel</Button>
      </Form.Item>
    </Form>
  )
}

export default NewProject