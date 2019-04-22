import Service from './Service';

const BaseUrl = "/all-build-years";

const Default = {
    build_years: [
        {
            "buildYearCode": "500006",
            "answer": "1963-1977"
        },
        {
            "buildYearCode": "500005",
            "answer": "Antes de 1963"
        },
        {
            "buildYearCode": "500007",
            "answer": "1978-1984"
        },
        {
            "buildYearCode": "500010",
            "answer": "2011 en adelante"
        },
        {
            "buildYearCode": "500008",
            "answer": "1985-1997"
        },
        {
            "buildYearCode": "500009",
            "answer": "1998-2010"
        }
    ]
};

class BuildYear {
    static async get() {
        let data = {};
        try {
            data = await Service.get(BaseUrl);
        }catch (e) {
            data = Default;
        }
        if ( typeof data.build_years === "undefined" || data.build_years.length === 0 ){
            data = Default;
        }
        return data.build_years.sort(function (a, b) {
            a = parseInt(a.buildYearCode);
            b = parseInt(b.buildYearCode);
            if (a > b) {
                return 1;
            } else if (a < b) {
                return -1;
            }
            return 0;
        });
    };
}

export default BuildYear;

