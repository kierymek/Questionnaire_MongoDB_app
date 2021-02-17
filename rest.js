var request;
var objJSON;
var id_mongo;
var _logged = false;
var session = {};
var ifConnected = window.navigator.onLine;

var indexedDB_req = indexedDB.open("questionaire_database");
var local_database;

indexedDB_req.onupgradeneeded = function () {
	local_database = indexedDB_req.result;
	var store = local_database.createObjectStore("questionnaires", { keyPath: "id", autoIncrement: true });
	store.createIndex("duda", "duda");
	store.createIndex("morawiecki", "morawiecki");
	store.createIndex("kaczyński", "kaczyński");
   store.createIndex("gliński", "gliński");
   store.createIndex("sasin", "sasin");
	store.createIndex("gowin", "gowin");
	store.createIndex("ziobro", "ziobro");
   store.createIndex("niedzielski", "niedzielski");
   store.createIndex("błaszczak", "błaszczak");
   store.createIndex("kamiński", "kamiński");
};

indexedDB_req.onsuccess = function () {
	local_database = indexedDB_req.result;
};

function getRequestObject()      {
   if ( window.ActiveXObject)  {
      return ( new ActiveXObject("Microsoft.XMLHTTP")) ;
   } else if (window.XMLHttpRequest)  {
      return (new XMLHttpRequest())  ;
   } else {
      return (null) ;
   }
}
 
// Lista rekordow w bazie
function _list() {
   document.getElementById('result').innerHTML = ''; 
   document.getElementById('data').innerHTML = ''; 
   if (_logged && ifConnected) {
      document.getElementById('result').innerHTML = ''; 
      document.getElementById('data').innerHTML = '';  
      request = getRequestObject() ;
      request.onreadystatechange = function() {
         if (request.readyState == 4)    {
            objJSON = JSON.parse(request.response);
            var txt = "<table class='table' style='margin-left: auto;margin-right: auto;width: 30%;'>";
            txt += "<thead><tr>";
            txt +=   "<th scope='col'>#</th>";
            txt +=   "<th scope='col'>id</th>";
            txt +=  "<th scope='col'>login</th>";
            txt +=  "<th scope='col'>password</th>";
            txt +=  "</tr></thead>";
            txt += "<tbody>";
            for ( var id in objJSON )  {
               txt += "<tr>";
               txt +=  "<td>" + id + "</td>";
               for ( var prop in objJSON[id] ) {             
                  if ( prop !== '_id')
                     {    
                        txt +=  "<td>" + objJSON[id][prop] + "</td>";
                     }
                  else
                     { 
                        txt +=  "<td>" + objJSON[id][prop]['$oid'] + "</td>";
                        } 
               }
               txt += "</tr>";
            }
            txt += "</tbody>";
            txt += "</table>";
            document.getElementById('result').innerHTML = txt;
         }
      }
      request.open("GET", "http://pascal.fis.agh.edu.pl/~8goral/projekt2/rest/list", true);
      request.send(null);
   } else {
      document.getElementById('data').innerHTML = "<h1 class='display-4 text-center' style='margin-left: auto;margin-right: auto;width: 40%;'>To reach this option you first need to be logged as a user!</h1>";; 
   }
   
}

// analiza danych
function _analyse_data() {
   document.getElementById('result').innerHTML = ''; 
   document.getElementById('data').innerHTML = ''; 
   if (_logged && ifConnected) {
      document.getElementById('result').innerHTML = ''; 
      document.getElementById('data').innerHTML = '';  
      request = getRequestObject() ;
      request.onreadystatechange = function() {
         if (request.readyState == 4)    {
            objJSON = JSON.parse(request.response);

            var txt = "<h1 style='text-align:center'>Wyniki przeprowadzonych ankiet</h1><table class='table' style='margin-left: auto;margin-right: auto;width: 40%;'>";
            txt += "<thead><tr>";
            txt +=   "<th scope='col'>#</th>";
            txt +=   "<th scope='col'>id</th>";
            txt +=  "<th scope='col'>duda</th>";
            txt +=  "<th scope='col'>morawiecki</th>";
            txt +=   "<th scope='col'>kaczyński</th>";
            txt +=   "<th scope='col'>gliński</th>";
            txt +=  "<th scope='col'>sasin</th>";
            txt +=  "<th scope='col'>gowin</th>";
            txt +=   "<th scope='col'>ziobo</th>";
            txt +=   "<th scope='col'>niedzielski</th>";
            txt +=  "<th scope='col'>błaszczak</th>";
            txt +=  "<th scope='col'>kamiński</th>";
            txt +=  "</tr></thead>";
            txt += "<tbody>";
            var labels = ["Andrzej Duda", "Mateusz Morawiecki", "Jarosław Kaczyński",
            "Piotr Gliński", "Jacek Sasin", "Jarosław Gowin","Zbigniew Ziobro", "Adam Niedzielski",
            "Mariusz Błaszczak", "Mariusz Kamiński"];
            var values = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for ( var id in objJSON )  {
               txt += "<tr>";
               txt +=  "<td>" + id + "</td>";
               var i = 0;
               for ( var prop in objJSON[id] ) {             
                  if ( prop !== '_id')
                     {    
                        txt +=  "<td>" + objJSON[id][prop] + "</td>";
                        values[i++] += Number(objJSON[id][prop]);
                     }
                  else
                     { 
                        txt +=  "<td>" + objJSON[id][prop]['$oid'] + "</td>";
                        } 
               }
               txt += "</tr>";
            }

            for(var i = 0; i < 10; i++) {
               values[i] /= objJSON.length;
            }

            var dps = [
               { label: labels[0], y: values[0] },
               { label: labels[1], y: values[1] },
               { label: labels[2], y: values[2] },
               { label: labels[3], y: values[3] },
               { label: labels[4], y: values[4] },
               { label: labels[5], y: values[5] },
               { label: labels[6], y: values[6] },
               { label: labels[7], y: values[7] },
               { label: labels[8], y: values[8] },
               { label: labels[9], y: values[9] }
            ]

            txt += "</tbody>";
            txt += "</table>";
            txt += "<br/><div id='chart' width='50%' height='50%' style='margin-left: auto;margin-right: auto;width: 50%;'></div>";
            document.getElementById('result').innerHTML = txt;
            draw_chart(dps);
         }
      }
      request.open("GET", "http://pascal.fis.agh.edu.pl/~8goral/projekt2/rest/getQuestionnaires", true);
      request.send(null);
   } else {
      document.getElementById('data').innerHTML = "<h1 class='display-4 text-center' style='margin-left: auto;margin-right: auto;width: 40%;'>To reach this option you first need to be logged as a user!</h1>";; 
   }
}
 

function draw_chart(dps) {
   var chart = new CanvasJS.Chart("chart",{
      title :{
         text: "Wykres poparcia"
      },
      axisX: {						
         title: "członkowie rządu RP"
      },
      axisY: {						
         title: "średnie poparcie w skali 1-10"
      },
      data: [{
         type: "column",
         dataPoints : dps
      }]
   });
    
   chart.render();
}

// Wstawianie rekordow do bazy
function _ins_form() {
   document.getElementById('result').innerHTML = ''; 
   document.getElementById('data').innerHTML = ''; 
   if (true) {
      var select = "<select class='form-select' name='' aria-label='Default select example'><option selected>Wybierz wartość</option><option value='1'>1</option><option value='2'>2</option><option value='3'>4</option><option value='4'>5</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option><option value='8'>8</option><option value='9'>9</option><option value='10'>10</option></select>";
      var form1 = "<h2>Ankieta badająca poziom zaufania do wybranych polityków w 2021r.</h2><br/>" 
               + "<form name='add' onsubmit='_insert(this)'><table class='table' style='margin-left: auto;margin-right: auto;width: 40%;'><thead><tr><th>członek rządu RP</th><th>poprarcie w skali 1-10</th></tr></thead>" ;
      form1    += "<tbody><tr><td><p>Andrzej Duda</p><p class='font-italic'>Prezeydent RP</p></td><td><select class='form-select' name='duda' aria-label='Default select example' required><option value='' disabled selected>Wybierz wartość</option><option value='1'>1</option><option value='2'>2</option><option value='3'>4</option><option value='4'>5</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option><option value='8'>8</option><option value='9'>9</option><option value='10'>10</option></select></td></tr>";
      form1    += "<tr><td><p>Mateusz Morawiecki</p><p class='font-italic'>Prezes Rady Ministrów, minister cyfryzacji</p></td><td><select class='form-select' name='morawiecki' aria-label='Default select example' required><option value='' disabled selected>Wybierz wartość</option><option value='1'>1</option><option value='2'>2</option><option value='3'>4</option><option value='4'>5</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option><option value='8'>8</option><option value='9'>9</option><option value='10'>10</option></select></td></tr>";
      form1    += "<tr><td>Jarosław Kaczyńsi</p><p class='font-italic'>Wiceprezes Rady Ministrów</p></td><td><select class='form-select' name='kaczyński' aria-label='Default select example' required><option value='' disabled selected>Wybierz wartość</option><option value='1'>1</option><option value='2'>2</option><option value='3'>4</option><option value='4'>5</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option><option value='8'>8</option><option value='9'>9</option><option value='10'>10</option></select></td></tr>";
      form1    += "<tr><td><p>Piotr Gliński</p><p class='font-italic'>Wiceprezes Rady Ministrów, minister kultury, dziedzictwa narodowego i sportu</p></td><td><select class='form-select' name='gliński' aria-label='Default select example' required><option value='' disabled selected>Wybierz wartość</option><option value='1'>1</option><option value='2'>2</option><option value='3'>4</option><option value='4'>5</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option><option value='8'>8</option><option value='9'>9</option><option value='10'>10</option></select></td></tr>";
      form1    += "<tr><td><p>Jacek Sasin</p><p class='font-italic'>Wiceprezes Rady Ministrów, minister aktywów państwowych</p></td><td><select class='form-select' name='sasin' aria-label='Default select example' required><option value='' disabled selected>Wybierz wartość</option><option value='1'>1</option><option value='2'>2</option><option value='3'>4</option><option value='4'>5</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option><option value='8'>8</option><option value='9'>9</option><option value='10'>10</option></select></td></tr>";
      form1    += "<tr><td><p>Jarosław Gowin</p><p class='font-italic'>Wiceprezes Rady Ministrów, minister rozwoju, pracy i technologii</p></td><td><select class='form-select' name='gowin' aria-label='Default select example' required><option value='' disabled selected>Wybierz wartość</option><option value='1'>1</option><option value='2'>2</option><option value='3'>4</option><option value='4'>5</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option><option value='8'>8</option><option value='9'>9</option><option value='10'>10</option></select></td></tr>";
      form1    += "<tr><td><p>Zbigniew Ziobro</p><p class='font-italic'>Minister sprawiedliwości</p></td><td><select class='form-select' name='ziobro' aria-label='Default select example' required><option value='' disabled selected>Wybierz wartość</option><option value='1'>1</option><option value='2'>2</option><option value='3'>4</option><option value='4'>5</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option><option value='8'>8</option><option value='9'>9</option><option value='10'>10</option></select></td></tr>";
      form1    += "<tr><td><p>Adam Niedzielski</p><p class='font-italic'>Minister zdrowia</p></td><td><select class='form-select' name='niedzielski' aria-label='Default select example' required><option value='' disabled selected>Wybierz wartość</option><option value='1'>1</option><option value='2'>2</option><option value='3'>4</option><option value='4'>5</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option><option value='8'>8</option><option value='9'>9</option><option value='10'>10</option></select></td></tr>";
      form1    += "<tr><td><p>Mariusz Błaszczak</p><p class='font-italic'>Minister oborny narodowej</p></td><td><select class='form-select' name='błaszczak' aria-label='Default select example' required><option value='' disabled selected>Wybierz wartość</option><option value='1'>1</option><option value='2'>2</option><option value='3'>4</option><option value='4'>5</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option><option value='8'>8</option><option value='9'>9</option><option value='10'>10</option></select></td></tr>";
      form1    += "<tr><td><p>Mariusz Kamiński</p><p class='font-italic'>Minister Spraw Wewnętrznych, Koordynator służb specjalnych</p></td><td><select class='form-select' name='kamiński' aria-label='Default select example' required><option value='' disabled selected>Wybierz wartość</option><option value='1'>1</option><option value='2'>2</option><option value='3'>4</option><option value='4'>5</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option><option value='8'>8</option><option value='9'>9</option><option value='10'>10</option></select></td></tr>";

      form1    += "<tr><td></td><td><input class='btn btn-primary' type='submit' value='Wyślij ankietę'></input></td></tr>";
      form1    += "</tbody></table></form>";
      document.getElementById('data').innerHTML = form1;
      document.getElementById('result').innerHTML = '';
   } 
}
 
function _insert(form)  {
    var questionaire = {};
    questionaire.duda = form.duda.value;
    questionaire.morawiecki = form.morawiecki.value;
    questionaire.kaczyński = form.kaczyński.value;
    questionaire.gliński = form.gliński.value;
    questionaire.sasin = form.sasin.value;
    questionaire.gowin = form.gowin.value;
    questionaire.ziobro = form.ziobro.value;
    questionaire.niedzielski = form.niedzielski.value;
    questionaire.błaszczak = form.błaszczak.value;
    questionaire.kamiński = form.kamiński.value;
    txt = JSON.stringify(questionaire);
    document.getElementById('result').innerHTML = ''; 
    document.getElementById('data').innerHTML = '';  
    request = getRequestObject() ;
    request.onreadystatechange = function() {
       if (request.readyState == 4 && request.status == 200 )    {
          document.getElementById('result').innerHTML = "<h1 class='display-4' style='margin-left: auto;margin-right: auto;width: 30%;'>" + JSON.parse(request.response)["status"] + "</h1>";
       }
    }
    request.open("POST", "http://pascal.fis.agh.edu.pl/~8goral/projekt2/rest/save", true);
    request.send(txt);
}

function _ins_offline_form() {
   document.getElementById('result').innerHTML = ''; 
   document.getElementById('data').innerHTML = ''; 
   if (true) {
      var form1 = "<h1 class='display-4'>TRYB OFFLINE</h1><br/><h2>Ankieta badająca poziom zaufania do wybranych polityków w 2021r.</h2><br/>" 
      + "<form name='add' onsubmit='_insert_offline(this)'><table class='table' style='margin-left: auto;margin-right: auto;width: 40%;'><thead><tr><th>członek rządu RP</th><th>poprarcie w skali 1-10</th></tr></thead>" ;
      form1    += "<tbody><tr><td><p>Andrzej Duda</p><p class='font-italic'>Prezeydent RP</p></td><td><select class='form-select' name='duda' aria-label='Default select example' required><option value='' disabled selected>Wybierz wartość</option><option value='1'>1</option><option value='2'>2</option><option value='3'>4</option><option value='4'>5</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option><option value='8'>8</option><option value='9'>9</option><option value='10'>10</option></select></td></tr>";
      form1    += "<tr><td><p>Mateusz Morawiecki</p><p class='font-italic'>Prezes Rady Ministrów, minister cyfryzacji</p></td><td><select class='form-select' name='morawiecki' aria-label='Default select example' required><option value='' disabled selected>Wybierz wartość</option><option value='1'>1</option><option value='2'>2</option><option value='3'>4</option><option value='4'>5</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option><option value='8'>8</option><option value='9'>9</option><option value='10'>10</option></select></td></tr>";
      form1    += "<tr><td>Jarosław Kaczyńsi</p><p class='font-italic'>Wiceprezes Rady Ministrów</p></td><td><select class='form-select' name='kaczyński' aria-label='Default select example' required><option value='' disabled selected>Wybierz wartość</option><option value='1'>1</option><option value='2'>2</option><option value='3'>4</option><option value='4'>5</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option><option value='8'>8</option><option value='9'>9</option><option value='10'>10</option></select></td></tr>";
      form1    += "<tr><td><p>Piotr Gliński</p><p class='font-italic'>Wiceprezes Rady Ministrów, minister kultury, dziedzictwa narodowego i sportu</p></td><td><select class='form-select' name='gliński' aria-label='Default select example' required><option value='' disabled selected>Wybierz wartość</option><option value='1'>1</option><option value='2'>2</option><option value='3'>4</option><option value='4'>5</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option><option value='8'>8</option><option value='9'>9</option><option value='10'>10</option></select></td></tr>";
      form1    += "<tr><td><p>Jacek Sasin</p><p class='font-italic'>Wiceprezes Rady Ministrów, minister aktywów państwowych</p></td><td><select class='form-select' name='sasin' aria-label='Default select example' required><option value='' disabled selected>Wybierz wartość</option><option value='1'>1</option><option value='2'>2</option><option value='3'>4</option><option value='4'>5</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option><option value='8'>8</option><option value='9'>9</option><option value='10'>10</option></select></td></tr>";
      form1    += "<tr><td><p>Jarosław Gowin</p><p class='font-italic'>Wiceprezes Rady Ministrów, minister rozwoju, pracy i technologii</p></td><td><select class='form-select' name='gowin' aria-label='Default select example' required><option value='' disabled selected>Wybierz wartość</option><option value='1'>1</option><option value='2'>2</option><option value='3'>4</option><option value='4'>5</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option><option value='8'>8</option><option value='9'>9</option><option value='10'>10</option></select></td></tr>";
      form1    += "<tr><td><p>Zbigniew Ziobro</p><p class='font-italic'>Minister sprawiedliwości</p></td><td><select class='form-select' name='ziobro' aria-label='Default select example' required><option value='' disabled selected>Wybierz wartość</option><option value='1'>1</option><option value='2'>2</option><option value='3'>4</option><option value='4'>5</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option><option value='8'>8</option><option value='9'>9</option><option value='10'>10</option></select></td></tr>";
      form1    += "<tr><td><p>Adam Niedzielski</p><p class='font-italic'>Minister zdrowia</p></td><td><select class='form-select' name='niedzielski' aria-label='Default select example' required><option value='' disabled selected>Wybierz wartość</option><option value='1'>1</option><option value='2'>2</option><option value='3'>4</option><option value='4'>5</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option><option value='8'>8</option><option value='9'>9</option><option value='10'>10</option></select></td></tr>";
      form1    += "<tr><td><p>Mariusz Błaszczak</p><p class='font-italic'>Minister oborny narodowej</p></td><td><select class='form-select' name='błaszczak' aria-label='Default select example' required><option value='' disabled selected>Wybierz wartość</option><option value='1'>1</option><option value='2'>2</option><option value='3'>4</option><option value='4'>5</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option><option value='8'>8</option><option value='9'>9</option><option value='10'>10</option></select></td></tr>";
      form1    += "<tr><td><p>Mariusz Kamiński</p><p class='font-italic'>Minister Spraw Wewnętrznych, Koordynator służb specjalnych</p></td><td><select class='form-select' name='kamiński' aria-label='Default select example' required><option value='' disabled selected>Wybierz wartość</option><option value='1'>1</option><option value='2'>2</option><option value='3'>4</option><option value='4'>5</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option><option value='8'>8</option><option value='9'>9</option><option value='10'>10</option></select></td></tr>";

      form1    += "<tr><td></td><td><input class='btn btn-primary' type='submit' value='Wyślij ankietę offline'></input></td></tr>";
      form1    += "</tbody></table></form>";
      document.getElementById('data').innerHTML = form1;
      document.getElementById('result').innerHTML = ''; 
   } else {
      document.getElementById('data').innerHTML = "<h1 class='display-4 text-center' style='margin-left: auto;margin-right: auto;width: 40%;'>To reach this option you first need to be logged as a user!</h1>";; 
   }
}

function _insert_offline(form)  {
   var questionaire = {};
   questionaire.duda = form.duda.value;
   questionaire.morawiecki = form.morawiecki.value;
   questionaire.kaczyński = form.kaczyński.value;
   questionaire.gliński = form.gliński.value;
   questionaire.sasin = form.sasin.value;
   questionaire.gowin = form.gowin.value;
   questionaire.ziobro = form.ziobro.value;
   questionaire.niedzielski = form.niedzielski.value;
   questionaire.błaszczak = form.błaszczak.value;
   questionaire.kamiński = form.kamiński.value;
   document.getElementById('result').innerHTML = ''; 
   document.getElementById('data').innerHTML = '';  
   var db_tr = local_database.transaction("questionnaires", "readwrite");
		var obj = db_tr.objectStore("questionnaires");

		if(obj.put(questionaire)){
         document.getElementById('data').innerHTML = "<div class='text-center display-4' style='margin-left: auto;margin-right: auto;width: 40%;'>Questionnaire added offline successfully!</div>"; 
         list_offline();
		}
}

function list_offline() {
   var txt = "<table class='table' style='margin-left: auto;margin-right: auto;width: 30%;'>";
   txt += "<thead><tr>";
   txt +=   "<th scope='col'>#</th>";
   txt +=   "<th scope='col'>id</th>";
   txt +=  "<th scope='col'>login</th>";
   txt +=  "<th scope='col'>password</th>";
   txt +=  "</tr></thead>";
   txt += "<tbody>";
   var counter = 0;
   var db_tx = local_database.transaction("questionnaires", "readwrite");
   var obj = db_tx.objectStore("questionnaires");
   obj.openCursor().onsuccess = function (event) {
      var cursor = event.target.result;
      txt += "<tr>";
      txt +=  "<td>" + (counter++) + "</td>";
      if (cursor) {
         txt +=  "<td>" + cursor.value.duda; + "</td>";
         txt +=  "<td>" + cursor.value.morawiecki; + "</td>";
         txt +=  "<td>" + cursor.value.kaczyński; + "</td>";
         txt +=  "<td>" + cursor.value.gliński; + "</td>";
         txt +=  "<td>" + cursor.value.sasin; + "</td>";
         txt +=  "<td>" + cursor.value.gowin; + "</td>";
         txt +=  "<td>" + cursor.value.ziobro; + "</td>";
         txt +=  "<td>" + cursor.value.niedzielski; + "</td>";
         txt +=  "<td>" + cursor.value.błaszczak; + "</td>";
         txt +=  "<td>" + cursor.value.kamiński; + "</td>";

         var questionaire = {};
         questionaire.duda = cursor.value.duda;
         questionaire.morawiecki = cursor.value.morawiecki;
         questionaire.kaczyński = cursor.value.kaczyński;
         questionaire.gliński = cursor.value.gliński;
         questionaire.sasin = cursor.value.sasin;
         questionaire.gowin = cursor.value.gowin;
         questionaire.ziobro = cursor.value.ziobro;
         questionaire.niedzielski = cursor.value.niedzielski;
         questionaire.błaszczak = cursor.value.błaszczak;
         questionaire.kamiński = cursor.value.kamiński;
         cursor.continue();
      }
      txt += "</tr>";
   }
   txt += "</tbody>";
   txt += "</table>";
   document.getElementById('result').innerHTML = txt;
}

function _synchronize_data() {
   document.getElementById('result').innerHTML = ''; 
   document.getElementById('data').innerHTML = ''; 
   if (_logged && ifConnected) {
      var counter = 0;
      var db_tx = local_database.transaction("questionnaires", "readwrite");
      var obj = db_tx.objectStore("questionnaires");
      obj.openCursor().onsuccess = function (event) {
		var cursor = event.target.result;
		if (cursor) {
			var questionaire = {};
         questionaire.duda = cursor.value.duda;
         questionaire.morawiecki = cursor.value.morawiecki;
         questionaire.kaczyński = cursor.value.kaczyński;
         questionaire.gliński = cursor.value.gliński;
         questionaire.sasin = cursor.value.sasin;
         questionaire.gowin = cursor.value.gowin;
         questionaire.ziobro = cursor.value.ziobro;
         questionaire.niedzielski = cursor.value.niedzielski;
         questionaire.błaszczak = cursor.value.błaszczak;
         questionaire.kamiński = cursor.value.kamiński;
         txt = JSON.stringify(questionaire); 
         request = getRequestObject() ;
         request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200 )    {
               document.getElementById('result').innerHTML = "<h1 class='display-4 text-center' style='margin-left: auto;margin-right: auto;width: 40%;'>" + counter + " of local records synchronized in MongoDB!" + "</h1>";
            }
         }
         request.open("POST", "http://pascal.fis.agh.edu.pl/~8goral/projekt2/rest/save", true);
         request.send(txt);
         counter++;
			cursor.delete();
			cursor.continue();
		}
		else if (counter == 0) {
         document.getElementById('result').innerHTML = "<h1 class='display-4 text-center' style='margin-left: auto;margin-right: auto;width: 30%;'>No records to synchronize!</h1>";
		}
	};
   } else {
      document.getElementById('data').innerHTML = "<h1 class='display-4 text-center' style='margin-left: auto;margin-right: auto;width: 40%;'>To reach this option you first need to be logged as a user and internet connection!</h1>";
   }
}

function _register_form() {
   if(ifConnected){
      var form1 =  "<form action='' onsubmit='_register(this)' style='margin-left: auto;margin-right: auto;width: 30%;'>";
      form1    +=  "<h1>Rejestracja nowego użytkownika</h1>";
      form1    +=  "<div class='form-group text-left'>";
      form1    +=  "<label htmlFor='login'>Login</label>";
      form1    +=  "<input name='login' class='form-control'required/>";
      form1    +=  "</div>";
      form1    +=  "<div class='form-group text-left'>";
      form1    +=  "<label class'text-left' htmlFor='password'>Hasło</label>";
      form1    +=  "<input type='password' name='password' class='form-control' required/>";
      form1    +=  "</div>";
      form1    +=  "<div><button type='submit' class='btn btn-primary'>zarejestruj się</button></div>";
      form1    +=  "</form>";
      document.getElementById('data').innerHTML = form1;
      document.getElementById('result').innerHTML = ''; 
   } else {
      document.getElementById('data').innerHTML = "<h1 class='display-4 text-center' style='margin-left: auto;margin-right: auto;width: 40%;'>To reach this option you need internet connection!</h1>"; 
   }
}

function _register(form)  {
   var user = {};
   user.login = form.login.value;
   user.password = form.password.value;
   txt = JSON.stringify(user);
   document.getElementById('result').innerHTML = ''; 
   document.getElementById('data').innerHTML = '';  
   request = getRequestObject() ;
   request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200 )    {
         document.getElementById('result').innerHTML = "<div class='text-center display-4'>" + JSON.parse(request.response)["registration status"] + '</div>';
      }
   }
   request.open("POST", "http://pascal.fis.agh.edu.pl/~8goral/projekt2/rest/saveUser", true);
   request.send(txt);
}


function _login_form() {
   if (ifConnected) {
      var form1 =  "<form action='' onsubmit='_login(this)' style='margin-left: auto;margin-right: auto;width: 30%;'>";
      form1    +=  "<h1>Panel logowania</h1>";
      form1    +=  "<div class='form-group text-left'>";
      form1    +=  "<label htmlFor='login'>Login</label>";
      form1    +=  "<input name='login' class='form-control' required/>";
      form1    +=  "</div>";
      form1    +=  "<div class='form-group text-left'>";
      form1    +=  "<label class'text-left' htmlFor='password'>Hasło</label>";
      form1    +=  "<input type='password' name='password' class='form-control' required/>";
      form1    +=  "</div>";
      form1    +=  "<div><button type='submit' class='btn btn-primary'>zaloguj się</button></div>";
      form1    +=  "</form>";
      document.getElementById('data').innerHTML = form1;
      document.getElementById('result').innerHTML = ''; 
   } else {
      document.getElementById('data').innerHTML = "<h1 class='display-4 text-center' style='margin-left: auto;margin-right: auto;width: 40%;'>To reach this option you need internet connection!</h1>"; 
   }
}

function _login(form)  {
   var user = {};
   user.login = form.login.value;
   user.password = form.password.value;
   txt = JSON.stringify(user);
   document.getElementById('result').innerHTML = ''; 
   document.getElementById('data').innerHTML = '';  
   request = getRequestObject() ;
   request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200 )    {
         document.getElementById('result').innerHTML = request.response;
         // var tmp = JSON.parse(request.response);
         if (JSON.parse(request.response)["status"] === "logged") {
            session.login = JSON.parse(request.response)["login"];
            session.password = JSON.parse(request.response)["password"];
            session.status = JSON.parse(request.response)["status"];
            _logged = true;
            document.getElementById('result').innerHTML = "<div class='text-center display-4'>" +
            "<br/><p class='display-3'>Zalogowano Pomyślnie!</p><br/><p>DANE UŻYTKOWNIKA</p><p>login: " +  
            session["login"] + "</p><p>hasło: " + session["password"] + "</p></div>";
         } else {
            _logged = false;
            document.getElementById('result').innerHTML = "<div class='text-center display-4'>Proces logowania nieudany!</div>";
         }
      }
   }
   request.open("POST", "http://pascal.fis.agh.edu.pl/~8goral/projekt2/rest/logUser", true);
   request.send(txt);
}

function _session() {
   if (_logged && ifConnected) {
         document.getElementById('data').innerHTML = '';  
         document.getElementById('result').innerHTML = "<div class='text-center display-4'>" +
            "<p>user data</p><p>login: " +  
            session["login"] + "</p><p>password: " + session["password"] 
            + "</p><p>status: " + session["status"] + "</p></div>";
         } else {
            document.getElementById('data').innerHTML = '';  
            document.getElementById('result').innerHTML = "<div class='text-center display-4'>None of users logged in!</div>";
         }
}
 
// Usuwanie rekordow z bazy danych
function _del_list() {
   document.getElementById('result').innerHTML = ''; 
   document.getElementById('data').innerHTML = ''; 
   if (_logged && ifConnected) {
      document.getElementById('result').innerHTML = ''; 
      document.getElementById('data').innerHTML = '';  
      request = getRequestObject() ;
      request.onreadystatechange = function() {
       if (request.readyState == 4) { 
          objJSON = JSON.parse(request.response);
          var txt = "<form name='data'><select name='del' class='form-select' multiple aria-label='multiple select example' style='margin-left: auto;margin-right: auto;width: 40%;'>";
          //   txt += '<option selected>Open this select menu</option>';
          for ( var id in objJSON )  {
             txt +=  "<option value="+id+" >"+id+".   " ;
             for ( var prop in objJSON[id] ) {             
                if ( prop !== '_id')
                   { txt += prop+": "+objJSON[id][prop]+", ";  }
                else
                   { txt += "oid: " + objJSON[id][prop]['$oid']+", " ;  }
             }    
             txt +="</option>";
          }
          txt += "</select><br/><input type='button' class='btn btn-primary' value='usuń użytkownika' onclick='_delete(this.form)'/></form>";
          document.getElementById('data').innerHTML = txt;
       }
    }
    request.open("GET", "http://pascal.fis.agh.edu.pl/~8goral/projekt2/rest/list", true);
    request.send(null);
   } else {
      document.getElementById('data').innerHTML = "<h1 class='display-4 text-center' style='margin-left: auto;margin-right: auto;width: 40%;'>To reach this option you first need to be logged as a user!</h1>";; 
   }
}
 
function _delete(form) {
    var rec = form.del.selectedIndex;
    var id = document.getElementsByTagName('option')[rec].value;
    var id_mongo = objJSON[id]['_id']['$oid'];
    document.getElementById('result').innerHTML = ''; 
    document.getElementById('data').innerHTML = '';  
    request = getRequestObject() ;
    request.onreadystatechange = function() {
      if (request.readyState == 4 )    {
         document.getElementById('result').innerHTML = "<div class='text-center display-4'>" + JSON.parse(request.response)["status"] + '</div>';
      }
    }
    request.open("DELETE", "http://pascal.fis.agh.edu.pl/~8goral/projekt2/rest/delete1/"+id_mongo, true);
    request.send(null);
}
 
// Poprawa rekordow w bazie danych
function _upd_list() {
   if (_logged && ifConnected) {
         document.getElementById('result').innerHTML = ''; 
         document.getElementById('data').innerHTML = '';  
         request = getRequestObject() ;
         request.onreadystatechange = function() {
            if (request.readyState == 4)    { 
            objJSON = JSON.parse(request.response);
            var txt = "<form name='data'><select name='del' class='form-select' multiple aria-label='multiple select example' style='margin-left: auto;margin-right: auto;width: 40%;'>";
            //   txt += '<option selected>Open this select menu</option>';
            for ( var id in objJSON )  {
               txt +=  "<option value="+id+" >"+id+".   " ;
               for ( var prop in objJSON[id] ) {             
                  if ( prop !== '_id')
                     { txt += prop+": "+objJSON[id][prop]+", ";  }
                  else
                     { txt += "oid: " + objJSON[id][prop]['$oid']+", " ;  }
               }    
               txt +="</option>";
            }
            txt += "</select><br/><input type='button' class='btn btn-primary' value='popraw' onclick='_upd_form(this.form)'/></form>";
            document.getElementById('data').innerHTML = txt;
            }
         }
         request.open("GET", "http://pascal.fis.agh.edu.pl/~8goral/projekt2/rest/list", true);
         request.send(null);
      }
  }
 
 
 
 
function _upd_form(form) {
    var rec = form.del.selectedIndex;
    id_rec = document.getElementsByTagName('option')[rec].value;
    id_mongo = objJSON[id_rec]['_id']['$oid'];
    console.log(id_mongo);
    document.getElementById('result').innerHTML = ''; 
    document.getElementById('data').innerHTML = ''; 
    var form1 =  "<form action='' onsubmit='_update(this)' style='margin-left: auto;margin-right: auto;width: 30%;'>";
    form1    +=  "<div class='form-group text-left'>";
    form1    +=  "<label htmlFor='login'>Login</label>";
    form1    +=  "<input name='login' class='form-control' required/>";
    form1    +=  "</div>";
    form1    +=  "<div class='form-group text-left'>";
    form1    +=  "<label class'text-left' htmlFor='password'>Hasło</label>";
    form1    +=  "<input type='password' name='password' class='form-control' required/>";
    form1    +=  "</div>";
    form1    +=  "<div><button type='submit' class='btn btn-primary'>zapisz zmiany</button></div>";
    form1    +=  "</form>";
  document.getElementById('data').innerHTML = form1;
  document.getElementById('result').innerHTML = ''; 
}
 
function _update(form) {
   var user = {};
   user.login = form.login.value;
   user.password = form.password.value;
   txt = JSON.stringify(user);
    document.getElementById('result').innerHTML = ''; 
    document.getElementById('data').innerHTML = '';  
    request = getRequestObject() ;
    request.onreadystatechange = function() {
         if (request.readyState == 4 && request.status == 200 )    {
            document.getElementById('result').innerHTML = "<div class='text-center display-4'>" + JSON.parse(request.response)["status"] + '</div>';
         }
    }
    request.open("PUT", "http://pascal.fis.agh.edu.pl/~8goral/projekt2/rest/update1/"+id_mongo, true);
    request.send(txt);
}