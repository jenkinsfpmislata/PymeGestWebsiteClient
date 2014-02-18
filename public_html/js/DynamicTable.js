
items = [];
categorias = [];


function readCategorias() {


    $.ajax({
        dataType: 'json',
        url: 'http://localhost/PymeGestWebSiteServer/web/app_dev.php/categoria/',
        type: 'GET',
        success: function(data) {
            categorias = data;
            var lista = '';
            $.each(data, function(index) {
                lista += '<li class="" id="rowSelected_' + data[index].nombre + '"><a href="javascript:readAllData(\'' + data[index].nombre + '\');" id="' + data[index].id + '">' + data[index].nombre + '</li>';
            });
            lista += '<li class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#">Herramientas <i class="icon-wrench"></i><b class="caret"></b></a><ul class="dropdown-menu"><li><a href="#">Copiar</a></li><li><a href="#">Convertir a PDF</a></li><li><a href="#">Convertir a Excel</a></li></ul></li>';
            $('#listaCategorias').html(lista);
            readAllData('Usuarios');
        }
    });

}

var findCategoria = function(nombreCategoria) {

    var categoria = {};
    categorias.forEach(function(element) {

        if (element.nombre == nombreCategoria) {
            categoria = element;
        }

    });
    return categoria;
};

var findItem = function(id) {

    var item = {};
    items.forEach(function(element) {

        if (element.id == id) {
            item = element;
        }

    });
    return item;
};


// CRUD DATA


function readAllData(nombreCategoria) {

    //$("#rowSelected_"+nombreCategoria).css("background-color","black");

    var categoria = findCategoria(nombreCategoria);

    $.ajax({
        dataType: 'json',
        url: 'http://localhost/PymeGestWebSiteServer/web/app_dev.php' + categoria.url,
        type: 'GET',
        success: function(data) {
            items = data;

            var tabla = '<table class="table table-bordered" id="row">';

            var categoriaCampos = categoria.campos.split(",");

            for (var i = 0; i < categoriaCampos.length; i++) {

                tabla += '<th>' + categoriaCampos[i] + '</th>';

            }

            tabla += '<th id="tabla_admin_botones">Edición <button class="btn btn-info botones_admin" data-toggle="modal" data-target="#myModal" onclick="javascript:insertModal(' + categoria.url + ')" ><i class="icon-plus"></i></button></th>';

            items.forEach(function(item) {
                tabla += '<tr id="row_' + item.id + '">';
                for (var i = 0; i < categoriaCampos.length; i++) {
                    tabla += '<td>' + item[categoriaCampos[i]] + '</td>';

                }
                tabla += '<td class="panelControlFilas"><button class="btn btn-success botones_admin" data-toggle="modal" data-target="#myModal" onclick="javascript:readData(' + categoria.url + ',' + item.id + ')" ><i class="icon-eye-open"></i></button><button class="btn btn-primary" data-toggle="modal" data-target="#myModal" onclick="javascript:updateData(' + categoria.url + ',' + item.id + ')" ><i class="icon-pencil"></i></button><button class="btn btn-danger" onclick="javascript:deleteData(' + categoria.url + ',' + item.id + ')"><i class="icon-trash "></i></button></td>';
                tabla += '</tr>';

            });
            tabla += '</table>';


            $('#tablaAJAX').html(tabla);

        }
    });
}


function insertData(categoria) {

    //Transforma formulario a Objeto JSON con metodo/libreria jsonify(); 
    
    var dataForm = JSON.stringify($('#formularioModal').jsonify());

    alert(dataForm);

    $.ajax({
        dataType: 'json',
        url: 'http://localhost/PymeGestWebSiteServer/web/app_dev.php' + categoria,
        type: 'POST',
        data: dataForm,
        success: function(data) {

            window.location = 'panelAdmin.html';

        }
    });

}


function deleteData(categoria, id) {

    if (confirm("¿Estas seguro de eliminar la Fila? \n ")) {

        $.ajax({
            dataType: 'json',
            url: 'http://localhost/PymeGestWebSiteServer/web/app_dev.php' + categoria + id,
            type: 'DELETE',
            success: function(data) {

                var item = findItem(id);

                items.splice(items.indexOf(item), 1);

                $("#row_" + item.id).remove();

            }

        });
    }
}


function readData(categoria, id) {

    var item = {};
    item = findItem(id);

    var miModal = mostrarModal(categoria, item, true);

    $('#myModal').html(miModal);

}

function updateData(categoria, id, disabled) {

    var item = {};
    item = findItem(id);

    if (disabled == null) {
        var miModal = mostrarModal(categoria, item, false);
    } else {
        miModal = mostrarModal(categoria, item, disabled);
    }

    $('#myModal').html(miModal);
}


function updateDataBD(categoria) {

    //Transforma formulario a Objeto JSON con metodo/libreria jsonify(); 

    var dataForm = JSON.stringify($('#formularioModal').jsonify());

    //alert(dataForm);

    $.ajax({
        dataType: 'json',
        url: 'http://localhost/PymeGestWebSiteServer/web/app_dev.php' + categoria,
        type: 'PUT',
        data: dataForm,
        success: function(data) {

            //$('#myModal').modal('hide');
            window.location = 'panelAdmin.html';
        }
    });
}


// jQuery para Modal

function mostrarModal(categoria, item, disabled) {

    var titulo = 'Titulo';

    if (categoria == '/usuario/') {
        titulo = 'Datos del usuario ' + item.nombre.toUpperCase() + " " + item.apellido1.toUpperCase();
    } else if (categoria == '/producto/') {
        titulo = 'Datos del producto ' + item.nombre.toUpperCase();
    } else if (categoria == '/rol/') {
        titulo = 'Datos del rol ' + item.rol.toUpperCase();
    } else if (categoria == '/contratacion/') {

        titulo = 'Datos de la contraración ' + item.id.toUpperCase();

    } else if (categoria == '/forma_pago/') {

        titulo = 'Datos de la forma de pago ' + item.formaPago.toUpperCase();

    } else if (categoria == '/licencia/') {

        titulo = 'Datos de la licencia ' + item.id.toUpperCase();

    } else if (categoria == '/provincia/') {

        titulo = 'Datos de la provincia ' + item.provincia.toUpperCase();

    } else if (categoria == '/tipo_via/') {

        titulo = 'Datos del tipo via ' + item.tipoVia.toUpperCase();

    }

    //var titulo = categoria.split('/');

    var modal = '<div class="modal-dialog">';
    modal += '<div class="modal-content">';
    modal += '<div class="modal-header">';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
    modal += '<h4 class="modal-title" id="myModalLabel">' + titulo + '</h4>';
    modal += '</div>';
    modal += '<div class="modal-body">';
    modal += '<form class="form-horizontal" id="formularioModal">';

    /*modal += '<div class="control-group">';
     modal += '<div class="controls">';
     modal += '<input type="hidden" id="id" placeholder="Id..." name="id" value="2">';
     modal += '</div>';
     modal += '</div>';*/

    for (var property in item) {

        modal += '<div class="control-group">';
        modal += '<label class="control-label" for="' + property + '">' + property + '</label>';
        modal += '<div class="controls">';

        if (disabled == true || property == 'id') {

            modal += '<input type="text" id="' + property + '" name="' + property + '" placeholder="' + item[property] + '" value="' + item[property] + '" disabled>';

            modal += '<input type="hidden" id="id" placeholder="Id..." name="id" value="' + item[property] + '">';

        } else {
            modal += '<input type="text" id="' + property + '" name="' + property + '" placeholder="' + item[property] + '" value="' + item[property] + '" >';

        }
        modal += '</div>';
        modal += '</div>';
    }

    modal += '</form>';
    modal += '</div>';
    modal += '<div class="modal-footer">';
    modal += '<button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>';

    if (disabled == true) {

        modal += '<button type="button" class="btn btn-primary" onclick="javascript:updateData(' + categoria + ',' + item.id + ',' + false + ');">Modificar</button>';

    } else {
        modal += '<button type="button" class="btn btn-primary" data-dismiss="modal" onclick="javascript:updateDataBD(' + categoria + ');">Guardar</button>';
    }

    modal += '</div>';
    modal += '</div>';

    return modal;

}

function insertModal(categoria) {

    var titulo = 'Titulo';

    if (categoria == '/usuario/') {
        titulo = 'Insertar usuario ';
    } else if (categoria == '/producto/') {
        titulo = 'Insertar producto ';
    } else if (categoria == '/rol/') {
        titulo = 'Insertar rol ';
    } else if (categoria == '/contratacion/') {

         titulo = 'Insertar contratacion ';

    } else if (categoria == '/forma_pago/') {

         titulo = 'Insertar forma de pago ';

    } else if (categoria == '/licencia/') {

         titulo = 'Insertar licencia ';

    } else if (categoria == '/provincia/') {

         titulo = 'Insertar provincia ';

    } else if (categoria == '/tipo_via/') {

         titulo = 'Insertar tipo de via ';

    }

    //var titulo = categoria.split('/');

    var modal = '<div class="modal-dialog">';
    modal += '<div class="modal-content">';
    modal += '<div class="modal-header">';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
    modal += '<h4 class="modal-title" id="myModalLabel">' + titulo + '</h4>';
    modal += '</div>';
    modal += '<div class="modal-body">';
    modal += '<form class="form-horizontal" id="formularioModal">';

    modal += '<div class="control-group">';
    modal += '<div class="controls">';
    modal += '<input type="hidden" id="id" placeholder="Id..." name="id" value="1">';
    modal += '</div>';
    modal += '</div>';

    if (categoria == '/usuario/') {

        modal += '<div class="control-group">';
        modal += '<label class="control-label" for="">Nombre</label>';
        modal += '<div class="controls">';
        modal += '<input type="text" id="nombre" placeholder="Nombre..." name="nombre">';
        modal += '</div>';
        modal += '</div>';
        modal += '<div class="control-group">';
        modal += '<label class="control-label" for="">Primer apellido</label>';
        modal += '<div class="controls">';
        modal += '<input type="text" id="apellido1" placeholder="Primer apellido..." name="apellido1">';
        modal += '</div>';
        modal += '</div>';
        modal += '<div class="control-group">';
        modal += '<label class="control-label" for="">Segundo apellidos</label>';
        modal += '<div class="controls">';
        modal += '<input type="text" id="apellido2" placeholder="Segundo apellidos..." name="apellido2">';
        modal += '</div>';
        modal += '</div>';
        modal += '<div class="control-group">';
        modal += '<label class="control-label" for="">Email</label>';
        modal += '<div class="controls">';
        modal += '<input type="text" id="email" placeholder="Email..." name="email">';
        modal += '</div>';
        modal += '</div>';
        modal += '<div class="control-group">';
        modal += '<label class="control-label" for="">Rol</label>';
        modal += '<div class="controls">';
        modal += '<select name="rol">';
        modal += ' <option value="USUARIO">Usuario</option>';
        modal += ' <option value="CLIENTE">Cliente</option>';
        modal += '<option value="ADMINISTRADOR">Administrador</option>';
        modal += '</select>';
        modal += '</div>';
        modal += '</div>';

        modal += '<div class="control-group">';
        modal += '<label class="control-label" for="" >Dirección</label>';
        modal += '<div class="controls">';
        modal += '<input type="text" id="via" placeholder="Dirección..." name="via">';
        modal += '</div>';
        modal += '</div>';
        modal += '<div class="control-group">';
        modal += '<label class="control-label" for="inputVia">Via</label>';
        modal += '<div class="controls">';
        modal += '<select name="tipo_via">';
        modal += ' <option value="CALLE">Calle</option>';
        modal += ' <option value="PLAZA">Plaza</option>';
        modal += '<option value="AVENIDA">Avenida</option>';
        modal += '<option value="CALLEJON">Callejon</option>';
        modal += '<option value="VIA">Via</option>';
        modal += '</select>';
        modal += '</div>';
        modal += '</div>';
        modal += '<div class="control-group">';
        modal += '<label class="control-label" for="" >Número</label>';
        modal += '<div class="controls">';
        modal += '<input type="text" id="numero" placeholder="Número..." name="numero">';
        modal += '</div>';
        modal += '</div>';
        modal += '<div class="control-group">';
        modal += '<label class="control-label" for="" >Escalera</label>';
        modal += '<div class="controls">';
        modal += '<input type="text" id="escalera" placeholder="Escalera..." name="escalera">';
        modal += '</div>';
        modal += '</div>';
        modal += '<div class="control-group">';
        modal += '<label class="control-label" for="" >Piso</label>';
        modal += '<div class="controls">';
        modal += '<input type="text" id="piso" placeholder="Piso..." name="piso">';
        modal += '</div>';
        modal += '</div>';
        modal += '<div class="control-group">';
        modal += '<label class="control-label" for="" >Puerta</label>';
        modal += '<div class="controls">';
        modal += '<input type="text" id="puerta" placeholder="Puerta..." name="puerta">';
        modal += '</div>';
        modal += '</div>';
        modal += '<div class="control-group">';
        modal += '<label class="control-label" for="" >Codigo postal</label>';
        modal += '<div class="controls">';
        modal += '<input type="text" id="codigoPostal" placeholder="Codigo postal..." name="codigo_postal">';
        modal += '</div>';
        modal += '</div>';
        modal += '<div class="control-group">';
        modal += '<label class="control-label" for="" >Población</label>';
        modal += '<div class="controls">';
        modal += '<input type="text" id="poblacion" placeholder="Población..." name="poblacion">';
        modal += '</div>';
        modal += '</div>';
        modal += '<div class="control-group">';
        modal += '<label class="control-label" for="" >Provincia</label>';
        modal += '<div class="controls">';
        modal += '<input type="text" id="provincia" placeholder="Provincia..." name="provincia">';
        modal += '</div>';
        modal += '</div>';
        modal += '<div class="control-group">';
        modal += '<label class="control-label" for="" >Teléfono Fijo</label>';
        modal += '<div class="controls">';
        modal += '<input type="text" id="telefonoFijo" placeholder="Teléfono Fijo..." name="telefono_fijo">';
        modal += '</div>';
        modal += '</div>';
        modal += '<div class="control-group">';
        modal += '<label class="control-label" for="" >Teléfono Movil</label>';
        modal += '<div class="controls">';
        modal += '<input type="text" id="telefonoMovil" placeholder="Teléfono Movil..." name="telefono_movil">';
        modal += '</div>';
        modal += '</div>';
        /* modal += '<div class="control-group">';
         modal += '<label class="control-label" for="inputDate">Fecha Nacimiento</label>';
         modal += '<div class="controls">';
         modal += '<input type="text" id="inputDate" placeholder="Fecha Nacimiento...">';
         modal += '</div>';
         modal += ' </div>';*/


    } else if (categoria == '/producto/') {


        modal += '<div class="control-group">';
        modal += '<label class="control-label" for="" >Código</label>';
        modal += '<div class="controls">';
        modal += '<input type="text" id="codigo" placeholder="Código..." name="codigo">';
        modal += '</div>';
        modal += '</div>';
        modal += '<div class="control-group">';
        modal += '<label class="control-label" for="" >Nombre</label>';
        modal += '<div class="controls">';
        modal += '<input type="text" id="nombre" placeholder="Nombre..." name="nombre">';
        modal += '</div>';
        modal += '</div>';
        modal += '<div class="control-group">';
        modal += '<label class="control-label" for="" >Descripción</label>';
        modal += '<div class="controls">';
        modal += '<input type="text" id="descripcion" placeholder="Descripción..." name="descripcion">';
        modal += '</div>';
        modal += '</div>';


    } else if (categoria == '/rol/') {


        modal += '<div class="control-group">';
        modal += '<label class="control-label" for="" >Rol</label>';
        modal += '<div class="controls">';
        modal += '<input type="text" id="rol" placeholder="Rol..." name="rol">';
        modal += '</div>';
        modal += '</div>';

    } else if (categoria == '/contratacion/') {

        modal += '<div class="control-group">';
        modal += '<label class="control-label" for="" >Fecha</label>';
        modal += '<div class="controls">';
        modal += '<input type="text" id="fecha" placeholder="Fecha..." name="fecha">';
        modal += '</div>';
        modal += '</div>';

    } else if (categoria == '/forma_pago/') {

        modal += '<div class="control-group">';
        modal += '<label class="control-label" for="" >Forma Pago</label>';
        modal += '<div class="controls">';
        modal += '<input type="text" id="forma_pago" placeholder="Forma Pago..." name="forma_pago">';
        modal += '</div>';
        modal += '</div>';

    } else if (categoria == '/licencia/') {

        modal += '<div class="control-group">';
        modal += '<label class="control-label" for="" >Condiciones</label>';
        modal += '<div class="controls">';
        modal += '<input type="text" id="condiciones" placeholder="Condiciones..." name="condiciones">';
        modal += '</div>';
        modal += '</div>';
        modal += '<div class="control-group">';
        modal += '<label class="control-label" for="" >Validez</label>';
        modal += '<div class="controls">';
        modal += '<input type="text" id="validez" placeholder="Validez..." name="validez">';
        modal += '</div>';
        modal += '</div>';
        modal += '<div class="control-group">';
        modal += '<label class="control-label" for="" >Precio</label>';
        modal += '<div class="controls">';
        modal += '<input type="text" id="precio" placeholder="Precio..." name="precio">';
        modal += '</div>';
        modal += '</div>';
        modal += '<div class="control-group">';
        modal += '<label class="control-label" for="" >IVA</label>';
        modal += '<div class="controls">';
        modal += '<input type="text" id="iva" placeholder="IVA..." name="iva">';
        modal += '</div>';
        modal += '</div>';

    } else if (categoria == '/provincia/') {

        modal += '<div class="control-group">';
        modal += '<label class="control-label" for="" >Provincia</label>';
        modal += '<div class="controls">';
        modal += '<input type="text" id="provincia" placeholder="Provincia..." name="provincia">';
        modal += '</div>';
        modal += '</div>';

    } else if (categoria == '/tipo_via/') {

        modal += '<div class="control-group">';
        modal += '<label class="control-label" for="" >Tipo Via</label>';
        modal += '<div class="controls">';
        modal += '<input type="text" id="tipo_via" placeholder="Tipo Via..." name="tipo_via">';
        modal += '</div>';
        modal += '</div>';

    }

    modal += '</form>';
    modal += '</div>';
    modal += '<div class="modal-footer">';
    modal += '<button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>';
    modal += '<button type="button" class="btn btn-primary" data-dismiss="modal" onclick="javascript:insertData(' + categoria + ');">Guardar</button>';


    modal += '</div>';
    modal += '</div>';

    $('#myModal').html(modal);
}


function ocultarModal() {


}


// jQuery para Modal

/*function mostrarModal() {
 $('#modal').fadeIn();
 $('#modal-background').fadeTo(500, .5);
 
 }
 
 function ocultarModal() {
 $('#modal, #modal-background').fadeOut();
 window.location = 'panelAdministracion.html';
 
 }*/

