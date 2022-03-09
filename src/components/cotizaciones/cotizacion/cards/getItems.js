import Segurarinmueble from '../../inmueble/forms/segurarinmueble/Segurarinmueble';
import Asegurarcontenidos from '../../inmueble/forms/asegurarcontenidos/Asegurarcontenidos';
import Asegurarobras from '../../inmueble/forms/asegurarobras/Asegurarobras';
import Asegurarjoyas from '../../inmueble/forms/asegurarjoyas/Asegurarjoyas';
import MobileContents from '../../inmueble/forms/MobileContents';
import Asegurartelefonos from '../../inmueble/forms/asegurartelefonos/Asegurartelefonos';

export function getItems() {
  return [
    {
      parent: Segurarinmueble,
      type: 1,
    },
    {
      parent: Asegurarcontenidos,
      type: 2,
    },
    {
      parent: MobileContents,
      type: 6,
    },
    {
      parent: Asegurarobras,
      type: 3,
    },
    {
      parent: Asegurarjoyas,
      type: 4,
    },
    {
      parent: Asegurartelefonos,
      type: 5,
    },
  ];
}
