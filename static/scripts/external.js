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

function setWarningBoxOpacity (opacity_value) {
    var elem = document.getElementById('empty_warning');
    elem.style.opacity = opacity_value;
}

function sendData(form) {
    var XHR = new XMLHttpRequest();
    var FD  = new FormData(form);

    // 我们定义了数据成功发送时会发生的事。
    XHR.addEventListener("load", function(event) {
      alert(event.target.responseText);
    });

    // 我们定义了失败的情形下会发生的事
    XHR.addEventListener("error", function(event) {
      alert('something went wrong');
    });

    var stock_value = FD.get('stock');
    if (stock_value.length > 0) {
        // 我们设置了我们的请求
        XHR.open("get", "/search?stock=" + stock_value, true);
        XHR.send()
    }
    else {
        setWarningBoxOpacity(1);
        setTimeout("setWarningBoxOpacity(0)", 4000);
    }
  }

function takeOverFormSubmit() {
    var form = stock_form;
    console.log('takeOverFormSubmit');
    form.addEventListener("submit", function (event) {
        console.log('submit')
        event.preventDefault();
        sendData(form);
    });
}

window.onload = function(){
    addChangeColorEvent('search_solid');
    takeOverFormSubmit();
    addSubmitSearchEvent('search_solid');
    addChangeColorEvent('search_times');
    addDeleteEvent('search_times');
}