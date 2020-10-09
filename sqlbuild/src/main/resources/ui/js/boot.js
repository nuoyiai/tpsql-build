__CreateJSPath = function (js) {
    var scripts = document.getElementsByTagName("script");
    var path = "";
    for (var i = 0, l = scripts.length; i < l; i++) {
        var src = scripts[i].src;
        if (src.indexOf(js) != -1) {
            var ss = src.split(js);
            path = ss[0];
            break;
        }
    }
    var href = location.href;
    href = href.split("#")[0];
    href = href.split("?")[0];
    var ss = href.split("/");
    ss.length = ss.length - 1;
    href = ss.join("/");
    if (path.indexOf("https:") == -1 && path.indexOf("http:") == -1 && path.indexOf("file:") == -1 && path.indexOf("\/") != 0) {
        path = href + "/" + path;
    }
    return path;
}

var rootPATH = __CreateJSPath("boot.js");

document.write("<script src='" + rootPATH + "third/jQuery/jquery-1.8.3.min.js' type='text/javascript' ></script>");
document.write("<script src='" + rootPATH + "oui/core.js' type='text/javascript' ></script>");
document.write("<script src='" + rootPATH + "oui/widget.js' type='text/javascript' ></script>");
document.write("<script src='" + rootPATH + "oui/ctrl.js' type='text/javascript' ></script>");
document.write("<script src='" + rootPATH + "oui/dao.js' type='text/javascript' ></script>");

document.write("<script src='" + rootPATH + "oui/button.js' type='text/javascript' ></script>");
document.write("<script src='" + rootPATH + "oui/textbox.js' type='text/javascript' ></script>");
document.write("<script src='" + rootPATH + "oui/numspin.js' type='text/javascript' ></script>");
document.write("<script src='" + rootPATH + "oui/checkbox.js' type='text/javascript' ></script>");

document.write("<script src='" + rootPATH + "oui/listbox.js' type='text/javascript' ></script>");
document.write("<script src='" + rootPATH + "oui/treebox.js' type='text/javascript' ></script>");
document.write("<script src='" + rootPATH + "oui/gridbox.js' type='text/javascript' ></script>");
document.write("<script src='" + rootPATH + "oui/menu.js' type='text/javascript' ></script>");

document.write("<script src='" + rootPATH + "oui/combobox.js' type='text/javascript' ></script>");
document.write("<script src='" + rootPATH + "oui/datebox.js' type='text/javascript' ></script>");
document.write("<script src='" + rootPATH + "oui/textarea.js' type='text/javascript' ></script>");
document.write("<script src='" + rootPATH + "oui/window.js' type='text/javascript' ></script>");

document.write("<script src='" + rootPATH + "oui/ctrl.setting.js' type='text/javascript' ></script>");

document.write("<link href='" + rootPATH + "../css/oui/blue.css' rel='stylesheet' type='text/css' />");
document.write("<link href='" + rootPATH + "../css/oui/icon.css' rel='stylesheet' type='text/css' />");