/*
 * FUNCION PARA INICIALIZAR TODO
 */


var init = function() {
    var restService = new RestService();
    restService.config({
        baseURL: 'http://localhost/PymegestWebsiteServer/web'
    });

    table = new Table();
    table.config({
        containerName: 'tablaAJAX',
        persistenceService: restService
    });

    menu = new Menu();
    menu.config({
        containerName: 'menuAJAX',
        persistenceService: restService,
        onSelectCategory: table.print
    });
    menu.print();
};



var Menu = function() {
    var baseMenu = '<ul class="list-group"></ul>';
    var container;
    var persistenceService;
    var onSelectCategory;
    this.categories = [];
    this.config = function(configuration) {
        container = '#' + configuration.containerName;
        persistenceService = configuration.persistenceService;
        onSelectCategory = configuration.onSelectCategory;
    };
    this.print = function() {
        $(container).html(baseMenu);
        var categoriesRepository = {url: '/categoria/'};
        persistenceService.readItems(categoriesRepository, function(categories) {
            var htmlMenu = '';
            categories.forEach(function(category) {
                htmlMenu += '<li class="list-group-item"><a href="javascript:menu.selectCategory(\'' + categories.indexOf(category) + '\');">' + category.nombre + '</a></li>';
            });
            $(container + ' ul').append(htmlMenu);
            this.categories = categories;
            menu.selectCategory(0);
        });
    };
    this.selectCategory = function(categoryIndex) {
        if (!categories[categoryIndex].meta) {
            persistenceService.readMeta(categories[categoryIndex], function(meta) {
                categories[categoryIndex].meta = meta;
                onSelectCategory(categories[categoryIndex]);
            });
        } else {
            onSelectCategory(categories[categoryIndex]);
        }
        ;
    };

    this.findCategoryByName = function(categoryName) {
        var cat = [];
        $.each(categories, function(category) {
            if (categories[category].nombre == categoryName)
                cat = categories[category];
        });
        return cat
    };
};


var Table = function() {

    var baseTable = '<table class="table table-bordered" id="dynamic_table"></table>';
    var baseModal = '<div class="modal fade" id="dynamic_table_modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\n\
                        <div class="modal-dialog">\n\
                            <div class="modal-content">\n\
                                <div class="modal-header">\n\
                                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n\
                                    <h4 class="modal-title" id="myModalLabel">Modal title</h4>\n\
                                </div>\n\
                                <div class="modal-body">\n\
                                    <form class="form-horizontal" role="form" id="modal_form">\n\
                                    </form>\n\
                                </div>\n\
                                <div class="modal-footer">\n\
                                </div>\n\
                            </div>\n\
                        </div>\n\
                    </div>';
    var container;
    var persistenceService;
    var category;
    this.items = [];

    this.config = function(configuration) {
        container = '#' + configuration.containerName;
        persistenceService = configuration.persistenceService;
    };

    this.print = function(categor) {
        $('#dynamic_table').remove();
        $('#dynamic_table_modal').remove();
        category = categor;
        $(container).append(baseModal).append(baseTable);
        $('#dynamic_table tr').remove();
        $('#dynamic_table th').remove();
        var columns = category.camposTabla.split(',');
        var header = '';
        for (var key in columns) {
            if (category.meta[columns[key]])
                header += '<th>' + category.meta[columns[key]].options.toString() + '</th>';
        }
        ;
        header += '<th>\n\
                       Edición\n\
                       <button class="btn btn-info" data-toggle="modal" data-target="#dynamic_table_modal" onclick="javascript:table.newRow()">\n\
                           <i class="glyphicon glyphicon-plus"></i>\n\
                       </button>\n\
                   </th>';
        $('#dynamic_table').prepend(header);
        persistenceService.readItems(category, function(items) {
            $('#dynamic_table tr').remove();

            var campos = category.camposTabla.split(',');
            $.each(items, function(item) {
                var row = '<tr id="dynamyc_table_row' + items[item].id + '">';
                $.each(campos, function(campo) {
                    $.each(items[item], function(field) {
                        if (field === campos[campo]) {
                            row += '<td>' + items[item][field] + '</td>';
                        }
                        ;
                    });
                });
                row += '<td class="table-controls">\n\
                            <button class="btn btn-success" data-toggle="modal" data-target="#dynamic_table_modal" onclick="avascript:table.viewRow(\'' + items.indexOf(items[item]) + '\')" >\n\
                                <i class="glyphicon glyphicon-eye-open"></i>\n\
                            </button>\n\
                            <button class="btn btn-primary" data-toggle="modal" data-target="#dynamic_table_modal" onclick="javascript:table.editRow(\'' + items.indexOf(items[item]) + '\')" >\n\
                                <i class="glyphicon glyphicon-pencil"></i>\n\
                            </button>\n\
                            <button class="btn btn-danger" onclick="javascript:table.deleteRow(\'' + items.indexOf(items[item]) + '\')">\n\
                                <i class="glyphicon glyphicon-trash "></i>\n\
                            </button>\n\
                        </td>';
                $('#dynamic_table').append(row);
            });
            this.items = items;
        });
    };


    this.modal = function() {
        this.formGroup = function(labelFor, labelText, element, hidden) {
            var styleHidden = '';
            if (hidden)
                styleHidden = 'style="visibility:hidden"';
            return '<div class="form-group" ' + styleHidden + '>\n\
                            <label class="col-sm-4 control-label" for="' + labelFor + '">' + labelText + '</label>\n\
                                <div class="col-sm-6">'
                    + element +
                    '</div>\n\
                            </label>\n\
                         </div>';
        };
        this.input = function(inputName, inputPlaceholder, inputValue, disabled) {
            return '<input type="text" class="form-control" name="' + inputName + '" placeholder="' + inputPlaceholder + '" value="' + inputValue + '" ' + disabled + '>';
        };
        this.select = function(selectName, options, disabled) {
            return '<select class="form-control" name="' + selectName + '" ' + disabled + '>' + options + '</select>';
        };
    };

    this.viewRow = function(itemIndex) {
        $('#modal_form *').remove();
        var modal = new this.modal();
        var camposForm = category.camposForm.split(',');
        $.each(camposForm, function(campo) {
            $.each(category.meta, function(fieldMeta) {
                if (camposForm[campo].toString() === category.meta[fieldMeta]['fieldName'].toString()) {
                    if (category.meta[fieldMeta].type === 2) {
                        var labelFor = category.meta[fieldMeta].fieldName.toString().toUpperCase();
                        var inputValue = items[itemIndex][fieldMeta].nombre;
                        var labelText = labelFor;
                        var disabled = 'disabled';
                        var inputName = category.meta[fieldMeta].fieldName;
                        var inputPlaceholder = inputValue;
                        var element = modal.input(inputName, inputPlaceholder, inputValue, disabled);
                        $('#modal_form').append(modal.formGroup(labelFor, labelText, element));
                    } else {
                        var labelFor = category.meta[fieldMeta].options.toString().toUpperCase();
                        var inputValue = items[itemIndex][fieldMeta];
                        var labelText = labelFor;
                        var disabled = 'disabled';
                        var inputName = category.meta[fieldMeta].fieldName;
                        var inputPlaceholder = inputValue;
                        var element = modal.input(inputName, inputPlaceholder, inputValue, disabled);
                        $('#modal_form').append(modal.formGroup(labelFor, labelText, element));
                    }
                }
            });
        });

        $('.modal-footer button').remove();
        $('.modal-footer').append(
                '<button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>\n\
                 <button type="button" class="btn btn-primary" onclick="javascript:table.editRow(\'' + itemIndex + '\')">Editar</button>'
                );
    };

    this.editRow = function(itemIndex) {
        $('#modal_form *').remove();
        var modal = new this.modal();
        var camposForm = category.camposForm.split(',');
        $.each(camposForm, function(campo) {
            $.each(category.meta, function(fieldMeta) {
                if (camposForm[campo].toString() === category.meta[fieldMeta]['fieldName'].toString()) {
                    var disabled = '';
                    if (category.meta[fieldMeta].type === 2) {
                        var labelFor = category.meta[fieldMeta].fieldName.toString().toUpperCase();
                        var entity = category.meta[fieldMeta].targetEntity.split('\\');
                        var linkedCategory = menu.findCategoryByName(entity[entity.length - 1]);
                        var options = '';
                        var linked;
                        var selectName = category.meta[fieldMeta].fieldName;
                        var selectedOption = items[itemIndex][fieldMeta].nombre;
                        persistenceService.readItems(linkedCategory, function(items) {
                            $.each(items, function(item) {
                                if (items[item].nombre === selectedOption) {
                                    options += '<option value="' + items[item].id + '" selected>' + items[item].nombre + '</option>';
                                } else {
                                    options += '<option value="' + items[item].id + '">' + items[item].nombre + '</option>';
                                }
                                ;
                            });
                            $('.form-control[name=' + selectName + ']').append(options);
                        });
                        var element = modal.select(selectName, options, disabled);
                        var labelText = labelFor;
                        $('#modal_form').append(modal.formGroup(labelFor, labelText, element));
                    } else {
                        var hidden = false;
                        if (category.meta[fieldMeta].fieldName === 'id')
                            hidden = true;
                        var labelFor = category.meta[fieldMeta].options.toString().toUpperCase();
                        var inputName = category.meta[fieldMeta].fieldName;
                        var inputValue = items[itemIndex][fieldMeta];
                        var inputPlaceholder = inputValue;
                        var element = modal.input(inputName, inputPlaceholder, inputValue, disabled);
                        var labelText = labelFor;
                        $('#modal_form').append(modal.formGroup(labelFor, labelText, element, hidden));
                    }
                    ;
                }
                ;
            });
        });

        $('.modal-footer button').remove();
        $('.modal-footer').append(
                '<button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>\n\
             <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="javascript:table.updateRow(' + itemIndex + ')">Guradar</button>'
                );
    };

    this.updateRow = function(itemIndex) {
        var itemForm = JSON.stringify($('#modal_form').jsonify());
        persistenceService.updateItem(category, itemForm, function(item) {
            items[itemIndex] = item;
            var campos = category.camposTabla.split(',');
            var row = '';
            $.each(campos, function(campo) {
                $.each(items[itemIndex], function(field) {
                    if (field === campos[campo]) {
                        row += '<td>' + items[itemIndex][field] + '</td>';
                    }
                    ;
                });
            });
            $('#dynamyc_table_row' + items[itemIndex].id + ' td:lt(' + campos.length + ')').remove();
            $('#dynamyc_table_row' + items[itemIndex].id).prepend(row);
        });
    };

    this.saveRow = function() {
        var itemForm = JSON.stringify($('#modal_form').jsonify());
        persistenceService.createItem(category, itemForm, function(item) {
            items.push(item);
            var itemIndex = items.indexOf(item);
            var campos = category.camposTabla.split(',');
            var row = '<tr id="dynamyc_table_row' + items[itemIndex].id + '">';
            $.each(campos, function(campo) {
                $.each(items[itemIndex], function(field) {
                    if (field === campos[campo]) {
                        row += '<td>' + items[itemIndex][field] + '</td>';
                    }
                    ;
                });
            });
            row += '<td class="table-controls">\n\
                            <button class="btn btn-success" data-toggle="modal" data-target="#dynamic_table_modal" onclick="avascript:table.viewRow(\'' + itemIndex + '\')" >\n\
                                <i class="glyphicon glyphicon-eye-open"></i>\n\
                            </button>\n\
                            <button class="btn btn-primary" data-toggle="modal" data-target="#dynamic_table_modal" onclick="javascript:table.editRow(\'' + itemIndex + '\')" >\n\
                                <i class="glyphicon glyphicon-pencil"></i>\n\
                            </button>\n\
                            <button class="btn btn-danger" onclick="javascript:table.deleteRow(\'' + itemIndex + '\')">\n\
                                <i class="glyphicon glyphicon-trash "></i>\n\
                            </button>\n\
                        </td>';
            $('#dynamic_table').append(row);
        });
    };



    this.newRow = function() {
        $('#modal_form *').remove();
        var modal = new this.modal();
        var camposForm = category.camposForm.split(',');
        $.each(camposForm, function(campo) {
            $.each(category.meta, function(fieldMeta) {
                if (camposForm[campo].toString() === category.meta[fieldMeta]['fieldName'].toString()) {
                    var disabled = '';
                    if (category.meta[fieldMeta].type === 2) {
                        var labelFor = category.meta[fieldMeta].fieldName.toString().toUpperCase();
                        var entity = category.meta[fieldMeta].targetEntity.split('\\');
                        var linkedCategory = menu.findCategoryByName(entity[entity.length - 1]);
                        var options = '';
                        var selectName = category.meta[fieldMeta].fieldName;
                        var selectedOption = '';
                        persistenceService.readItems(linkedCategory, function(items) {
                            $.each(items, function(item) {
                                if (items[item].nombre === selectedOption) {
                                    options += '<option value="' + items[item].id + '" selected>' + items[item].nombre + '</option>';
                                } else {
                                    options += '<option value="' + items[item].id + '">' + items[item].nombre + '</option>';
                                }
                                ;
                            });
                            $('.form-control[name=' + selectName + ']').append(options);
                        });
                        var element = modal.select(selectName, options, disabled);
                        var labelText = labelFor;
                        $('#modal_form').append(modal.formGroup(labelFor, labelText, element));
                    } else {
                        var hidden = false;
                        if (category.meta[fieldMeta].fieldName === 'id')
                            hidden = true;
                        var labelFor = category.meta[fieldMeta].options.toString().toUpperCase();
                        var inputName = category.meta[fieldMeta].fieldName;
                        var inputValue = '';
                        var inputPlaceholder = inputValue;
                        var element = modal.input(inputName, inputPlaceholder, inputValue, disabled);
                        var labelText = labelFor;
                        $('#modal_form').append(modal.formGroup(labelFor, labelText, element, hidden));
                    }
                    ;
                }
            });
        });

        $('.modal-footer button').remove();
        $('.modal-footer').append(
                '<button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>\n\
             <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="javascript:table.saveRow()">Guradar</button>'
                );
    };

    this.deleteRow = function(itemIndex) {
        persistenceService.deleteItem(category, items[itemIndex].id, function(item) {
            $('#dynamyc_table_row' + items[itemIndex].id).remove();
            //items.splice(itemIndex, 1);
        });
    };

    /*this.addRow = function() {
        $('#modal_form *').remove();
        var item = JSON.stringify($('#modal_form').jsonify());
        persistenceService.createItem(category, item, function(item) {
            var campos = category.camposTabla.split(',');
            var row = '<tr id="dynamyc_table_row' + item.id + '">';

            $.each(campos, function(campo) {
                $.each(item, function(field) {
                    if (field === campos[campo]) {
                        row += '<td>' + item[field] + '</td>';
                    }
                    ;
                });
            });
            row += '<td class="table-controls">\n\
                            <button class="btn btn-success" data-toggle="modal" data-target="#dynamic_table_modal" onclick="avascript:table.viewRow(\'' + items.indexOf(items[item]) + '\')" >\n\
                                <i class="glyphicon glyphicon-eye-open"></i>\n\
                            </button>\n\
                            <button class="btn btn-primary" data-toggle="modal" data-target="#dynamic_table_modal" onclick="javascript:table.editRow(\'' + items.indexOf(items[item]) + '\')" >\n\
                                <i class="glyphicon glyphicon-pencil"></i>\n\
                            </button>\n\
                            <button class="btn btn-danger" onclick="javascript:table.deleteRow(\'' + items.indexOf(items[item]) + '\')">\n\
                                <i class="glyphicon glyphicon-trash "></i>\n\
                            </button>\n\
                        </td>';
            $('#dynamic_table').append(row);
        });
    };*/
};



/*
 * REST SERVICE
 */

var RestService = function() {

    var baseURL = '';

    this.config = function(configuration) {
        baseURL = configuration.baseURL;
    };

    // Read metadata
    this.readMeta = function(category, callback) {
        $.ajax({
            dataType: 'json',
            url: baseURL + category.url + 'meta/',
            type: 'GET',
            success: function(data) {
                callback(data);
            }
        });
    };

    // Read items
    this.readItems = function(category, callback) {
        $.ajax({
            dataType: 'json',
            url: baseURL + category.url,
            type: 'GET',
            success: function(items) {
                callback(items);
            }
        });
    };

    // Create item
    this.createItem = function(category, item, callback) {
        $.ajax({
            dataType: 'json',
            url: baseURL + category.url,
            type: 'POST',
            data: item,
            statusCode: {
                200: function(item) {
                    callback(item);
                }
            }
        });
    };

    // Update item
    this.updateItem = function(category, itemForm, callback) {
        $.ajax({
            dataType: 'json',
            url: baseURL + category.url,
            type: 'PUT',
            data: itemForm,
            statusCode: {
                200: function(item) {
                    callback(item);
                }
            }
        });
    };

    // Delete item
    this.deleteItem = function(category, itemId, callback) {
        alert(baseURL + category.url + itemId)
        $.ajax({
            dataType: 'json',
            url: baseURL + category.url + itemId,
            type: 'DELETE',
            statusCode: {
                204: function(item) {
                    callback(item);
                }
            }
        });
    };
};
