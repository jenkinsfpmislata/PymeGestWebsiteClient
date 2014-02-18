
producto = [];

productoMeta = [];

licencias = [];

formasPago = [];



var validar = function() {

    $("#formRegistrarion").validate({
        debug: true,
        errorClass: 'error help-inline',
        validClass: 'success',
        errorElement: 'span',
        rules: {
            formaPago: {
                required: true
            },
            aceptConditions: {
                required: true
            },
            tipoLicencia: {
                required: true
            }
        },
        messages: {
            formaPago: {
                required: "Debe seleccionar una de las formas de pago."
            },
            aceptConditions: {
                required: "Para aceptar pulse la casilla."
            },
            tipoLicencia: {
                required: "Debe elegir una licencia de uso para la aplicación."
            }
        },
        submitHandler: function(form) {
            //insertUser(form);   //pasamos el formulario a insertUser
            //$('#confirmPurchase').attr('data-toggle', 'modal');
            // $('#confirmPurchase').attr('data-target', '#myModalConfirm');
        }
    });

};

jQuery.extend({
    getURLParam: function(strParamName) {
        var strReturn = "";
        var strHref = window.location.href;
        var bFound = false;

        var cmpstring = strParamName + "=";
        var cmplen = cmpstring.length;

        if (strHref.indexOf("?") > -1) {
            var strQueryString = strHref.substr(strHref.indexOf("?") + 1);
            var aQueryString = strQueryString.split("&");
            for (var iParam = 0; iParam < aQueryString.length; iParam++) {
                if (aQueryString[iParam].substr(0, cmplen) == cmpstring) {
                    var aParam = aQueryString[iParam].split("=");
                    strReturn = aParam[1];
                    bFound = true;
                    break;
                }
            }
        }
        if (bFound == false)
            return null;
        return strReturn;
    }
});

var readProductMeta = function() {

    $.ajax({
        dataType: 'json',
        url: 'http://localhost/PymeGestWebsiteServer/web/app_dev.php/producto/meta/',
        type: 'GET',
        success: function(data) {
            productoMeta = data;

        }
    });
};

var readProduct = function() {

    var id = $.getURLParam("id");

    $.ajax({
        dataType: 'json',
        url: 'http://localhost/PymeGestWebsiteServer/web/app_dev.php/producto/' + id,
        type: 'GET',
        success: function(data) {
            producto = data;

            var htmlProductoLegend = '<legend>Producto Seleccionado</legend>';
            var htmlProducto = '';

            $.each(data, function(index) {

                if (data[index] != id) {

                    htmlProducto += '<div class="control-group registrationControls">';
                    htmlProducto += '<label class="control-label">' + productoMeta[index].options + ':</label>';
                    htmlProducto += '<div class="textoColumnDerecha" >';
                    htmlProducto += '<div class="textoProducto" id="producto_' + data[index] + '">' + data[index] + '</div>';
                    htmlProducto += '</div>';
                    htmlProducto += '</div>';

                }
            });

            $('#imprimirProducto').html(htmlProductoLegend + htmlProducto);
            $('#imprimirConfirmarProducto').html('<legend>Confirmar</legend>' + htmlProducto);

        }
    });
};

var readLicencia = function() {

    $.ajax({
        dataType: 'json',
        url: 'http://localhost/PymeGestWebsiteServer/web/app_dev.php/licencia/',
        type: 'GET',
        success: function(data) {

            licencias = data;

            var htmlLicencia = '<legend>Licencia</legend>';
            htmlLicencia += '<div class="control-group registrationControls">';
            htmlLicencia += '<label class="control-label">Tipo de licencia: </label>';
            htmlLicencia += '<div class="textoColumnDerecha" >';
            htmlLicencia += '<select class="span3" id="tipoLicencia" name="tipoLicencia" required>';
            htmlLicencia += '<option value="" selected >Tipo de licencia...</option>';
            $.each(data, function(index) {
                
                htmlLicencia += '<option value="' + data[index].id + '">' + data[index].nombre + '</option>';

            });

            htmlLicencia += '</select>';
            htmlLicencia += '</div>';
            htmlLicencia += '</div>';
            htmlLicencia += '<div id="datosLicencia">';
            htmlLicencia += '</div>';

            $('#imprimirLicencia').html(htmlLicencia);

            $('select#tipoLicencia').on('change', function() {
                var htmlDatosLicencia = '';
                var idLicenciaSelect = $(this).val();

                $.each(licencias, function(licencia) {

                    if (licencias[licencia].id == idLicenciaSelect) {

                        htmlDatosLicencia += '<div class="control-group registrationControls">';
                        htmlDatosLicencia += '<label class="control-label">Validez: </label>';
                        htmlDatosLicencia += '<div class="textoColumnDerecha" >';
                        htmlDatosLicencia += '<div class="textoProducto">' + licencias[licencia].validez + '</div>';
                        htmlDatosLicencia += '</div>';
                        htmlDatosLicencia += '</div>';
                        htmlDatosLicencia += '<div class="control-group registrationControls">';
                        htmlDatosLicencia += '<label class="control-label">Precio: </label>';
                        htmlDatosLicencia += '<div class="textoColumnDerecha" >';
                        htmlDatosLicencia += '<div class="textoProducto">' + licencias[licencia].precio + '</div>';
                        htmlDatosLicencia += '</div>';
                        htmlDatosLicencia += '</div>';
                        htmlDatosLicencia += '<div class="control-group registrationControls">';
                        htmlDatosLicencia += '<label class="control-label">IVA: </label>';
                        htmlDatosLicencia += '<div class="textoColumnDerecha" >';
                        htmlDatosLicencia += '<div class="textoProducto">' + licencias[licencia].iva + '</div>';
                        htmlDatosLicencia += '</div>';
                        htmlDatosLicencia += '</div>';
                        htmlDatosLicencia += '<div class="control-group registrationControls">';
                        htmlDatosLicencia += '<label class="control-label">Condiciones: </label>';
                        htmlDatosLicencia += '<div class="textoColumnDerecha" >';
                        htmlDatosLicencia += '<div class="textoProducto">' + licencias[licencia].condiciones + '</div>';
                        htmlDatosLicencia += '</div>';
                        htmlDatosLicencia += '</div>';
                    }
                });
                $('#datosLicencia').html(htmlDatosLicencia);
                $('#imprimirConfirmarLicencia').html(htmlDatosLicencia);
            });

        }
    });
};

var readFormasPago = function() {

    $.ajax({
        dataType: 'json',
        url: 'http://localhost/PymeGestWebsiteServer/web/app_dev.php/forma_pago/',
        type: 'GET',
        success: function(data) {
            formasPago = data;

            var htmlFormaPagoLegend = '<legend>Formas de pago</legend>';
            var htmlFormaPago = '';

            $.each(data, function(index) {

                htmlFormaPago += '<div class="control-group registrationControls">';
                htmlFormaPago += '<label class="control-label">' + data[index].formaPago + ':</label>';
                htmlFormaPago += '<div class="textoColumnDerechaInput" >';
                htmlFormaPago += '<input type="radio" id="' + data[index].id + '" name="formaPago" onclick="javascript:readConfirmarFormaPago();" value="' + data[index].formaPago + '" required>';
                htmlFormaPago += '</div>';
                htmlFormaPago += '</div>';

            });

            $('#imprimirFormasPago').html(htmlFormaPagoLegend + htmlFormaPago);

        }
    });
};

var readConfirmarFormaPago = function() {

    var nombreFormaPago = $("input[name=formaPago]:checked").val();

    if ($("input[name=formaPago]:checked").val()) {

        var htmlPreConfirmar = '<div class="control-group registrationControls">';
        htmlPreConfirmar += '<label class="control-label">Forma de Pago:</label>';
        htmlPreConfirmar += '<div class="textoColumnDerecha" >';
        htmlPreConfirmar += '<div class="textoProducto" id="' + nombreFormaPago + '">' + nombreFormaPago + '</div>';
        htmlPreConfirmar += '</div>';
        htmlPreConfirmar += '</div>';
    }

    $('#imprimirConfirmarFormaPago').html(htmlPreConfirmar);
};


var menuStep = function() {

    /*  var steps = $("#formRegistrarion fieldset");
     
     var count = steps.size();
     
     steps.each(function(i) {
     $(this).wrap("<div id='step" + i + "'></div>");
     $(this).append("<p id='step" + i + "commands'></p>");
     
     if (i == 0) {
     createNextButton(i);        // to do
     selectStep(i);                  // to do
     }
     else if (i == count - 1) {
     $("#step" + i).hide();
     createPrevButton(i);       // to do
     }
     else {
     $("#step" + i).hide();
     createPrevButton(i);       // to do
     createNextButton(i);       // to do
     }
     });
     
     
     
     
     function createPrevButton(i) {
     
     var stepName = "step" + i;
     
     $("#" + stepName + "commands").append("<a href='#' id='" + stepName + "Prev' class='prev'><Back</a>");
     
     $("#" + stepName + "Prev").bind("click", function(e) {
     $("#" + stepName).hide();
     $("#step" + (i - 1)).show();
     selectStep(i - 1);
     });
     }
     
     function createNextButton(i) {
     var stepName = "step" + i;
     $("#" + stepName + "commands").append("<a href='#' id='" + stepName + "Next' class='next'>Next></a>");
     $("#" + stepName + "Next").bind("click", function(e) {
     $("#" + stepName).hide();
     $("#step" + (i + 1)).show();
     selectStep(i + 1);
     });
     }*/

};