angular
.module('app', ['ui.grid'] )
.controller('mdbConnectionCtl', mdbConnectionCtl)
.controller('mdbTemplateCtrl', mdbTemplateCtrl);



function    formText( id, title, placeholder ){

    var htmlString = ' \
    <div class="form-group"> \
        <label for="form' + id + '">' + title + '</label> \
        <input id="form' + id + '" type="text" class="form-control" placeholder="' + placeholder + '" ></input> \
    </div> \
    ';

//         <input id="form' + id + '" type="text" class="form-control" placeholder="' + placeholder + '" value="{{' + ngvalue + '}}" data-ng-model="' + ngvalue + '"></input> 
    return htmlString;
}



mdbConnectionCtl.$inject = ['$scope', '$sce' ];
function mdbConnectionCtl($scope,$sce) {

// language string
    $scope._i = function( message ){
        if( _i[message] !== undefined ){
            return _i[message];
        } else {
            console.log( "Need translation: '" + message + "'" );
            return message;
        }
    }

// vars
    $scope.conButtonDisplayName = _i['connect'];
    $scope.conButtonStyle = "btn btn-sm btn-primary";

// show connection state
    $scope.showConnectionState = function(){
        if( connected == false ){
            $scope.conButtonDisplayName = _i['connect'];
            $scope.conButtonStyle = "btn btn-sm btn-primary";
        } else {
            $scope.conButtonDisplayName = _i['disconnect'];
            $scope.conButtonStyle = "btn btn-sm btn-outline-danger";
        }
    
    }



// ##################### connect / disconnect #####################
    var connected = false;
    
    $scope.connect = function(){
    // get connection state
        if( connected == false ){
            ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'mdb', 'connect', '' );
        }
        if( connected == true ){
            ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'mdb', 'disconnect', '' );
        }

    }
    
    function parseConnectionMessage( jsonMessage ){
        
        if( jsonMessage.c == "state" ){
            
            if( jsonMessage.v == "connected" ){
                connected = true;
                logit( logitSuccess, "MongoDB " + _i['connected'] );
                
                
                ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'mdb', 'templatesGet', '' );
                return;
            }
            if( jsonMessage.v == "disconnected" ){
                connected = false;
                logit( logitError, "MongoDB " + _i['disconnected'] );
                return;
            }
        
        }

    }


// events
    $scope.onJsonMessage = function( event, jsonMessage ){
        
    // no message for us
        if( jsonMessage.g != "mdb" ) return;
        
    // connection state
        parseConnectionMessage( jsonMessage );
            

        
    // error message
        if( jsonMessage.c == "error" ){
            logit( logitError, jsonMessage.v );
            return;
        }


    }

// register websocket events
    ws.on( 'onJsonMessage', $scope.onJsonMessage );
    
// derigister on destroy of controller
    $scope.$on("$destroy", function(){
        ws.off( 'onJsonMessage', $scope.onJsonMessage );
    });

// request connection state
    ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'mdb', 'isConnected', '' );


}

    
mdbTemplateCtrl.$inject = ['$scope'];
function mdbTemplateCtrl($scope) {

// language string
    $scope._i = function( message ){
        if( _i[message] !== undefined ){
            return _i[message];
        } else {
            console.log( "Need translation: '" + message + "'" );
            return message;
        }
    }


    $scope.id = "test";
    $scope.displayName = "Test-Template";

    $scope.formEntrys = {
        "a": {
            "id": "a",
            "inputtype": "text",
            "displayName": "Test-Titel",
            "placeholder": "Test-Placeholder",
            "value": "",
        },
        "b": {
            "id": "b",
            "inputtype": "text",
            "displayName": "Test-Titel",
            "placeholder": "Test-Placeholder",
            "value": "",
        },
    
    };
    $scope.newformEntry = {
        "id": "",
        "inputtype": "text",
        "displayName": "",
        "placeholder": "",
        "value": "",
    };


    
    $scope.addFormElement = function( id, inputtype, displayName, placeholder ){
        
    // check if id is empty
        if( id == "" ){
            logit( logitError, "ID " + _i[' is empty'] );
            return;
        }
        
        var newEntry = {};
        newEntry.id = id;
        newEntry.inputtype = inputtype;
        newEntry.displayName = displayName;
        newEntry.placeholder = placeholder;
        newEntry.value = "";
        
        $scope.formEntrys[id] = newEntry;
    }

    $scope.addNewFormElement = function(){
        $scope.addFormElement( 
            $scope.newformEntry.id,
            $scope.newformEntry.inputtype,
            $scope.newformEntry.displayName,
            $scope.newformEntry.placeholder,
        );
    }

    $scope.removeInput = function( htmlElement ){
        var itemid = htmlElement.getAttribute( 'itemid' );
        delete $scope.formEntrys[ itemid ];
        $scope.$apply();
        $( '[mdbEditMode]' ).show(); // this ensure to show the remove-button because its initial hidden
    }

    $scope.saveTemplate = function(){
        
        var jsonTemplate = {};
        jsonTemplate._type = "template";
        jsonTemplate.id = $scope.id;
        jsonTemplate.displayName = $scope.displayName;
        jsonTemplate.formElements = $scope.formEntrys;
        
        ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'mdb', 'templateSave', JSON.stringify(jsonTemplate) );
    }



    var editMode = false;
    $scope.editModeToggle = function(){

        if( editMode == false ){
            $( '[mdbEditMode]' ).show();
            $scope.editStyle = "";
            editMode = true;
            return;
        }

        if( editMode == true ){
            $( '[mdbEditMode]' ).hide();
            $scope.editStyle = "display: none;";
            editMode = false;
            
            console.log( $scope.newformEntry );
            return;
        }
        
        
    }
    
    
// events
    $scope.onJsonMessage = function( event, jsonMessage ){
        
    // no message for us
        if( jsonMessage.g != "mdb" ) return;
        



    }

// register websocket events
    ws.on( 'onJsonMessage', $scope.onJsonMessage );
    
// derigister on destroy of controller
    $scope.$on("$destroy", function(){
        ws.off( 'onJsonMessage', $scope.onJsonMessage );
    });


    
}


