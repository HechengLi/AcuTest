import React from 'react'
import { useHistory } from 'react-router-dom'
import { Form, Input, Button } from 'antd'

const NewProject = () => {
  const history = useHistory()

  const onFinish = values => {
    console.log('Success:', values)
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
        <Input placeholder="input placeholder" />
      </Form.Item>
      <Form.Item label="Field B">
        <Input placeholder="input placeholder" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Submit</Button>
        <Button style={{ marginLeft: '0.5rem' }} onClick={() => history.push('/')}>Cancel</Button>
      </Form.Item>
    </Form>
  )
}

export default NewProject