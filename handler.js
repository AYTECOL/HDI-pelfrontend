'use strict';
exports.infr = (event, context, callback) => {
  const response = event.Records[0].cf.response;
  if (!event.Records) {
    return callback(new Error('Records not available'));
  }
  const headers = response.headers;
  const api_endpoint = 'https://*.execute-api.us-east-1.amazonaws.com https://*.libertymutual.com https://*.s3.us-east-1.amazonaws.com';

  const analytics =
    'https://www.googletagmanager.com https://www.google-analytics.com https://*.qualtrics.com';

  const valueCSP =
    'default-src https://*.googleapis.com https://maps.gstatic.com;' +
    `img-src 'self' data:  https://maps.gstatic.com/  *.googleapis.com *.ggpht ${analytics};` +
    `script-src 'self' 'unsafe-inline' maps.googleapis.com maps.gstatic.com https://maps.google.com https://*.googleapis.com https://maps.gstatic.com ${analytics};` +
    "style-src 'self' https://maps.googleapis.com  https://cdnjs.cloudflare.com https://fonts.googleapis.com 'unsafe-inline' ; font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com;" +
    `connect-src 'self' ${api_endpoint} https://www.google-analytics.com https://stats.g.doubleclick.net https://ipv4.icanhazip.com https://api.ipify.org https://maps.google.com https://maps.googleapis.com https://*.googleapis.com https://maps.gstatic.com https://*.qualtrics.com;` +
    "base-uri 'self';" +
    "object-src 'self' 'unsafe-inline'; " +
    "manifest-src 'self';";

  headers['content-security-policy'] = [
    {
      key: 'Content-Security-Policy',
      value: valueCSP,
    },
  ];
  headers['x-content-type-options'] = [
    {
      key: 'X-Content-Type-Options',
      value: 'nosniff',
    },
  ];
  headers['x-frame-options'] = [
    {
      key: 'X-Frame-Options',
      value: 'SAMEORIGIN',
    },
  ];
  headers['feature-policy'] = [
    {
      key: 'Feature-Policy',
      value:
        "accelerometer 'none'; ambient-light-sensor 'none'; autoplay 'none'; camera 'none'; geolocation 'none'; gyroscope 'none'; magnetometer 'none'; microphone 'none'; midi 'none'; speaker 'none'; usb 'none'",
    },
  ];
  headers['x-permitted-cross-domain-policies'] = [
    {
      key: 'X-Permitted-Cross-Domain-Policies',
      value: 'master-only',
    },
  ];
  headers['x-xss-protection'] = [
    {
      key: 'X-XSS-Protection',
      value: '1; mode=block',
    },
  ];
  headers['referrer-policy'] = [
    {
      key: 'Referrer-Policy',
      value: 'SAME-ORIGIN',
    },
  ];
  headers['strict-transport-security'] = [
    {
      key: 'Strict-Transport-Security',
      value: 'max-age=63072000; includeSubdomains; preload',
    },
  ];
  callback(null, response);
};
