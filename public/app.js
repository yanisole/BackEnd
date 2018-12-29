//Inicializador del elemento Slider
$("#rangoPrecio").ionRangeSlider({
  type: "double",
  grid: false,
  min: 0,
  max: 100000,
  from: 1000,
  to: 20000,
  prefix: "$"
})

function setSearch() {
  this.customSearch = false;
  let busqueda = $('#checkPersonalizada');
  
  //==== Funciones privadas ====//
  //Descr: Envía una petición al servidor
  let sendRequest = (p_url, p_type, p_data, p_callback) => {
    $.ajax({
      url: p_url,
      type: p_type,
      data: p_data,
      success: (p_data) => {
        if(p_callback)
          p_callback(p_data);
      },
      error: (p_err) => {
        alert(p_err);
      }
    });    
  };

  //Descr: Inicializa la página
  let init = () => {
    sendRequest('/getFilters', 'GET', null, (p_result) => {
      let w_selectCity = $('#ciudad'), w_selectType = $('#tipo');
      let w_option = null;

      try{
        if(Object.keys(p_result).length == 0)
          return;
        
        if(p_result.cities.length){
          p_result.cities.forEach(city => {
            w_option = '<option value="' + city + '">' + city + '</option>';
            w_selectCity.append(w_option);
          });          
        }

        if(p_result.types.length){
          p_result.types.forEach(type => {
            w_option = '<option value="' + type + '">' + type + '</option>';
            w_selectType.append(w_option);
          });          
        }
      } catch(ex) {
        alert(ex.message);
      }
    });    
  }  

  //Descr: Crea el html de una carta de propiedad
  //p_element => Elemento obtenido en data.json
  let createCard = (p_element) => {
    return  '<div class="card horizontal">' + 
            '<div class="card-image"><img src="img/home.jpg"></div>' +
            '<div class="card-stacked">' +
            '<div class="card-content">' +
            '<div><b>Direccion: </b><p>' + p_element.Direccion + '</p></div>' +
            '<div><b>Ciudad: </b><p>' + p_element.Ciudad + '</p></div>' +
            '<div><b>Telefono: </b><p>' + p_element.Telefono + '</p></div>' +
            '<div><b>Código postal: </b><p>' + p_element.Codigo_Postal + '</p></div>' +
            '<div><b>Precio: </b><p>' + p_element.Precio + '</p></div>' +
            '<div><b>Tipo: </b><p>' + p_element.Tipo + '</p></div>' +
            '</div>' +
            '<div class="card-action right-align"><a href="#">Ver más</a></div>' +
            '</div>';
  };
  //==== Fin Funciones privadas ====//

  busqueda.on('change', (e) => {
    if (this.customSearch == false) {
      this.customSearch = true;
      $('#ciudad').css('display', 'block');
      $('#tipo').css('display', 'block');
    } else {
      this.customSearch = false;
      $('#ciudad').css('display', 'none');
      $('#tipo').css('display', 'none');
    }
    $('#personalizada').toggleClass('invisible')
  });

  //Descr: Realiza la búsqueda de los datos
  $('#buscar').on('click', () => {
    let w_data = {};
    let w_slider = $("#rangoPrecio").data("ionRangeSlider").result;
    let w_result = [];

    try{
      $('#propiedades').html('');

      if(this.customSearch){
        if($('#ciudad').val() && $('#ciudad').val() !== '')
          w_data.city = $('#ciudad').val();

        if($('#tipo').val() && $('#tipo').val() !== '')
          w_data.type = $('#tipo').val();

        w_data.minPrice = Number(w_slider.from);
        w_data.maxPrice = Number(w_slider.to);
      }

      sendRequest('/search', 'POST', w_data, (p_result) => {
        try{
          p_result.forEach(element => {
            let w_card = createCard(element);
            $('#propiedades').append(w_card);
          });
        }catch(ex) {
          alert(ex.message);
        }
      });
    } catch(ex) {
      alert(ex.message);
    }
  });

  init();
}

setSearch()
