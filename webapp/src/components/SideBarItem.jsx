import React, { useContext, useState, useEffect } from 'react';
import { contexts } from '../contexts/AppContext';
import { classNames } from '../initialStates';

function SideBarItem(props) {
    const {pageNo,setPageNo,submittedData,finalOutput} = useContext(contexts.App.context);
    const [className,setClassName] = useState('sidebaritem');

    const navigateToPage = () => {
        if(!props.disabled){
            //setPageNo(props.pageNumber);
            const height = Number(document.getElementsByClassName(classNames.getHeight)[0].clientHeight); 
            let pageNumber = props.pageNumber;
            if(pageNumber >= 7){
                if(Object.entries(submittedData).length == 0){
                    pageNumber -= 1;
                }
                if(Object.entries(finalOutput).length == 0){
                    pageNumber -= 1;
                }
            }
            window.scrollTo({top:height*(pageNumber-1),behavior: "smooth"});
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
        setClass();
    },[pageNo])

    return (
        <div className={className} style={props.style}>
            <section style={{position:'absolute',top:'50%',left:'50%',
                            transform:'translate(-50%,-50%)',fontWeight:'bold',
                            textAlign: 'center'}}>{props.text}</section>
            <div style={{position: 'absolute',width:'100%',height:'100%'}} 
                                                onMouseEnter={()=>onHover()}
                                                onMouseOut={()=>setClass()}
                                                onClick={()=>navigateToPage()}>
                                               </div>
        </div>
    )
    }

export default SideBarItem