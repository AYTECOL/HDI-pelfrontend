const INVALID_ADDRESS_KEYWORDS = [
    '0',
    'null',
    'ninguna',
    'ningun',
    'ninguna direccion',
    'sin direccion',
    'sin dirección',
    'no aplica',
    'na',
    'n/a',
    's/n',
    'nulo',
    'nula',
  ];
  
  export const normalize = (value) =>
    String(value ?? '').trim().toLowerCase();
  
  export const isInvalidAddress = (address) => {
    const normalized = normalize(address);
    return INVALID_ADDRESS_KEYWORDS.includes(normalized);
  };
  
  export const hasValidCoordinates = (mapsOptions) => {
    if (!mapsOptions) return false;
  
    const { latitude, longitude } = mapsOptions;
  
    const latNum =
      latitude === null || typeof latitude === 'undefined' || latitude === ''
        ? null
        : Number(latitude);
    const lngNum =
      longitude === null || typeof longitude === 'undefined' || longitude === ''
        ? null
        : Number(longitude);
  
    if (latNum === null || lngNum === null) return false;
    if (Number.isNaN(latNum) || Number.isNaN(lngNum)) return false;
    if (latNum === 0 || lngNum === 0) return false;
  
    return true;
  };