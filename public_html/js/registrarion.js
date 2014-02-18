
provincias = [];

tipoVias = [];

var readProvincias = function(){
    
    $.ajax({
        dataType: 'json',
        url: 'http://pro2daw.pve.fpmislata.com/PymeGestWebsiteServer/web/app.php/provincia/',
        type: 'GET',
        success: function(data) {
            provincias = data;

            var htmlprovincias = '<label class="control-label" for="">Provincia</label>';
            htmlprovincias += '<div class="textoColumnDerecha">';
            htmlprovincias += '<select class="span3" id="provincia" name="provincia" required>';
            htmlprovincias += '<option value="" selected >Provincia...</option>';
            $.each(data, function(index) {

                htmlprovincias += '<option value="' + data[index].id + '">' + data[index].nombre + '</option>';

            });

            htmlprovincias += '</select>';
            htmlprovincias += '</div>';
            htmlprovincias += '</div>';

            $('#imprimirProvincias').html(htmlprovincias);    
        }
    });    
};

var readTipoVia = function(){
    
    $.ajax({
        dataType: 'json',
        url: 'http://pro2daw.pve.fpmislata.com/PymeGestWebsiteServer/web/app.php/tipo_via/',
        type: 'GET',
        success: function(data) {
            tipoVias = data;

            var htmlprovincias = '<label class="control-label" for="">Tipo de Via</label>';
            htmlprovincias += '<div class="textoColumnDerecha">';
            htmlprovincias += '<select class="span3" id="tipoVia" name="tipoVia" required>';
            htmlprovincias += '<option value="" selected >Tipo de Via...</option>';
            $.each(data, function(index) {

                htmlprovincias += '<option value="' + data[index].id + '">' + data[index].nombre + '</option>';

            });

            htmlprovincias += '</select>';
            htmlprovincias += '</div>';
            htmlprovincias += '</div>';

            $('#imprimirTipoVias').html(htmlprovincias);    
        }
    });    
};



var insertUser = function(form) {

    //Transforma formulario a Objeto JSON con metodo/libreria jsonify(); 

    //var dataForm = JSON.stringify($('#formRegistrarion').jsonify());

    var dataForm = JSON.stringify($(form).jsonify());

   // alert(dataForm);

    $.ajax({
        dataType: 'json',
        url: 'http://pro2daw.pve.fpmislata.com/PymeGestWebsiteServer/web/app.php/usuario/',
        type: 'POST',
        data: dataForm,
        success: function(data) {
            window.location('http://pro2daw.pve.fpmislata.com/PymeGestWebsiteClient');
        }
    });
};

var validar = function() {

    $("#formRegistrarion").validate({
        debug: true,
        errorClass: 'error help-inline',
        validClass: 'success',
        errorElement: 'span',
        rules: {
            login: {
                required: true,
                minlength: 5
            },
            password: {
                required: true,
                minlength: 5
            },
            passwordConfirm: {
                required: true,
                equalTo: "#password"
            },
            nombre: {
                required: true,
                maxlength: 30
            },
            aqpellido1: {
                required: true,
                maxlength: 30
            },
            aqpellido2: {
                required: true,
                maxlength: 30
            },
            email: {
                required: true,
                email: true
            },
            telefonoFijo: {
                number: true
            },
            telefonoMovil: {
                required: true,
                number: true
            },
            via: {
                required: true
            },
            tipoVia: {
                required: true
            },
            numero: {
                required: true
            },
            puerta: {
            },
            codigoPostal: {
                required: true,
                maxlength: 5,
                minlength: 5,
                number: true
            },
            poblacion: {
                required: true
            },
            provincia: {
                required: true
            },
            aceptConditions: {
                required: true
            }
        },
        messages: {
            login: {
                required: "Debe insertar un login.",
                minlength: "El login no puede tener menos de 5 caracteres."
            },
            password: {
                required: "Debe insertar una contraseña.",
                minlength: "Por su seguridad, la contraseña no puede tener menos de 5 caracteres."
            },
            passwordConfirm: {
                required: "Debe confirmar la contraseña.",
                equalTo: "La confirmación no coincide con la contraseña."
            },
            nombre: {
                required: "Debe insertar un nombre.",
                maxlength: "El nombre no puede tener más de 30 caracteres."
            },
            apellido1: {
                required: "Debe insertar el primer apellido.",
                maxlength: "El primer apellido no puede tener más de 30 caracteres."
            },
            apellido2: {
                required: "Debe insertar el segundo apellido.",
                maxlength: "El segundo apellido no puede tener más de 30 caracteres."
            },
            email: {
                required: "Debe insertar una cuenta de email valida.",
                email: "El formato del email no es correcto. Ejemplo@pymegest.com"
            },
            telefonoFijo: {
                number: "Un teléfono solo puede estar formado por números."
            },
            telefonoMovil: {
                required: "Debe insertar un teléfono movil de contacto.",
                number: "Un teléfono solo puede estar formado por números."
            },
            via: {
                required: "Debe insertar un domicilio."
            },
            tipoVia: {
                required: "Debe seleccionar el tipo de via del domicilio."
            },
            numero: {
                required: "Debe indicar el número del domicilio."
            },
            puerta: {
            },
            codigoPostal: {
                required: "Debe insertar el codigo postal de la población.",
                maxlength: "El codigo postal no puede tener más de 5 números.",
                minlength: "El codigo postal no puede tener menos de 5 números.",
                number: "El codigo postal solo puede estar formado por números."
            },
            poblacion: {
                required: "Debe insertar la población del domicilio."
            },
            provincia: {
                required: "Debe seleccionar la provincia de la población."
            },
            aceptConditions: {
                required: "Para aceptar pulse la casilla."
            }
        },
        submitHandler: function(form) {
            insertUser(form);   //pasamos el formulario a insertUser
        }
    });

};

