function makeCode(qrcode) {
    var elText = document.getElementById("originUrl");

    if (!elText.value) {
        return;
    }
    getData(qrcode, elText.value);
}

function getData(qrcode, url) {
    qrcode.makeCode(url);
    var patt1 = new RegExp("https?://[^\s]*");
    var patt2 = new RegExp("https?://dll.im/[^\s]*");
    if (!patt1.test(url)) {
        document.getElementById("shortUrl").value = ""
        return
    }
    if(patt2.test(url)){
        return
    }
    var settings = {
        "url": "https://dll.im/url/generate",
        "type": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        "data": {
            "url": url
        }
    };

    $.ajax(settings).done(function (response) {
        if (response.success) {
            document.getElementById("shortUrl").value = response.data.shortUrl;

        } else if (response.msg) {
            document.getElementById("shortUrl").value = response.msg;
        }
    });
}

window.onload = function () {
    var copyurl = document.getElementById("copyurl");
    var showShortQrcode = document.getElementById("showShortQrcode");
    var qrcode = new QRCode(document.getElementById("qrcode"), {
        width: 256,
        height: 256
    });
    copyurl.addEventListener("click", function () {
        var shortUrl = document.getElementById("shortUrl");
        if (!shortUrl.value) {
            return
        }
        shortUrl.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        document.getElementById("notice").innerText = "复制成功！"
    });
    showShortQrcode.addEventListener("click", function () {
        var shortUrl = document.getElementById("shortUrl");
        if (!shortUrl.value) {
            return
        }
        getData(qrcode,shortUrl.value)
    });
    var originUrl = document.getElementById("originUrl");
    originUrl.addEventListener("keypress", function () {
        makeCode(qrcode);
    });
    originUrl.addEventListener("keyup", function () {
        makeCode(qrcode);
    });
    chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
        var url = tabs[0].url;
        getData(qrcode, url);
    });
}
