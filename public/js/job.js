/**
 * Created by pi on 8/30/16.
 */
$(function () {
    var job = {};

    var options = [];
    var gateStorages = [];
    var bulkStorages = [];
    //$scope.job = JSON.parse($("#job").val());
    var senderStorages = [];
    var receiverStorages = [];
    var line = {};
    var lineIdent = $('#lineIdent').val();
    var recipe = JSON.parse($('#recipe').val());
    var product = {};
    console.log('senders: ');
    console.log(recipe.senders);
    $('#sender').val(recipe.senders[0].storageIdent);
    $('#receiver').val(recipe.receivers[0].storageIdent);
    console.log('receiver: ');
    console.log(recipe.receivers);
    getProduct(recipe.receivers[0].StorageId);
    console.log('lineId: ' + lineIdent);
    $.get('/storage/getStorageList/:' + 1, function (storagesOfGate) {
        console.log('storagesOfGate');
        console.log(storagesOfGate);
        gateStorages = storagesOfGate;

        $.get('/storage/getStorageList/:' + 10, function (storagesOfBulk) {
            console.log('storagesOfBulk');
            console.log(storagesOfBulk);
            bulkStorages = storagesOfBulk;


            $.get(' /line/getLine/:' + lineIdent, function (data) {
                console.log('line data');
                console.dir(data);
                if (!data.error) {
                    line = data.line;
                    if (line.category === 1) {
                        senderStorages = gateStorages;
                        receiverStorages = bulkStorages;
                    }
                    else {
                        senderStorages = bulkStorages;
                        receiverStorages = gateStorages;
                    }
                }

                senderStorages.forEach(function (senderStorage) {
                    options.push("<option value='" + senderStorage.id + "'>" + senderStorage.ident + "</option>");
                });
                $('#senderStorages')
                    .append(options.join(""))
                    .selectmenu({
                        change: function (event, ui) {
                            $('#sender').val(ui.item.label);
                            recipe.senders[0].StorageId = ui.item.value;
                            recipe.senders[0].storageIdent = ui.item.label;
                            $.post('/admin/recipe/updateIngredient', {ingredientStr: JSON.stringify(recipe.senders[0])}, function (message) {
                                console.log(message);
                            });

                        }
                    });
                options = [];
                receiverStorages.forEach(function (receiverStorage) {
                    options.push("<option value='" + receiverStorage.id + "'>" + receiverStorage.ident + "</option>");
                });
                $('#receiverStorages')
                    .append(options.join(""))
                    .selectmenu({
                        change: function (event, ui) {
                            recipe.receivers[0].StorageId = ui.item.value;
                            recipe.receivers[0].storageIdent = ui.item.label;
                            $('#receiver').val(ui.item.label);
                            getProduct(recipe.receivers[0].StorageId).then(function (productId) {
                                recipe.receivers[0].ProductId = productId;
                                console.log('receiver productid: ' + recipe.receivers[0].ProductId);
                                $.post('/admin/recipe/updateIngredient', {ingredientStr: JSON.stringify(recipe.receivers[0])}, function (message) {
                                    console.log(message);
                                    $('#infos').append('<li>' + message + '</li>');
                                });
                            });

                        }
                    });
            });
        });
    });

    $('#checkJob').click(function () {
        $('#error').val('');
        var jobId = $('#jobId').val();
        $.get('/job/jobDetail/checkJob/:' + jobId, function (data) {
            if (data.errors) {
                data.errors.forEach(function (error) {
                    $('#errors').append('<li>' + error + '</li>');
                });
            }
            if (data.info) {
                $('#infos').append('<li>' + data.info + '</li>');
            }
        });
    });
    $('#startJob').click(function () {
        $('#error').val('');
        var jobId = $('#jobId').val();
        $.get('/job/jobDetail/startJob/:' + jobId, function (data) {
            if (data.error) {
                $('#error').val(data.error);
            } else if (data.update && data.update.state) {
                $('#state').val(data.update.state);
            }

        });
    });
    $('#doneJob').click(function () {
        $('#error').val('');
        var jobId = $('#jobId').val();
        $.get('/job/jobDetail/doneJob/:' + jobId, function (data) {
            if (data.error) {
                $('#error').val(data.error);
            } else if (data.update && data.update.state) {
                $('#state').val(data.update.state);
            }

        });
    });
    $("form").submit(function (event) {
        console.log('prevent event');
        event.preventDefault();
        var jobInfo = {
            targetWeight: parseFloat($('#targetWeight').val()).toFixed(2),
            locked: $('#locked').prop('checked')
        };
        console.log('Job info: ');
        console.dir(jobInfo);
        $.post('/job/jobDetail/:' + $('#jobId').val(), jobInfo, function (data) {
            console.log(data);
            $('#infos').empty();
            if (!data.error) {
                $('#infos').append('<li>' + data.info + '</li>');
            } else {
                $('#errors').append('<li>' + data.error + '</li>');
            }
        });
    });
    function getProduct(storageId) {
        console.log("storageId: " + storageId);
        return new Promise(function (resolve, reject) {
            if (storageId) {
                $.get('/storage/getStorage/:' + storageId, function (data) {
                    if (!data.error) {
                        var productId = data.storage.ProductId;
                        console.log("productId: " + productId);
                        resolve(productId);
                        if (productId) {
                            $.get('/product/getProduct/:' + productId, function (data) {
                                if (!data.error) {
                                    product = data.product;
                                    console.log("product: ");
                                    console.dir(product);
                                    $('#product').val(data.product.ident);

                                } else {
                                    $('#error').html(data.error);

                                }
                            });
                        }

                    }
                    else {
                        console.log("error: " + data.error);
                        reject(data.error);
                    }

                });
            }
        });


    }

    $('#barcode').focus();
    function _readBarcode(barcode) {
        if(true){

        }
    }
});

