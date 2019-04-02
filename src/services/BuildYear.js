import Service from './Service';

const BaseUrl = "https://4gw3dqvq6g.execute-api.us-east-1.amazonaws.com/dev/all-build-years";

class BuildYear {
    static async get() {
        let data = await Service.get(BaseUrl);
        if (typeof data.build_years === "undefined") {
            data.build_years = [
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
            ];
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
        });;
    };
}

export default BuildYear;

