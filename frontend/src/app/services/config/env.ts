const environment = {
  production: true,
  apiUrl: 'https://vending-machine-z87w.onrender.com' 
};

export const getUrl = () => environment.apiUrl;