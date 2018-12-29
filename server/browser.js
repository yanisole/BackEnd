let data = require('../public/data.json');

module.exports = {
    getCities: getCities,
    getTypes: getTypes,
    search: search
}

//Descr: Obtiene las distintas ciudades cargadas.
function getCities(){
    return filterField('Ciudad');
}

//Descr: Obtiene los distintos tipos cargadas.
function getTypes(){
    return filterField('Tipo');
}

//Descr: filtra los datos según los parámetros recibidos
//p_city => Ciudad
//p_type => Tipo
//p_minValue => Precio mínimo
//p_maxValue => Precio máximo
function search(p_city, p_type, p_minValue, p_maxValue){
    let w_result = data;

    //Buscar todos
    if(!p_city && !p_type && !p_minValue && ! p_maxValue)
        return data;
    
    //Comienzo a aplicar los filtros
    if(p_city)
        w_result = w_result.filter(element => equalString(element.Ciudad, p_city));

    if(p_type)
        w_result = w_result.filter(element => equalString(element.Tipo, p_type));

    if(p_minValue && p_maxValue){
        w_result = w_result.filter(element =>{
            let w_price = Number(element.Precio.replace(/\$|,/gi, ''));            
            return (w_price >= p_minValue && w_price <= p_maxValue);
        });
    }
    
    return w_result;
}

//==== Funciones privadas ====//
//Descr: Obtiene los distintos valores del campo en el archivo data.json.
//p_field => Nombre del campo
function filterField(p_field){
    let w_array = [];

    if(!data)
        return [];
    
    data.forEach(element => {
        if(!arrayContainString(element[p_field], w_array))
            w_array.push(element[p_field]);
    });

    return w_array;
}

//Descr: Dice si una string ya se encuentra en el array de strings
//p_string => Cadena de texto a búscar
//p_array => Arreglo de cadenas de texto
function arrayContainString(p_string, p_array){
    return (p_array.filter(string => {
        return equalString(string, p_string);
    }).length);
}

//Descr: Dice si dos cadenas de texto son iguales
//p_string1 => Cadena de texto
//p_string2 => Cadena de texto
function equalString(p_string1, p_string2){
    let w_str1 = p_string1.toLowerCase().trim();
    let w_str2 = p_string2.toLowerCase().trim();

    return w_str1 === w_str2;
}
//==== Fin Funciones privadas ====//