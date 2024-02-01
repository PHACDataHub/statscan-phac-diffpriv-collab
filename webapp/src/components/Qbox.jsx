import React, { useContext, useState, useEffect } from 'react';
import { contexts } from '../contexts/AppContext';

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
                <div className='overlay-background' style={{display: 'block'}}></div>
                <div className='overlay-cross' onClick={closeBox}>
                    <section style={{fontWeight:'bold',fontSize:'large',position:'absolute',top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}>X</section>
                </div>
                <div style={{position:'absolute',width:"50%",height:"50%",backgroundColor:"white",
                            top:"50%",left:"50%",transform:"translate(-50%,-50%)",overflowY:'scroll',
                            padding:'20px',border:'solid',borderRadius:'10px'}}>
                                <h1>{pageNo}</h1>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin laoreet convallis risus, vel venenatis nibh eleifend in. Sed a volutpat eros. Cras id risus sit amet quam finibus sollicitudin. Quisque eros tortor, tincidunt id lacus quis, pulvinar tincidunt tortor. Vivamus blandit finibus dui, eu eleifend est iaculis non. Aliquam neque metus, imperdiet non finibus sed, interdum vel quam. Donec blandit faucibus mi a rhoncus. Suspendisse ultricies et tellus et facilisis.

Suspendisse cursus facilisis orci, quis ultrices mauris vehicula ut. Aenean eros nisl, lobortis luctus lobortis eu, fringilla aliquet justo. Aliquam sed mi sed mauris varius imperdiet eget sit amet nisi. Maecenas id fermentum magna. Donec rutrum, ex nec imperdiet gravida, sem felis finibus turpis, in commodo odio ipsum non ante. Nullam felis tortor, condimentum vel leo sit amet, sodales convallis lorem. Mauris nibh ex, suscipit quis mauris et, viverra imperdiet dolor. Integer nulla magna, tristique ut blandit eu, accumsan at tortor. Donec lorem ipsum, scelerisque nec tellus a, cursus maximus metus. Praesent consequat malesuada risus, et eleifend risus dignissim et. Curabitur id interdum sapien, sit amet porttitor metus. Nullam id vulputate nisl. Suspendisse et gravida ipsum.

Duis vulputate interdum lectus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum lacinia hendrerit justo. Cras sagittis felis in enim pretium fringilla. Pellentesque non tristique felis. Aenean imperdiet tempus facilisis. Duis placerat ullamcorper viverra. Morbi varius tortor eu tortor suscipit, at semper risus faucibus. Nulla facilisi. Donec urna urna, laoreet eu volutpat sed, fermentum ut ex. Nulla ornare, enim in vehicula posuere, libero lectus varius elit, nec pellentesque diam enim vel urna. In sed elit justo. Nulla congue nisi nulla. Donec in sapien a tellus tempor mattis non sit amet erat.
                                </p>
                            </div>
            </div>
            <div ref={qboxRef} className='q-box' onClick={openBox}>
                <section style={{position:'absolute',top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}>?</section>
            </div>
        </>
    )
}

export default Qbox