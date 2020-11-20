
#!/bin/bash

usage() { exit 1; }

while getopts ":a:b:c:d:e:f:g:h:" o; do
    case "${o}" in
        a)
            a=${REACT_APP_DOMAIN}
            ;;
        b)
            b=${REACT_APP_KEY}
            ;;
        c)
            c=${REACT_APP_OFICINA}
            ;; 
        d)
            d=${REACT_APP_PDF_SARLAFT}
            ;;
        e)
            e=${REACT_APP_PERSON}
            ;;     
        f)
            f=${REACT_APP_ACCESS_TOKEN}
            ;; 
        g)
            g=${REACT_APP_ACCESS_TOKEN}
            ;; 
        h)
            h=${REACT_APP_CREARPOLIZAIAXIS}
            ;;                     
        *)
            usage
            ;;
    esac
done
shift $((OPTIND-1))


echo "
    REACT_APP_DOMAIN=${a}
    REACT_APP_KEY=${b}
    REACT_APP_OFICINA=${c}
    REACT_APP_PDF_SARLAFT=${d}
    REACT_APP_PERSON=${e}
    REACT_APP_ACCESS_TOKEN=${f}
    REACT_APP_ATTACH_POLICY_DOCUMENTS=${g}
    REACT_APP_CREARPOLIZAIAXIS=${h}
    " > .env

if [ -z "${a}" ] || [ -z "${b}" ] || [ -z "${c}" ] || [ -z "${d}" ] || [ -z "${e}" ] || [ -z "${f}" ] || [ -z "${g}" ] || [ -z "${h}" ]; then      
    usage
fi

echo "REACT_APP_DOMAIN=${a}"
echo "REACT_APP_KEY=${b}"
echo "REACT_APP_OFICINA=${c}"
echo "REACT_APP_PDF_SARLAFT=${d}"
echo "REACT_APP_PERSON=${e}"
echo "REACT_APP_ACCESS_TOKEN=${f}"
echo "REACT_APP_ATTACH_POLICY_DOCUMENTS=${g}"
echo "REACT_APP_CREARPOLIZAIAXIS=${h}"

