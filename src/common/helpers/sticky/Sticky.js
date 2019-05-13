class Sticky {

    constructor(element){
        let el = document.querySelector('.'+element);
        if (el !== null){
            let referenceBottom = document.createElement('div');
            let className = "js-is-sticky";
            let subClassName = "js-is-sticky-truck";
            let height = el.offsetHeight;
            referenceBottom.className = "stickybottom";
            el.after(referenceBottom);
            el.className += " sticky-wrapper";
            window.addEventListener("scroll",function (e) {
                let s = document.scrollingElement.scrollTop;
                let r = referenceBottom.offsetTop;
                if(r <= s){
                    if( r <= s && (r + height) >= s && el.className.indexOf(className) !== -1 ){
                        if( el.className.indexOf(subClassName) === -1 ) el.className += " "+subClassName;
                    }else{
                        if( el.className.indexOf(className) === -1 ) el.className += " "+className;
                        referenceBottom.style.height = height+'px';
                    }
                } else {
                    el.className = el.className.replace(" "+className, "").replace(" "+subClassName, "");
                    referenceBottom.style.height = '';
                }
            });
        }
    }

}

export default Sticky;