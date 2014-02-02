/*
 * FUNCION PARA INICIALIZAR TODO
 */
var init = function() {
    baseURL = 'http://localhost/PymeGestWebsiteServer/web/app_dev.php';
    menu = new Menu('#menuAJAX');
    menu.create(readCategories, readMeta);
    table = new Table($('#tablaAJAX'));
};



var Menu = function(container) {
    var container = container;
    $(container).html('<ul class="nav nav-tabs nav-stacked"></ul>');

    this.categories = [];

    this.create = function(readCategories, readMeta) {
        readCategories(function(categories) {
            var htmlMenu = '';
            categories.forEach(function(category) {
                htmlMenu += '<li><a href="javascript:menu.selectCategory(\'' + categories.indexOf(category) + '\');">' + category.nombre + '</a></li>';
            });
            $(container + ' ul').append(htmlMenu);
            categories.forEach(function(category) {
                readMeta(category, function(meta) {
                    category.meta = meta;
                });
            });
            this.categories = categories;
        });
    };

    this.selectCategory = function(categoryIndex) {
        table.create(categories[categoryIndex], readItems);
    };

};


var Table = function(container) {
    var container = container;
    $(container).html('<table class="table table-bordered" id="dynamic_table"></table>');

    this.rows = [];

    this.create = function(category, readItems) {
        $('#dynamic_table th').remove();
        $('#dynamic_table tr').remove();
        var columns = category.campos.split(',');
        var header = '';
        for (var key in columns) {
            if (category.meta[columns[key]])
                header += '<th>' + category.meta[columns[key]].columnDefinition + '</th>';  
        };
        $('#dynamic_table').prepend(header);
        readItems(category, function(items) {
            var campos = category.campos.split(',');
            $.each(items, function(item) {
                var row = '<tr>';
                $.each(campos, function(campo) {
                    $.each(items[item], function(field) {
                        if (field == campos[campo]) row += '<td>' + items[item][field] + '</td>';
                    });
                });

                row += '</tr>';
                $('#dynamic_table').append(row);
            });

        });

    };

    this.printTable = function() {

    };

    /*this.setHeader = function(columns){
     header = columns;
     $('#dynamic_table th').remove();
     $.each(header, function(key){
     $('#dynamic_table').append('<th>' + header[key] + '</th>');
     });
     };
     
     this.addRows = function(array){
     rows = array;
     var row = [];
     $('#dynamic_table tr').remove();
     $.each(rows, function(rowsKey){
     $.each(row, function(rowKey){
     
     });
     $('#dynamic_table').append('<th>' + row[rowKey] + '</th>');
     });
     };*/

    this.updateTable = function() {

    };

    this.newRow = function() {
        alert('pepe');
    };
};




/*
 * MENU CONTROLLERS
 */
var printMenu = function(categories) {
    var htmlMenu = '';
    categories.forEach(function(category) {
        htmlMenu += '<li><a href="javascript:selectCategory(\'' + category.id + '\');">' + category.nombre + '</a></li>';
    });
    $('#menu').html(htmlMenu);
}

var selectCategory = function(id) {
    readItems(printTable);
};



/*
 * CRUD FUNCTIONS
 */
// Read categories
var readCategories = function(callback) {
    $.ajax({
        dataType: 'json',
        url: baseURL + '/categoria/',
        type: 'GET',
        success: function(data) {
            callback(data);
        }
    });
    return this;
};
// Read metadata
var readMeta = function(category, callback) {
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
var readItems = function(category, callback) {
    $.ajax({
        dataType: 'json',
        url: baseURL + category.url,
        type: 'GET',
        success: function(data) {
            callback(data);
        }
    });
};
// Create item
var createItem = function() {

};
// Update item
var updateItem = function() {

};
// Delete item
var deleteItem = function() {
    $.ajax({
        dataType: 'json',
        url: baseURL + currentCategory.url,
        type: 'DELETE',
        success: function(data) {
            items = data;
            printTable();
        }
    });
};