var infos;
var title_status = {
    'graph_company' : false,
    'graph_stock_summary' : false,
    'graph_charts' : false,
    'graph_latest_news' : false
};

var selected = '#D2D1D2';

function changeSVGColor(elem, color) {
    elem.getSVGDocument().querySelector("svg").style.color = color;
}

function addChangeColorEvent(id) {
    var elem = document.getElementById(id);
    elem.addEventListener('mouseenter', function (){
        console.log('mouseenter');
        changeSVGColor(elem, 'black');
    });
    elem.addEventListener('mouseout', function (){
        console.log('mouseout');
        changeSVGColor(elem, '#9a9a9a');
    });
}

function addSubmitSearchEvent(id) {
    var elem = document.getElementById(id).getSVGDocument().querySelector("svg");
    elem.addEventListener('click', function () {
        console.log('click');
        var form = stock_form;
        sendData(form);
    });
}

function addDeleteEvent(id) {
    var elem = document.getElementById(id).getSVGDocument().querySelector("svg");
    elem.addEventListener('click', function () {
        console.log('delete');
        stock.value = '';
    });
}

function setWarningBoxVisibility (status) {
    var elem = document.getElementById('empty_warning');
    elem.style.visibility = status;
}

function setGraphAreaVisibility(status) {
    var elem = document.getElementById('graph_area');
    elem.style.visibility = status;
}

function xhrResponseHandler(event) {
    console.log('get infos');
    var reponse_text = event.target.responseText;
    infos = JSON.parse(event.target.responseText);
    console.log(reponse_text);
    if (JSON.stringify(infos) === '{}') {
        console.log('hidden');
        setAllGraphHidden();
        setGraphAreaVisibility('hidden');
    }
    else {
        setTitleStatus('graph_company');
        refreshGraphCompany();
        setAllGraphHidden();
        setVisible('graph_company');
        setGraphAreaVisibility('visible');
    }
}

function sendData(form) {
    var XHR = new XMLHttpRequest();
    var FD  = new FormData(form);

    XHR.addEventListener("load", function (event) {
        xhrResponseHandler(event);
    });

    XHR.addEventListener("error", function(event) {
      alert('something went wrong');
    });

    var stock_value = FD.get('stock');
    if (stock_value.length > 0) {
        XHR.open("get", "/search?stock=" + stock_value, true);
        XHR.send()
    }
    else {
        setWarningBoxVisibility('visible');
        setTimeout("setWarningBoxVisibility('hidden')", 4000);
    }
  }

function takeOverFormSubmit() {
    var form = stock_form;
    console.log('takeOverFormSubmit');
    form.addEventListener("submit", function (event) {
        console.log('enter submit')
        event.preventDefault();
        sendData(form);
    });
}

function setVisible(id) {
    document.getElementById(id).style.visibility = 'visible';
}

function setHidden(id) {
    document.getElementById(id).style.visibility = 'hidden';
}

function setAllGraphHidden() {
    var titles = ['graph_company', 'graph_stock_summary', 'graph_charts', 'graph_latest_news'];
    for (var i = 0; i < titles.length; i++) {
        setHidden(titles[i]);
    }
}

function setTitleStatus(id) {
    for(let k in title_status) {
        if (k == id) {
            title_status[k] = true;
            document.getElementById('title_' + k).style.backgroundColor = selected;
        }
        else {
            title_status[k] = false;
            document.getElementById('title_' + k).style.removeProperty('background-color');
        }
    }
}

function refreshGraphCompany() {
    document.getElementById('graph_company_img').src = infos['logo'];
    document.getElementById('company_name').innerHTML = infos['name'];
    document.getElementById('stock_ticker_symbol').innerHTML = infos['ticker'];
    document.getElementById('stock_exchange_code').innerHTML = infos['exchange'];
    document.getElementById('company_start_date').innerHTML = infos['ipo'];
    document.getElementById('category').innerHTML = infos['finnhubIndustry'];
}

function graphHandler(id) {
    console.log('handle ' + id);
    setTitleStatus(id);
    if (id == 'graph_company') {
        refreshGraphCompany();
    }
    setAllGraphHidden();
    setVisible(id);
}

window.onload = function(){
    addChangeColorEvent('search_solid');
    takeOverFormSubmit();
    addSubmitSearchEvent('search_solid');
    addChangeColorEvent('search_times');
    addDeleteEvent('search_times');
}