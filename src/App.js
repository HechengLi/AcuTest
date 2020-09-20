import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import './App.css'

import Alert from './components/alert/Alert'
import ProjectList from './container/project/ProjectList'
import NewProject from './container/project/NewProject'

import { connect } from 'react-redux'

function App({ alerts}) {
  const alertElements = <div className="alert-holder">
    {
      Object.keys(alerts).map(key => (
        <Alert message={alerts[key].message} type={alerts[key].type} key={key} />
      ))
    }
  </div>

  return (
    <Router>
      <div className="App">
        <header className="header">AcuTest</header>
        {alertElements}
        <Switch>
          <Route path="/" exact>
            <ProjectList />
          </Route>
          <Route path="/new_project">
            <NewProject />
          </Route>
          <Route path="/:project">
            <div>project</div>
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

const mapStateToProps = state => ({
  alerts: state.alerts
})

export default connect(
  mapStateToProps
)(App)
