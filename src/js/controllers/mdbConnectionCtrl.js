angular
.module('app', ['ui.grid'] )
.controller('mdbConnectionCtl', mdbConnectionCtl);



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
    var connected = false;
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

    $scope.connect = function(){
    // get connection state
        ws.sendMsg( genUUID(), 'wsclient', myNodeName, 'mdb', 'connect', '' );
            
    }


// events
    $scope.onJsonMessage = function( event, jsonMessage ){
        
    // no message for us
        if( jsonMessage.g != "mdb" ) return;
        
    // connection state
        if( jsonMessage.c == "state" ){
            
            if( jsonMessage.v == "connected" ){
                logit( logitSuccess, _i['connected'] );
                return;
            }
            if( jsonMessage.v == "disconnected" ){
                logit( logitError, _i['disconnected'] );
                return;
            }
            
            return;
        }
        
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




// templates
    $scope.displayName = "Test";
    //$scope.htmlform = '<h1>{{displayName}}</h1>';
    
    $scope.content = {
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
    
    $scope.newcontent = {
        "id": "",
        "inputtype": "text",
        "displayName": "",
        "placeholder": "",
        "value": "",
    };
    
    $scope.editStyle = "display: none;";
    
    
    $scope.addInput = function( id, inputtype, displayName, placeholder ){
        
        var newEntry = {};
        newEntry.id = id;
        newEntry.inputtype = inputtype;
        newEntry.displayName = displayName;
        newEntry.placeholder = placeholder;
        newEntry.value = "";
        
        $scope.content[id] = newEntry;
    }

    $scope.newInput = function(){
        $scope.addInput( 
            $scope.newcontent.id,
            $scope.newcontent.inputtype,
            $scope.newcontent.displayName,
            $scope.newcontent.placeholder,
        );
    }

    $scope.removeInput = function( htmlElement ){
        var itemid = htmlElement.getAttribute( 'itemid' );
        delete $scope.content[ itemid ];
        $scope.$apply();
        $( '[mdbEditMode]' ).show(); // this ensure to show the remove-button because its initial hidden
    }


    var editMode = false;
    $scope.toggleEditMode = function(){

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
            
            console.log( $scope.newcontent );
            return;
        }
        
        
    }
    


}

    
