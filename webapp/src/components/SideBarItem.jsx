import React, { useContext, useState, useEffect } from 'react';
import { contexts } from '../contexts/AppContext';
import { classNames } from '../initialStates';

function SideBarItem(props) {
    const {pageNo,setPageNo} = useContext(contexts.App.context);
    const [className,setClassName] = useState('sidebaritem');

    const navigateToPage = () => {
        if(!props.disabled){
            //setPageNo(props.pageNumber);
            const height = Number(document.getElementsByClassName(classNames.getHeight)[0].clientHeight); 
            const num = props.pageNumber;
            window.scrollTo({top:height*(num-1),behavior: "smooth"});
        }
    }
    const setClass = () => {
        if(pageNo === props.pageNumber){
            setClassName('selectedSideBarItem');
        }
        else{
            setClassName('sidebaritem');
        }
    }

    const onHover = () => {
        if(!props.disabled){
            setClassName('selectedSideBarItem');
        }
    }

    useEffect(() => {
        setClass()
    },[pageNo])
    return (
        <div className={className} >
            <section style={{position:'absolute',top:'50%',left:'50%',
                            transform:'translate(-50%,-50%)',fontWeight:'bold'}}>{props.text}</section>
            <div style={{position: 'absolute',width:'100%',height:'100%'}} 
                                                onMouseEnter={()=>onHover()}
                                                onMouseOut={()=>setClass()}
                                                onClick={()=>navigateToPage()}>
                                               </div>
        </div>
    )
    }

export default SideBarItem