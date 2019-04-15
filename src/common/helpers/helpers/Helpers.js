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

    static calcularDigitoVerificacion(myNit)  {
        var vpri,
            x,
            y,
            z;

        // Se limpia el Nit
        myNit = myNit.toString();
        myNit = myNit.replace ( /\s/g, "" ) ; // Espacios
        myNit = myNit.replace ( /,/g,  "" ) ; // Comas
        myNit = myNit.replace ( /\./g, "" ) ; // Puntos
        myNit = myNit.replace ( /-/g,  "" ) ; // Guiones

        // Se valida el nit
        if  ( isNaN ( myNit ) )  {
            return "" ;
        }

        // Procedimiento
        vpri = new Array(16) ;
        z = myNit.length ;

        vpri[1]  =  3 ;
        vpri[2]  =  7 ;
        vpri[3]  = 13 ;
        vpri[4]  = 17 ;
        vpri[5]  = 19 ;
        vpri[6]  = 23 ;
        vpri[7]  = 29 ;
        vpri[8]  = 37 ;
        vpri[9]  = 41 ;
        vpri[10] = 43 ;
        vpri[11] = 47 ;
        vpri[12] = 53 ;
        vpri[13] = 59 ;
        vpri[14] = 67 ;
        vpri[15] = 71 ;

        x = 0 ;
        y = 0 ;
        for  ( var i = 0; i < z; i++ )  {
            y = ( myNit.substr (i, 1 ) ) ;
            x += ( y * vpri[z-i] ) ;
        }

        y = x % 11 ;
        return ( y > 1 ) ? 11 - y : y ;
    }
}

export default Helpers;