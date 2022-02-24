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
        setErrorBarVisibility('hidden');
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

function setErrorBarVisibility(status) {
    var elem = document.getElementById('error_bar');
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
        setErrorBarVisibility('visible');
    }
    else {
        setErrorBarVisibility('hidden');
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
    document.getElementById('stock_ticker_symbol1').innerHTML = infos['ticker'];
    document.getElementById('stock_exchange_code').innerHTML = infos['exchange'];
    document.getElementById('company_start_date').innerHTML = infos['ipo'];
    document.getElementById('category').innerHTML = infos['finnhubIndustry'];
}

function refreshGraphStockSummary() {
    document.getElementById('stock_ticker_symbol2').innerHTML = infos['ticker'];
    document.getElementById('trading_day').innerHTML = infos['t'];
    document.getElementById('previous_closing_price').innerHTML = infos['pc'];
    document.getElementById('opening_price').innerHTML = infos['o'];
    document.getElementById('high_price').innerHTML = infos['h'];
    document.getElementById('low_price').innerHTML = infos['l'];
    document.getElementById('change').innerHTML = infos['d'];
    if (infos['d'] > 0) {
        document.getElementById('change_img').src = 'static/images/GreenArrowUp.png';
    }
    else {
        document.getElementById('change_img').src = 'static/images/RedArrowDown.png';
    }
    document.getElementById('change_percent').innerHTML = infos['dp'];
    if (infos['dp'] > 0) {
        document.getElementById('change_percent_img').src = 'static/images/GreenArrowUp.png';
    }
    else {
        document.getElementById('change_percent_img').src = 'static/images/RedArrowDown.png';
    }

    document.getElementById('recommendation_rate0').innerHTML = infos.strongSell;
    document.getElementById('recommendation_rate1').innerHTML = infos.sell;
    document.getElementById('recommendation_rate2').innerHTML = infos.hold;
    document.getElementById('recommendation_rate3').innerHTML = infos.buy;
    document.getElementById('recommendation_rate4').innerHTML = infos.strongBuy;
}

function graphHandler(id) {
    console.log('handle ' + id);
    setTitleStatus(id);
    if (id == 'graph_company') {
        refreshGraphCompany();
    }
    else if (id == 'graph_stock_summary') {
        refreshGraphStockSummary();
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