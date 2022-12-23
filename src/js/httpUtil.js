define([], 
  function () {
    var self = this;

    callGetService = async (IP, parameter) => {

      let url = `http://${IP}/${parameter}`; 

      return new Promise((resolve, reject) => {

        fetch(url, {
          method: 'GET',
        })
        .then(response =>  {
          return response.json();
        })
        .then((data) => {
          (data.items) ? resolve(data.items[0]) : resolve(data); 
        })
        .catch((error) => {
          reject(error);
        })
      })
    }
    return {
      callGetService
    };
  });
  