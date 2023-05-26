import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import style from './index.less'

export const App = (): React.ReactElement => {
  return (
    <HashRouter>
      <Routes>
        <Route
          path='/'
          Component={() => {
            return <div className={style.title}>rwerwr</div>
          }}
        ></Route>
      </Routes>
    </HashRouter>
  )
}
