
// fa fa-home
function navAppend( id, displayName, iconName, onSelectFunction = function(){} ){
    
// functions
    var navigationHTML =  document.getElementById( "navigation" );
    
    var navEntry = document.createElement('li');
    navEntry.className = "nav-item";
    navEntry.innerHTML = "<a class=\"nav-link active\" href=\"#\">" + displayName + "</a>";
    navEntry.onclick = onSelectFunction;

    navigationHTML.appendChild( navEntry );
}


function navAppendPage( id, iconName, displayName ){

    var navigationHTML =  document.getElementById( "navigation" );
    
    var navEntry = document.createElement('li');
    navEntry.className = "nav-item";
    navEntry.innerHTML = "<span class=\"nav-link active\" >" + displayName + "</a>";
    navEntry.innerHTML = "\
    <a class=\"nav-link active\" style='font-size:25px;' href='#'> \
        <i class=\""+iconName+"\"></i> "+displayName+" \
    </a> \
    ";
    navEntry.onclick = function(){
        $( '#content' ).load( 'src/pages/' + id + '/index.html' );
    };

    navigationHTML.appendChild( navEntry );
}



