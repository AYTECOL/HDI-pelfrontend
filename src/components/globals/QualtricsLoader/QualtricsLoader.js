import { useEffect } from 'react';

const QualtricsLoader = () => {
  useEffect(() => {
    if (window.QSI && window.QSI.API) {
      let QSI = window.QSI;
      QSI.API.load().then(QSI.API.run());
    } else {
      console.error('no api');
    }
  }, []);

  return null;
};

export default QualtricsLoader;