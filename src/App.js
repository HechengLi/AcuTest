import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import './App.css'

import ProjectList from './container/project/ProjectList'
import NewEditProject from './container/project/NewEditProject'

function App() {
  return (
    <Router>
      <div className="App">
        <header className="header">AcuTest</header>
        <Switch>
          <Route path="/" exact>
            <ProjectList />
          </Route>
          <Route path="/new_project">
            <NewEditProject />
          </Route>
          <Route path="/project/:projectName">
            <NewEditProject />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App
