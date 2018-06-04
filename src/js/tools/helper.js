

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



function            getScope( ctrlName ){
    var sel = '[ng-controller="' + ctrlName + '"]';
    return angular.element(sel).scope();
}
/* call function 
scope.$apply(function () {
    scope.updateCustomRequest(data, type, res);
});
*/
