import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useHistory, useParams } from 'react-router-dom'
import { Button, Form, Input, message, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import Spinner from '../../components/spinner/Spinner'

const NewEditProject = () => {
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  let { projectName } = useParams()
  const [form] = Form.useForm()

  useEffect(() => {
    if (projectName) {
      setLoading(true)
      axios.get(`/api/project/${projectName}`).then(response => {
        const { projectName, serverUrl } = response.data
        form.setFieldsValue({ projectName })
        form.setFieldsValue({ serverUrl })
      }).catch(err => {
        message.error('Project load failed', 5)
      }).finally(() => {
        setLoading(false)
      })
    }
  }, [projectName, form])

  const normFile = e => {
    if (Array.isArray(e)) {
      return e
    }
    if (e.fileList.length > 1) {
      e.fileList = [e.fileList.pop()]
    }
    return e && e.fileList
  }

  const create = values => {
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

  const update = values => {
    setSaving(true)
    const formData = new FormData()
    formData.append('serverUrl', values.serverUrl)
    if (values.bundle) formData.append('bundle', values.bundle[0].originFileObj)
    axios.put(`/api/project/${projectName}`, formData)
      .then(() => {
        message.success(`Project ${values.projectName} saved successfully`, 5)
        history.push('/')
      }).catch(err => {
      message.error(`Project save failed: ${err.response.data}`, 5)
    }).finally(() => {
      setSaving(false)
    })
  }

  const onFinish = values => {
    if (projectName) update(values)
    else create(values)
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <Form
      style={{ padding: '0.5rem' }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      form={form}
    >
      <Form.Item
        label="Project Name"
        name="projectName"
        rules={[{ required: !projectName, message: 'Please project name' }]}
      >
        <Input disabled={projectName} placeholder="Project Name" />
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
                  || /^((http|https):\/\/)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(value)
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
        rules={[{ required: !projectName, message: 'Please select front end bundle' }]}
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

export default NewEditProject