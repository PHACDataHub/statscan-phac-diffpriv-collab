import React, { useContext, useState, useEffect } from 'react';
import SideBarItem from './SideBarItem'
import { contexts } from '../contexts/AppContext';

function Sidebar() {
    const {submittedData,finalOutput} = useContext(contexts.App.context);
    return (
        <div className='sidebar'>
            <SideBarItem pageNumber={1} text='Page 1' disabled={false}/>
            <SideBarItem pageNumber={2} text='Survey Form' disabled={false}/>
            <SideBarItem pageNumber={3} text='Tune Noise' disabled={Object.entries(submittedData).length == 0}/>
            <SideBarItem pageNumber={4} text='Final Result' disabled={Object.entries(finalOutput).length == 0}/>
        </div>
  )
}

export default Sidebar