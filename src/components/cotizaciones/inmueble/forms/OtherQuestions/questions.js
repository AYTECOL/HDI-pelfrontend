import React from 'react';

const questions = [
  {
    id: 1,
    message: (
      <p className="m-0 mb-4 p-descr">
        ¿El inmueble o contenido a asegurar, es propiedad de Embajadas,
        embajadores, cuerpos diplomáticos o corresponde a Vivienda Fiscal
        ubicada dentro de bases o guarniciones militares o policiales?
      </p>
    ),
    validValues: [true],
    throwError: true,
  },
];

export default questions;
