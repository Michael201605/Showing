/**
 * Created by pi on 8/17/16.
 */
var GcObjectDialog, jobListDialog, jobDetailDialog, StorageDialog, ScaleDialog, socket;
$(function () {
    //modal dialog------

    // From http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#e-mail-state-%28type=email%29
    // emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    // name = $( "#name" ),
    // email = $( "#email" ),
    // password = $( "#password" ),
    // allFields = $( [] ).add( name ).add( email ).add( password ),
    // tips = $( ".validateTips" );
    $('#errors').selectmenu();
    GcObjectDialog = $("#GCObject-form").dialog({
        title: 'GcObject',
        autoOpen: false,
        height: 400,
        width: 350,
        modal: true,
        buttons: {
            Cancel: function () {
                GcObjectDialog.dialog("close");
            }
        },
        close: function () {

        }
    });
    jobListDialog = $("#jobListDialog").dialog({
        title: 'GcObject',
        autoOpen: false,
        height: 800,
        width: 1000,
        modal: false,
        buttons: {
            Cancel: function () {
                jobListDialog.dialog("close");
            }
        },
        close: function () {

        }
    });

    jobDetailDialog = $("#jobDetailDialog").dialog({
        title: 'GcObject',
        autoOpen: false,
        height: 900,
        width: 1200,
        modal: false,
        buttons: {
            Cancel: function () {
                jobListDialog.dialog("close");
            }
        },
        close: function () {

        }
    });

    var server = location.href;
    console.log(server);
    socket = io(server);

    // form = dialog.find( "form" ).on( "submit", function( event ) {
    //     event.preventDefault();
    //     addUser();
    // });

    //-------------------------------

    //load svg file
    $('#home').load('svgImage/Start.svg');
    var navigations = JSON.parse($("#navigations").val());
    navigations.forEach(function (nav) {
        var url = 'svgImage/' + nav.index + '.svg';
        $('#' + nav.index).load(url);
    });

    //socket communication with server to update GCObject's state
    try {

        socket.on('AllGcObjectsStateChanged', function (nodeData) {
            // var GCObjects = JSON.parse(GCObjectsStr);
            console.log('has received event');
            console.dir(nodeData);

            var nodeId = nodeData.monitored_nodeId;
            if (nodeId) {
                var segments = nodeId.split('.');
                var ident = segments[3].substring(1);
                var category = segments[2];
                var state = segments[5];
                var value = nodeData.dataValue;
                var color = '';
                console.log('category: ' + ident);
                console.log('category: ' + category);
                console.log('paraName: ' + state);
                var $gcObject = $('#' + ident);
                if ($gcObject) {
                    switch (category) {
                        case 'BeltMonitor':
                            setBeltMonitorColorByState(ident, state, value);
                            break;
                        case 'FilterControl':
                            setFilterControlColorByState(ident, state, value);
                            break;
                        case 'HighLevel':
                            setHighLevelColorByState(ident, state, value);
                            break;
                        case 'SimpleMotor':
                            setSimpleMotorColorByState(ident, state, value);
                            break;
                        case 'SpeedMonitor':
                            setSpeedMonitorColorByState(ident, state, value);
                            break;
                        case 'ValveOpenClose':
                            setValveOpenCloseColorByState(ident, state, value);
                            break;
                        default:
                            break;
                    }
                }


            }


        });
        socket.on('sectionStateChanged', function (section) {
            if (section) {
                $('#' + section.ident)
                    .removeClass()
                    .addClass(function (section) {
                        var stateClass;
                        switch (section.state) {
                            case GcsState.Passive:
                                stateClass = 'Passive';
                                break;
                            case GcsState.Active:
                                stateClass = 'Active';
                                break;
                            case GcsState.Emptying:
                                stateClass = 'Emptying';
                                break;
                            case GcsState.Ready:
                                stateClass = 'Ready';
                                break;
                            case GcsState.Waiting:
                                stateClass = 'Waiting';
                                break;
                            default:
                                stateClass = 'Passive';
                                break;
                        }
                        return stateClass;
                    });
            }
        });
        socket.on('connect_timeout', function (data) {
            console.log('connect_timeout', data);
        });
        socket.on('error', function (data) {
            console.log('error', data);
        });
        socket.on('disconnect', function () {
            console.log('disconnected......');
        });

    } catch (ex) {
        console.log('exception happened:', ex);
    }

});

function Storage(BinIdent) {
    if (BinIdent) {
        var url = '/storage/StorageDetail/:' + BinIdent;
        var win = window.open(url, '_blank');
        win.focus();
    } else {
        alert('BIN Ident is empty');
    }

}
function Scale(Ident) {
    if (Ident) {
        var url = '/scale/ScaleDetail/:' + Ident;
        var win = window.open(url, '_blank');
        win.focus();
    } else {
        alert('Scale Ident is empty');
    }

}
function jobList(lineIdent) {
    var jobListDataTable;
    var selected = [];
    var clickMethod = '';
    if (lineIdent) {
        var url = '/job/getJobList/:' + lineIdent;
        $.get('/job/getJobList/:' + lineIdent, function (data) {
            console.log('jobListStr: ' + data.jobs);
            $('#lineIdent').val(data.lineIdent);
            jobListDialog.dialog('option', 'title', 'JobList: ' + lineIdent);
            jobListDialog.dialog('open');
            var jobList = JSON.parse(data.jobs);
            jobListDataTable = $('#jobListTable').DataTable();
            jobList.forEach(function (theJob) {
                clickMethod = 'jobDetail(' + theJob.id + ')';
                var rowNode = jobListDataTable.row.add([
                    '<a href="javascript:void(0);" onclick=' + clickMethod + '>' + theJob.ident + '</a>',
                    theJob.lineIdent,
                    theJob.displayState
                ]).draw(false).node();
                $(rowNode).attr('id', theJob.id);

            });
            // jobListDataTable.row.draw();


        });
        $('#jobListTable tbody').on('click', 'tr', function () {
            var id = this.id;
            var index = $.inArray(id, selected);

            if (index === -1) {
                selected.push(id);
            } else {
                selected.splice(index, 1);
            }
            console.log('id: ');
            console.log(selected);
            $(this).toggleClass('selected');
        });
        $('#newJob').click(function () {
            $.get('/job/jobList/createJob/:' + lineIdent, function (data) {
                var newJob = null;
                console.log('data: ' + data);
                if (!data.error) {
                    newJob = data.job;
                    console.log('newJob: ' + newJob);
                    console.log('newJob id: ' + newJob.id);
                    console.log('newJob State: ' + newJob.displayState);
                    clickMethod = 'jobDetail(' + newJob.id + ')';
                    jobListDataTable.row.add([
                        '<a href="javascript:void(0);" onclick=' + clickMethod + '>' + newJob.ident + '</a>',
                        newJob.lineIdent,
                        newJob.displayState
                    ]).draw(false);

                } else {
                    $('#jobsErrors').append('<li>' + data.error + '</li>');
                }

            });
        });
        $('#deleteJob').click(function () {
            var toDeleteJobIdsStr = JSON.stringify(selected);
            console.log('toDeleteJobIdsStr: ' + toDeleteJobIdsStr);
            jobListDataTable.row('.selected').remove().draw(false);
            $.post('/job/jobList/deleteJob', {toDeleteJobIdsStr: toDeleteJobIdsStr}, function (data) {
                console.log(data);

            });
        });
    } else {
        alert('line Ident is empty');
    }

}
function jobDetail(jobId) {
    var jobDetailDataTable;
    var selected = [];
    var clickMethod = '';
    var options = [];
    var gateStorages = [];
    var bulkStorages = [];
    var senderStorages = [];
    var receiverStorages = [];
    $.get('/job/getJobDetail/:' + jobId, function (data) {
        var theJob;
        var theRecipe;
        if(!data.error){
            theJob = data.job;
            theRecipe = data.recipe;
            jobDetailDialog.dialog('option', 'title', 'JobDetail: ' + jobId);
            jobDetailDialog.dialog('open');
            $.get('/storage/getStorageList/:' + 1, function (storagesOfGate) {
                console.log('storagesOfGate');
                console.log(storagesOfGate);
                gateStorages = storagesOfGate;

                $.get('/storage/getStorageList/:' + 10, function (storagesOfBulk) {
                    console.log('storagesOfBulk');
                    console.log(storagesOfBulk);
                    bulkStorages = storagesOfBulk;


                    $.get(' /line/getLine/:' + theJob.lineIdent, function (data) {
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
                                        $.post('/admin/recipe/updateIngredient', {ingredientStr: JSON.stringify(recipe.receivers[0])}, function (data) {
                                            console.dir(data);
                                            if (data.info) {
                                                $('#infos').append('<li>' + data.info + '</li>');
                                            }
                                        });

                                    });

                                }
                            });
                    });
                });
            });
            $('#jobIdent').val(theJob.ident);
            $('#lineIdent').val(theJob.lineIdent);
            $('#displayJobState').val(theJob.displayState);
            $('#jobState').val(theJob.state);
            $('#locked').val(theJob.locked);
            $('#productIdent').val(theJob.productIdent);
            $('#targetWeight').val(theJob.targetWeight);
            $('#actualWeight').val(theJob.actualWeight);



        }else{
            $('#jobsErrors').append('<li>' + data.error + '</li>');
        }
    });
    $('#checkJob').click(function () {
        $('#error').val('');
        $('#errors').empty();
        var jobId = $('#jobId').val();
        $.get('/job/jobDetail/checkJob/:' + jobId, function (data) {
            if (data.errors) {
                data.errors.forEach(function (error) {
                    $('#jobErrors').append('<li>' + error + '</li>');
                });
            }
            if (data.info) {
                $('#jobInfos').append('<li>' + data.info + '</li>');
            }
        });
    });
    $('#startJob').click(function () {
        $('#jobErrors').val('');
        var jobId = $('#jobId').val();
        $.get('/job/jobDetail/startJob/:' + jobId, function (data) {
            if (data.error) {
                $('#jobErrors').append('<li>' + data.error + '</li>');
            } else if (data.update) {
                $('#displayState').val(data.update.displayState);
                $('#state').val(data.update.state);
                setJobBKColor(data.update.state);
            }

        });
    });
    $('#doneJob').click(function () {
        $('#error').val('');
        var jobId = $('#jobId').val();
        $.get('/job/jobDetail/doneJob/:' + jobId, function (data) {
            if (data.error) {
                $('#error').val(data.error);
            }
            if (data.update) {
                $('#displayState').val(data.update.displayState);
                $('#state').val(data.update.state);
                setJobBKColor(data.update.state);
            }
            if (data.info) {
                $('#jobInfos').append('<li>' + data.info + '</li>');
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
            $('#jobInfos').empty();
            if (!data.error) {
                $('#jobInfos').append('<li>' + data.info + '</li>');
            } else {
                $('#jobErrors').append('<li>' + data.error + '</li>');
            }
        });
    });
}
function getProduct(storageId) {
    var product = {};
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
                                $('#productIdent').val(product.ident);
                                $('#productName').val(product.name);
                                $.post('/job/jobDetail/:' + $('#jobId').val(), {
                                    productIdent: product.ident,
                                    productName: product.name
                                }, function (data) {
                                });


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
function GcObject(gcIdent) {
    console.log('ident: ' + gcIdent);


    $.get('/gcobject/:' + gcIdent, function (gcObject) {
        console.log('gcObejct:');
        console.dir(gcObject);
        GcObjectDialog.dialog('option', 'title', 'GcObject: ' + gcIdent);

        GcObjectDialog.data('gcObject', gcObject).dialog('open');
        $('#Category').html(gcObject.category);
        setGcObjectButtons(gcObject);
        showTypeButtons(gcObject.category);
        $('#Mannual').click(function () {
            var command = {
                nodeId: gcObject.nodeId + '.Commands.CmdManual',
                value: true,
                gcObject: gcObject
            };
            sendCommandToServer(command);
        });
        $('#Aumatic').click(function () {
            var command = {
                nodeId: gcObject.nodeId + '.Commands.CmdManual',
                value: false,
                gcObject: gcObject
            };
            sendCommandToServer(command);
        });
        $('#close').click(function () {
            var command = {
                nodeId: gcObject.nodeId + '.HardwareIO.ValInput1',
                value: false,
                gcObject: gcObject
            };
            sendCommandToServer(command);
        });
        $('#Open').click(function () {
            var command = {
                nodeId: gcObject.nodeId + '.HardwareIO.ValInput1',
                value: true,
                gcObject: gcObject
            };
            sendCommandToServer(command);
        });
        try {

            socket.on('GCObjectUpdate', function (nodeData) {
                // var GCObjects = JSON.parse(GCObjectsStr);
                console.log('has received event');
                console.dir(nodeData);

                var nodeId = nodeData.monitored_nodeId;
                if (nodeId) {
                    var segments = nodeId.split('.');
                    var ident = segments[3].substring(1);
                    var category = segments[4];
                    var paraName = segments[5];
                    var value = nodeData.dataValue;
                    console.log('category: ' + ident);
                    console.log('category: ' + category);
                    console.log('paraName: ' + paraName);
                    if (ident === gcObject.ident) {
                        gcObject.gcObjectParameter[category][paraName] = value;
                        setGcObjectButtons(gcObject);
                    }
                }


            });
            socket.on('connect_timeout', function (data) {
                console.log('connect_timeout', data);
            });
            socket.on('error', function (data) {
                console.log('error', data);
            });
            socket.on('disconnect', function () {
                console.log('disconnected......');
            });

        } catch (ex) {
            console.log('exception happened:', ex);
        }
    });

}
function sendCommandToServer(command) {

    $.post('/gcobject', {commandStr: JSON.stringify(command)}, function (err) {

        if (err) {
            console.log(err);
        } else {
            console.log('no error');
        }
    });
}
function showTypeButtons(category) {
    switch (category) {
        case 'BeltMonitor':
        case 'SpeedMonitor':
            $('#healtyUnhealty').removeClass('hidden');
            break;
        case 'FilterControl':
        case 'SimpleMotor':
            $('#startStop').removeClass('hidden');
            break;
        case 'HighLevel':
        case 'LowLevel':
            $('#coverUncover').removeClass('hidden');
            break;
        case 'ValveOpenClose':
            $('#openClose').removeClass('hidden');
            break;
    }
}
//status lamp
//light green : starting
//green: started
//blue: stopping
//grey: stopped
function setGcObjectButtons(gcObject) {
    $('#modeField').removeClass("hidden");
    if (gcObject.gcObjectParameter.Commands.CmdManual === false) {
        $('#Mannual').attr("disabled", false);
        $('#Aumatic').attr("disabled", true);
        //
        $('#closeGc').attr("disabled", true);
        $('#OpenGc').attr("disabled", true);
        //
        $('#stopGc').attr("disabled", true);
        $('#startGc').attr("disabled", true);

        $('#mode').attr('fill', 'green');
    } else if (gcObject.gcObjectParameter.Commands.CmdManual === true) {
        $('#mode').attr('fill', 'grey');
        $('#Mannual').attr("disabled", true);
        $('#Aumatic').attr("disabled", false);
        if (gcObject.gcObjectParameter.States.StaStarted) {
            $('#closeGc').attr("disabled", false);
            $('#OpenGc').attr("disabled", true);
            //
            $('#stopGc').attr("disabled", false);
            $('#startGc').attr("disabled", true);
        } else if (gcObject.gcObjectParameter.States.StaStopped) {
            $('#closeGc').attr("disabled", true);
            $('#OpenGc').attr("disabled", false);
            //
            $('#stopGc').attr("disabled", true);
            $('#startGc').attr("disabled", false);
        } else {
            $('#closeGc').attr("disabled", true);
            $('#OpenGc').attr("disabled", true);
            //
            $('#stopGc').attr("disabled", true);
            $('#startGc').attr("disabled", true);
        }

    } else {
        $('#modeField').addClass("hidden");
        if (gcObject.gcObjectParameter.States.StaHealty === true) {
            $('#unhealtyGc').attr("disabled", false);
            $('#healtyGc').attr("disabled", true);
        } else if (gcObject.gcObjectParameter.States.StaHealty === false) {
            $('#unhealtyGc').attr("disabled", true);
            $('#healtyGc').attr("disabled", false);
        } else {
            $('#unhealtyGc').attr("disabled", true);
            $('#healtyGc').attr("disabled", true);
        }
        if (gcObject.gcObjectParameter.States.StaCovered) {
            $('#uncoverGc').attr("disabled", false);
            $('#coverGc').attr("disabled", true);
        } else if (gcObject.gcObjectParameter.States.StaUncovered) {
            $('#uncoverGc').attr("disabled", true);
            $('#coverGc').attr("disabled", false);
        } else {
            $('#uncoverGc').attr("disabled", true);
            $('#coverGc').attr("disabled", true);
        }
    }


    //simpleMotor filterControl
    if (gcObject.gcObjectParameter.States.StaStarting) {
        $('#status').attr('fill', 'LightGreen');
    }
    else if (gcObject.gcObjectParameter.States.StaStarted) {
        $('#status').attr('fill', 'Green');
    } else if (gcObject.gcObjectParameter.States.StaStopping) {
        $('#status').attr('fill', 'Blue');
    } else if (gcObject.gcObjectParameter.States.StaStopped) {
        $('#status').attr('fill', 'Grey');
    } else if (gcObject.gcObjectParameter.States.StaFault) {
        $('#status').attr('fill', 'Red');
    }
    //highLevel or lowlevel
    if (gcObject.gcObjectParameter.States.StaCover) {
        $('#status').attr('fill', 'LightGreen');
    }
    else if (gcObject.gcObjectParameter.States.StaCovered) {
        $('#status').attr('fill', 'Green');
    } else if (gcObject.gcObjectParameter.States.StaUncover) {
        $('#status').attr('fill', 'Blue');
    } else if (gcObject.gcObjectParameter.States.StaUncovered) {
        $('#status').attr('fill', 'Grey');
    } else if (gcObject.gcObjectParameter.States.StaFaulted) {
        $('#status').attr('fill', 'Red');
    }
    //BeltMonitor
    if (gcObject.gcObjectParameter.States.StaHealty === true) {
        $('#status').attr('fill', 'Green');
    }
    else if (gcObject.gcObjectParameter.States.StaHealty === false) {
        $('#status').attr('fill', 'Grey');
    }
    //highlevel
    if (gcObject.gcObjectParameter.States.StaOpening) {
        $('#status').attr('fill', 'LightGreen');
    }
    else if (gcObject.gcObjectParameter.States.StaOpened) {
        $('#status').attr('fill', 'Green');
    } else if (gcObject.gcObjectParameter.States.StaClosing) {
        $('#status').attr('fill', 'Blue');
    } else if (gcObject.gcObjectParameter.States.StaClosed) {
        $('#status').attr('fill', 'Grey');
    } else if (gcObject.gcObjectParameter.States.StaFault) {
        $('#status').attr('fill', 'Red');
    }

}
function updateStatus(GCObject) {
    var color = getColorByState(GCObject.State);
    setBKColor($('#' + GCObject.id), color);
}
function getColorByState(state, value) {
    var color = '';
    if ($.isNumeric(state)) {
        switch (state) {
            case 10:
                //passive
                color = 'grey';
                break;
            case 20:
                //running
                color = 'blue';
                break;
            case 30:
                //ready
                color = 'green';
                break;
            case 40:
                //error
                color = 'red';
                break;
            default:
                color = 'grey';
        }
    } else if (typeof (state) === 'string') {
        switch (state) {
            case 'Passive':
                //passive
                color = 'grey';
                break;
            case 'Running':
                //running
                color = 'blue';
                break;
            case 'Ready':
                //ready
                color = 'green';
                break;
            case 'Error':
                //error
                color = 'red';
                break;
            case 'StaFault':

                //passive
                color = 'grey';
                break;
            default:
                color = 'grey';
        }
    }
    return color;
}

function setBeltMonitorColorByState(ident, state, value) {
    var color = '';
    var pathId = ident + '-path';
    var $gcObject = $('#' + ident);
    var $path = $('#' + pathId);
    switch (state) {
        case 'StaFaulted':
            $gcObject.attr(state, value);
            if (value) {
                color = 'red';
            }
            break;
        case 'StaHealty':
            //running
            if (value) {
                color = 'Green';
            }
            else {
                color = '#c0c0c0';
            }
            break;
        default:
            color = 'Black';
    }
    setBKColor($gcObject, color);
    setBKColor($path, color);
}
function setFilterControlColorByState(ident, state, value) {
    var color = '';
    var pathId = ident + '-path';
    var $gcObject = $('#' + ident);
    var $path = $('#' + pathId);
    switch (state) {
        case 'StaFault':
            $gcObject.attr(state, value);
            if (value) {
                color = 'red';
            }
            break;
        case 'StaStarted':
            //running
            if (value) {
                color = 'Green';
            }
            break;
        case 'StaStarting':
            if (value) {
                color = 'LightGreen';
            }
            break;
        case 'StaStopped':
            if (value) {
                color = 'Grey';
            }
            break;
        case 'StaStopping':
            if (value) {
                color = 'Blue';
            }
            break;
        default:
            color = 'Black';
    }
    setBKColor($gcObject, color);
    setBKColor($path, color);
}
function setHighLevelColorByState(ident, state, value) {
    var color = '';
    var pathId = ident + '-path';
    var $gcObject = $('#' + ident);
    var $path = $('#' + pathId);
    switch (state) {
        case 'StaCover':
            $gcObject.attr(state, value);
            if (value) {
                color = 'LightGreen';
            }
            break;
        case 'StaCovered':
            //running
            if (value) {
                color = 'Blue';
            }
            break;
        case 'StaFaulted':
            if (value) {
                color = 'Red';
            }
            break;
        case 'StaUncover':
            if (value) {
                color = 'LightGreen';
            }
            break;
        case 'StaUncovered':
            if (value) {
                color = 'Grey';
            }
            break;
        default:
            color = 'Black';
    }
    setBKColor($gcObject, color);
    setBKColor($path, color);
}
function setSimpleMotorColorByState(ident, state, value) {
    var color = '';
    var pathId = ident + '-path';
    var selectorId = ident + '-selector';
    var $gcObject = $('#' + ident);
    var $path = $('#' + pathId);
    var $selector = $('#' + selectorId);
    switch (state) {
        case 'StaFault':
            $gcObject.attr(state, value);
            if (value) {
                color = 'red';
            }
            break;
        case 'StaStarted':
            //running
            if (value) {
                color = 'Green';
            }
            break;
        case 'StaStarting':
            if (value) {
                color = 'LightGreen';
            }
            break;
        case 'StaStopped':
            if (value) {
                color = 'Grey';
            }
            break;
        case 'StaStopping':
            if (value) {
                color = 'Blue';
            }
            break;
        default:
            color = 'Black';
    }
    setBKColor($gcObject, color);
    setBKColor($path, color);
    setBKColor($selector, color);


}
function setSpeedMonitorColorByState(ident, state, value) {
    var color = '';
    var pathId = ident + '-path';
    var $gcObject = $('#' + ident);
    var $path = $('#' + pathId);
    switch (state) {
        case 'StaFaulted':
            $gcObject.attr(state, value);
            if (value) {
                color = 'red';
            }
            break;
        case 'StaHealty':
            //running
            if (value) {
                color = 'Green';
            }
            else {
                color = 'Grey';
            }
            break;
        default:
            color = 'Black';
    }
    setBKColor($gcObject, color);
    setBKColor($path, color);
}
function setValveOpenCloseColorByState(ident, state, value) {
    var color = '';
    var pathId = ident + '-path';
    var $gcObject = $('#' + ident);
    var $path = $('#' + pathId);
    switch (state) {
        case 'StaClosed':
            if (value) {
                color = 'Grey';
            }
            break;
        case 'StaClosing':
            //running
            if (value) {
                color = 'LightGreen';
            }
            break;
        case 'StaFault':
            if (value) {
                color = 'Red';
            }
            break;
        case 'StaOpened':
            if (value) {
                color = 'Green';
            }
            break;
        case 'StaOpening':
            if (value) {
                color = 'LightGreen';
            }
            break;
        default:
            color = 'Black';
    }
    setBKColor($gcObject, color);
    setBKColor($path, color);
}
function setSectionColorByState($gcObject, state, value) {
    var color = '';
    switch (state) {
        case 'StaFault':
            $gcObject.attr(state, value);
            if (value) {
                color = 'red';
            }
            break;
        case 'StaStarted':
            //running
            if (value) {
                color = 'Green';
            }
            break;
        case 'StaStarting':
            if (value) {
                color = 'LightGreen';
            }
            break;
        case 'StaStopped':
            if (value) {
                color = 'Grey';
            }
            break;
        case 'StaStopping':
            if (value) {
                color = 'Blue';
            }
            break;
        default:
            color = 'Black';
    }
    setBKColor($gcObject, color);
}

function setBKColor($node, color) {
    $node.children().attr('fill', color);
    $node.find('rect').attr('fill', color);
    $node.find('path').attr('fill', color);
    $node.attr('stroke', color);
}
function setPathBKColor($node, color) {
    $node.children().attr('fill', color);
    $node.find('rect').attr('fill', color);
    $node.attr('stroke', color);
}
function setJobBKColor(state) {
    var color;
    switch (state) {
        case 15:
            //Error
            color = 'Red';
            break;
        case 30:
            //Loading
            color = 'LightGreen';
            break;
        case 40:
            //Active
            color = 'Green';
            break;
        case 50:
            //Suspended
            color = 'Pink';
            break;
        case 80:
            //Suspended
            color = 'Silver';
            break;

    }
    $('#displayState').css({'background-color': color});
}

