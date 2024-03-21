import { classNames,pageNumbers } from "../initialStates";

export const navigateToPage = (pageName) => {
    if(document.getElementsByClassName(classNames.getHeight).length > 0){
        const height = Number(document.getElementsByClassName(classNames.getHeight)[0].clientHeight); 
        const num = pageNumbers[pageName];
        window.scrollTo({top:height*(num-1),behavior: "smooth"});
    }
}