/* 控件属性配置 */
$.json.attach("CP",{"Forms":[
{"id":"width","name":"宽度","editor":"textbox","catalog":"布局"},
{"id":"height","name":"高度","editor":"textbox","catalog":"布局"},
{"id":"columns","name":"列数","editor":"numspin","catalog":"布局"},
{"id":"fields","name":"字段","editor":"items","catalog":"数据","box":"grid"}
]});

$.json.attach("CP",{"GridView":[
{"id":"width","name":"宽度","editor":"textbox","catalog":"布局"},
{"id":"height","name":"高度","editor":"textbox","catalog":"布局"},
{"id":"fields","name":"列","editor":"combobox","catalog":"数据","box":"grid"}
]});

$.json.attach("CD",{"FormEditors":[
{"id":"textbox","name":"文本(textbox)"},
{"id":"combobox","name":"下拉选项"},
{"id":"datebox","name":"日期"},
{"id":"datespan","name":"日期区间"},
{"id":"numspin","name":"数字"},
{"id":"numspan","name":"数字区间"}
]});

$.json.attach("CD",{"FormsCheckDisplay":[{"id":true,"name":"√"}]});

$.json.attach("DS",{"CtrlMenus":[
{"id":"layout","pid":"","name":"布局","group":1},
{"id":"margin","pid":"layout","name":"边距"},
{"id":"margin-left","pid":"layout","name":"左边距"},
{"id":"margin-right","pid":"layout","name":"右边距"},
{"id":"margin-top","pid":"layout","name":"上边距"},
{"id":"margin-bottom","pid":"layout","name":"下边距"}
]});
