var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var browser = require('./browser.js');

var port =  process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);

process.on('uncaughtException', (p_err) => {
    console.log('uncaughtException: ' + p_err);
});

//Descr: Archivos del front end
app.use('/', express.static(path.join(__dirname, '../public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Descr: Re dirige a la página index
app.get('/', (p_req, p_res) => {
    p_res.render('index');    
});

//Descr: Obtiene el listado de ciudades
app.get('/getFilters', (p_req, p_res) => {
    var w_data = {};
    try {
        w_data.cities = browser.getCities();
        w_data.types = browser.getTypes();

        p_res.json(w_data); 
    } catch(ex) {
        processException(ex, p_res, 500);
    }
});

//Descr: Realiza la búsqueda de datos
app.post('/search', (p_req, p_res) => {
    var w_city = '', w_type = '';
    var w_minPrice = 0, w_maxPrice = 0;
    var w_result = [];

    try {
        w_city = p_req.body.city;
        w_type = p_req.body.type;
        w_minPrice = p_req.body.minPrice;
        w_maxPrice = p_req.body.maxPrice;

        w_result = browser.search(w_city, w_type, w_minPrice, w_maxPrice);
        return p_res.json(w_result);
    } catch(ex) {
        processException(ex, p_res, 500);
    }
});

//Descr: Inicializo el servidor
server.listen(port, () => { 
    console.log('Browser is ready for play on port: ' + port);   
})

//==== Funciones privadas ====//
//Descr: Procesa una excepción
function processException(p_exception, p_response, p_status){
    console.log(p_exception);
    p_response.sendStatus(p_status).json(p_exception.message);
}
//==== Fin Funciones privadas ====//