class Helpers {

    static toCapitalize(str) {
        var splitStr = str.toLowerCase().split(' ');
        for (let i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        return splitStr.join(' ');
    }

    static hasClass(selector, className){
        let el = document.querySelector(selector);
        if ( el != null ){
            if (el.className.indexOf(className) !== -1) {
                return true;
            }
        }
        return false;
    }

    static addClass(selector, className){
        let el = document.querySelector(selector);
        if ( el != null ){
            if ( el.className.indexOf(className) === -1 ){
                el.className += " "+className;
            }
        }
    }

    static removeClass(selector, className){
        let el = document.querySelector(selector);
        if ( el != null ){
            el.className = el.className.replace(" "+className, "");
        }
    }

    static scrollToElement(selector){
        let el = document.querySelector(selector);
        let top = 0;

        function findValue(el){
            if( el.offsetTop === 0 && el.offsetParent !== null ){
                return findValue(el.offsetParent);
            } else {
                return el.offsetTop;
            }
        }
        top = findValue(el);
        if ( top === 0 ) return;

        window.scroll({
            top: top,
            left: 0,
            behavior: 'smooth'
        });
    }
}

export default Helpers;