import React, { useContext, useState, useEffect } from 'react';
import SideBarItem from './SideBarItem'
import { contexts } from '../contexts/AppContext';
import { pageNumbers } from '../initialStates';

function Sidebar() {
    const {submittedData,finalOutput} = useContext(contexts.App.context);
    return (
        <div className='sidebar'>
            <SideBarItem pageNumber={pageNumbers['page1']} text='Page 1' disabled={false} style={{display:'none'}}/>
            <SideBarItem pageNumber={pageNumbers['page2']} text='What Is LDP?' disabled={false} style={{marginTop:'20px'}}/>
            <SideBarItem pageNumber={pageNumbers['page3']} text='Index' disabled={false}/>
            <SideBarItem pageNumber={pageNumbers['surveyForm']} text='Survey Form' disabled={false}/>
            <SideBarItem pageNumber={pageNumbers['intermediate']} text='Tune Noise' disabled={Object.entries(submittedData).length == 0}/>
            <SideBarItem pageNumber={pageNumbers['finalResults']} text='Final Result' disabled={Object.entries(finalOutput).length == 0}/>
            <SideBarItem pageNumber={pageNumbers['goingForward']} text='Going Forward' disabled={false} style={{display:'none'}}/>
        </div>
  )
}

export default Sidebar