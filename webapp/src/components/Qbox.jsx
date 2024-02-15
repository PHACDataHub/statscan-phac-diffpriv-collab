import React, { useContext, useState, useEffect } from 'react';
import { contexts } from '../contexts/AppContext';
import {jsx} from '../initialStates'

function Qbox() {
    const {pageNo,qboxRef} = useContext(contexts.App.context);
    const number = qboxRef.current == null ? 'None' : qboxRef.current.pageNo; 
    const openBox = () => {
        const overlay = document.getElementsByClassName('overlay')[0];
        const qbox = document.getElementsByClassName('q-box')[0];
        overlay.animate(
            {
                scale: [0,1]
            },
            {
                duration: 300,
                iterations: 1,
            }
        )
        qbox.animate(
            {
                transform : ["translate(95vw,90vh)","translate(120vw,120vh)"]
            },
            {
                duration: 500,
                iterations: 1,
            }
        )
        overlay.style.scale = 1;
        qbox.style.transform = "translate(120vw,120vh)";
        document.body.style.overflowY = 'hidden';
        //alert(qboxRef.current.pageNo)
    }

    const closeBox = () => {
        const overlay = document.getElementsByClassName('overlay')[0];
        const qbox = document.getElementsByClassName('q-box')[0];
        overlay.animate(
            {
                scale: [1,0]
            },
            {
                duration: 300,
                iterations: 1,
            }
        )
        qbox.animate(
            {
                transform : ["translate(120vw,120vh)","translate(95vw,90vh)"]
            },
            {
                duration: 500,
                iterations: 1,
            }
        )
        overlay.style.scale = 0;
        qbox.style.transform = "translate(95vw,90vh)";
        document.body.style.overflowY = '';
    }

    return (
        <>
            <div className='overlay' style={{display: 'block'}}>
                <div className='overlay-background' style={{display: 'block'}} onClick={closeBox}></div>
                <div className='overlay-cross' onClick={closeBox}>
                    <section style={{fontWeight:'bold',fontSize:'large',position:'absolute',top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}>X</section>
                </div>
                <div style={{position:'absolute',width:"50%",height:"50%",backgroundColor:"white",
                            top:"50%",left:"50%",transform:"translate(-50%,-50%)",overflowY:'scroll',
                            padding:'20px',border:'solid',borderRadius:'10px'}}>
                                <h1>{pageNo}</h1>
                                {jsx[pageNo]}
                            </div>
            </div>
            <div ref={qboxRef} className='q-box' onClick={openBox}>
                <section style={{position:'absolute',top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}>?</section>
            </div>
        </>
    )
}

export default Qbox