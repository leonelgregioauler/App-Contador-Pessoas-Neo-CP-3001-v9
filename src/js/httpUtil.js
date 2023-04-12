define([],
  function () {

    callGetService = async (IP, parameter) => {

      let url = `http://${IP}/${parameter}`;

      return new Promise((resolve, reject) => {

        fetch(url, {
          method: 'GET',
        })
        .then(response => {
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

    ReadWriteFilesDevice = async (folderName, fileName, BlobData) => {
      // Diretório de Documentos
      const DIR_ENTRY = 'file:///storage/emulated/0/';
      
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
