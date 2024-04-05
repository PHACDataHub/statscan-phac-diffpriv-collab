import React, { useState, useEffect, useRef } from 'react';

const inc = 0.01;
const threshold = [...Array(1/inc),1].map((_, i) => (i*inc))
const options = {
root : null,
rootMargin : "0px",
threshold: threshold
}

const options2 = {
root : null,
rootMargin : "0px",
threshold: 0.70
}

const callback = (entries,observer) => {
    entries.forEach(entry => {
        const intersectionRatio = entry.intersectionRatio;
        let val = 0;
        for(let x = 1; x < threshold.length; x++){
        if(intersectionRatio >= threshold[x-1] && intersectionRatio <= threshold[x]){
            val = threshold[x];
            break;
        }
        }
        const startOpacity = 0;
        const endOpactity = 1;
        const opacity = startOpacity + ((endOpactity - startOpacity) * val)

        const startX = -150;
        const endX = -50;
        const X = startX + ((endX - startX) * val);
        const el = entry.target.parentElement.children[1];   
        el.style.opacity = opacity;
        el.style.transform = `translate(${X}%,-50%)`;
    });
}

export const callback2 = (entries,observer) => {
    const el = document.getElementsByClassName('progressbar')[0];
    console.log(this)
    let previousWidth = this.previousWidth;
    entries.forEach(entry => {
        const fromWidth = previousWidth.current;
        let toWidth = previousWidth.current;
        const timing = {duration: 500,iterations: 1};
        if(entry.target.classList.contains('page1') && entry.isIntersecting){
            toWidth = '25%' ;
        }
        else if(entry.target.classList.contains('form') && entry.isIntersecting){
            toWidth = '50%';
        }
        else if(entry.target.classList.contains('submittedData') && entry.isIntersecting){
            toWidth = '75%';
        }
        else if(entry.target.classList.contains('finalOutput') && entry.isIntersecting){
            toWidth = '100%';
        }
        console.log(fromWidth,toWidth);
        document.getElementsByClassName('progressbar')[0].animate({width: [fromWidth,toWidth]},timing)
        previousWidth.current = toWidth;          
        el.style.width = toWidth;
    })
}

export const observer = new IntersectionObserver(callback,options);
export const pageObserver = new IntersectionObserver(callback2,options2);


