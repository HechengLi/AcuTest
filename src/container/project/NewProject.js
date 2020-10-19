import React, { useState } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { Button, Form, Input, message, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

const NewProject = () => {
  const [saving, setSaving] = useState(false)
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
    setSaving(true)
    const formData = new FormData()
    formData.append('projectName', values.projectName)
    formData.append('serverUrl', values.serverUrl)
    formData.append('bundle', values.bundle[0].originFileObj)
    axios.post('/api/project', formData)
      .then(() => {
        message.success(`Project ${values.projectName} created successfully`, 5)
        history.push('/')
      }).catch(err => {
        message.error(`Project create failed: ${err.response.data}`, 5)
      }).finally(() => {
        setSaving(false)
      })
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
      <Form.Item
        label="Project Name"
        name="projectName"
        rules={[{ required: true, message: 'Please project name' }]}
      >
        <Input placeholder="Project Name" />
      </Form.Item>
      <Form.Item
        label="Server URL"
        name="serverUrl"
        rules={
          [
            { required: true, message: 'Please server url' },
            () => ({
              validator(rule, value) {
                if (
                  !value
                  || /^((http|https):\/\/)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(value)
                  || /^localhost:[0-9]{1,5}$/.test(value)
                ) {
                  return Promise.resolve();
                }
                return Promise.reject('Invalid server url');
              },
            })
          ]
        }
      >
        <Input placeholder="Server URL" />
      </Form.Item>
      <Form.Item
        label="Front End Code"
        name="bundle"
        rules={[{ required: true, message: 'Please select front end bundle' }]}
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
        <Button type="primary" htmlType="submit" loading={saving}>Submit</Button>
        <Button style={{ marginLeft: '0.5rem' }} onClick={() => history.push('/')}>Cancel</Button>
      </Form.Item>
    </Form>
  )
}

export default NewProject