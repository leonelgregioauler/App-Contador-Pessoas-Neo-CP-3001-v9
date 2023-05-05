define(['axios'],
  function (Axios) {

    callGetService = async (IP, parameter) => {

      const localFilePath = `${cordova.file.applicationDirectory}www/data/data-${parameter}.json`;
      //const localFilePath = `../data/data-${parameter}.json`;

      (IP != '8.8.8.8') ? url = `http://${IP}/${parameter}` : url = `${localFilePath}`;
      
      return new Promise((resolve, reject) => {

        Axios.get(url)
          .then((data) => {
            (!data.data.items) ? resolve(data.data) : resolve(data.data.items[0]);
          })
          .catch((error) => {
            reject(error);
          })
      })
    }

    ReadWriteFilesDevice = async (folderName, fileName, BlobData) => {
      // Diretório de Documentos
      const DIR_ENTRY = cordova.file.externalRootDirectory;
      
      window.resolveLocalFileSystemURL(DIR_ENTRY, function (dirEntry) {
        createDirectory(dirEntry);
      }, onErrorLoadFs);

      function createDirectory(rootDirEntry) {
        rootDirEntry.getDirectory('Documents', { create: true }, function (dirEntry) {
          dirEntry.getDirectory(folderName, { create: true }, function (subDirEntry) {

            createFile(subDirEntry, fileName);

          }, onErrorGetDir);
        }, onErrorGetDir);
      }

      function createFile(dirEntry, fileName) {
        dirEntry.getFile(fileName, { create: true, exclusive: false }, function (fileEntry) {

          writeFile(fileEntry, BlobData);

        }, onErrorCreateFile);
      }

      function writeFile(fileEntry, dataObj) {
        fileEntry.createWriter(function (fileWriter) {

          fileWriter.onwriteend = function () {
            console.log("Successful file write...");
          };

          fileWriter.onerror = function (e) {
            console.log("Failed file write: " + e.toString());
          };

          fileWriter.write(dataObj);
        });
      }

      function onErrorLoadFs(onErrorLoadFs) {
        console.log('onErrorLoadFs: ' + onErrorLoadFs);
      }

      function onErrorGetDir(onErrorGetDir) {
        console.log('onErrorGetDir ' + onErrorGetDir);
      }
      
      function onErrorCreateFile(onErrorCreateFile) {
        console.log('onErrorCreateFile ' + onErrorCreateFile)
      }      
    }

    return {
      callGetService,
      ReadWriteFilesDevice
    };
  });
