# App-Contador-Pessoas-Neo-CP-3001
Versões:
Cordova                      10.0.0  cordova --version
Oracle JET                    9.2.0  ojet --version
  ojet-cli / ojet-tooling
Node                        12.16.2  node --version
Android SDK Build Tools      29.0.2 / 19.1.0
Gradle                        6.0.3

------------------------------------------------------------------

Comandos:

ojet strip

npm install -g cordova@10.0.0
npm install -g @oracle/ojet-cli@9.2.0
npm install -g @oracle/oraclejet-tooling@9.2.0

Atualizar as linhas onde informa a versão no package.json

remover o package-lock.json

ojet restore

Para revisar se atualizou a versão, dar o comando 
npm list --depth=0

Resultado deve ser este:
@oracle/oraclejet-tooling@9.2.2
@oracle/oraclejet@9.2.9
fs-extra@0.30.0

------------------------------------------------------------------

Debug Wi-Fi
adb devices
adb connect 192.168.0.105:5555
adb disconnect
adb tcpip