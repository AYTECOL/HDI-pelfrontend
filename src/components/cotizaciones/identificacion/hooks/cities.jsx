import React from 'react';
import Cities from '../../../../services/Cities';

const CitiesContext = React.createContext(Object.create(null));

export const CitiesProvider = ({ children }) => {
  const [cities, setCities] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const getCities = () => Cities.get().then((res) => res.cities);
  /**
   * @type {[Promise<{ city: string,departament: string }>[]]}
   */
  const [promise] = React.useState(() =>
    getCities().catch(() => getCities().catch(() => []))
  );

  React.useEffect(() => {
    setLoading(true);
    promise
      .then((data) => {
        setCities(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <CitiesContext.Provider
      value={{
        cities,
        getCities: () => promise,
        getCity: async ({ city, departament }) =>
          ((await promise) || []).find(
            ({ code_city, code_department }) =>
              String(city) === String(code_city) &&
              String(departament) === String(code_department)
          ),
        loading,
        promise,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
};
export const CitiesConsumer = CitiesContext.Consumer;
export const useCities = () => React.useContext(CitiesContext);
export const withCities = (Component) => {
  return (props) => {
    const citiesProps = useCities();
    return <Component {...{ ...props, citiesProps }} />;
  };
};
