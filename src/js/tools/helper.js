

/**
@brief Load java-script file and init
*/
function            loadJsFile( fileName, finishLoadingFunction = null ){

// already exists ?
    var script =  document.getElementById( "js_" + fileName );
    if( script !== null ){
        console.log( "Script \"js_" + fileName + "\" already loaded" );
    // already loaded
        if( finishLoadingFunction !== null ){
            finishLoadingFunction();
        }
        return;
    }

    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.id = "js_" + fileName;
    script.type = 'text/javascript';
    script.src = fileName;
    


// use function
    if( finishLoadingFunction !== null ){
// Then bind the event to the callback function.
// There are several events for cross browser compatibility.
        script.onreadystatechange = finishLoadingFunction;
        script.onload = finishLoadingFunction;
    }


// Fire the loading
    head.appendChild(script);

}


function            loadHtmlFile( id, fileName, finishLoadingFunction = null ){
// container

// check if container already exist
    htmlContainer = document.getElementById( id );
    if( htmlContainer === null || htmlContainer === undefined ){
        htmlContainer = document.createElement('div');
        htmlContainer.id = id;
    //    htmlContainer.innerHTML='<object type="text/html" data="' + fileName + '" ></object>';
        document.body.appendChild( htmlContainer );
    }

    
    //htmlContainer.innerHTML='<object type="text/html" data="' + fileName + '" ></object>';
//    htmlContainer.innerHTML = loadPage(fileName);

    if( finishLoadingFunction !== null ){
        $( "#" + id ).load( fileName, finishLoadingFunction );
    } else {
        $( "#" + id ).load( fileName );
    }



}


function            genUUID(){

    var u='',i=0;
    while(i++<36){
        var c='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxxx'[i-1],r=Math.random()*16|0,v=c=='x'?r:(r&0x3|0x8);
        u+=(c=='-'||c=='4')?c:v.toString(16);
    }
    return u;
}


function            updateTabs( e, callback = function( source, target ){} ){

    var newElementID = e.target.getAttribute('showid');
    var newElementHTML = document.getElementById(newElementID);

    var oldElementID = e.relatedTarget.getAttribute('showid');
    var oldElementHTML = document.getElementById(oldElementID);


// hide the old one
    if( oldElementHTML !== null && newElementHTML !== null ){
        oldElementHTML.style.display = 'none';
        newElementHTML.style.display = 'block';
    }
    
// run callback
    callback( e.relatedTarget, e.target );

}


function            getScope( ctrlName ){
    var sel = '[ng-controller="' + ctrlName + '"]';
    return angular.element(sel).scope();
}


function            scopeCallAndApply( ctrlName, callback = function( data, type, res ){} ){
    var controller = '[ng-controller="' + ctrlName + '"]';
    var scope = angular.element(sel).scope();
    if( scope === null ) return;
    scope.$apply( callback );
}

/* call function 
scope.$apply(function () {
    scope.updateCustomRequest(data, type, res);
});
*/

const logitError = 0;
const logitWarning = 1;
const logitSuccess = 2;
const logitInfo = 3;

toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-top-center",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

function            logit( level, message ){

    if( level == logitError ){
        toastr["error"]( message );
    }
    if( level == logitWarning ){
        toastr["warning"]( message );
    }
    if( level == logitSuccess ){
        toastr["success"]( message );
    }
    if( level == logitInfo ){
        toastr["info"]( message );
    }
    


}

