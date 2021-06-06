# Coderhouse Programación BackEnd

Proyecto del curso Coderhouse BackEnd.
	
# Descripción

La aplicación se realizó utilizando HTML, CSS, Node.js, Observable, WebSockets, Template Engines (HBS, EJS, PUG), DataBase (MySQL, SQLite3, MongoDB), Nginx, PM2, Forever:

# Test Live

https://coder-backend.herokuapp.com

# Instalación local

```
git clone https://github.com/JoseLuisFriedrich/coderhouse-backend
cd Class-36-FinalProject-Installment-III
npm i
```

# Ejecución Desarrollo

| npm run                        | explicación
|--------------------------------|------------------------------
| npm run dev                    | ejecución nodemon simple
| npm run devCluster             | ejecución nodemon cluster


# Alternativas

| npm run                        | explicación
|--------------------------------|------------------------------
| npm run buildDev               | compilar a javascript (necesario para los sigientes start/test)
| npm run startForever           | ejecutar con Forever
| npm run startPM2Fork           | ejecutar con PM2 fork
| npm run startPM2Cluster        | ejecutar con PM2 cluster
| npm run startProf              | ejecutar con node prof simple
| npm run startProfCluster       | ejecutar con node prof cluster
| npm run testPerfFork           | ejecutar artillery simple
| npm run testPerfCluster        | ejecutar artillery cluster
| npm run testPerfAutocannon     | ejecutar con autocannon
| npm run testPerf0x             | ejecutar con 0x
