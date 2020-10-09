/* 加载资源配置 tagName 标记名称 propName 属性名称 propValue 属性值（唯一） */
(function(δ){
	δ.addCtrl({tagName:"input",typeName:"textbox",construct:"tptps.ctrl.textbox.construct"});
	δ.addCtrl({tagName:"input",typeName:"combobox",construct:"tptps.ctrl.combobox.construct"});
	δ.addCtrl({tagName:"input",typeName:"datebox",construct:"tptps.ctrl.datebox.construct"});
	δ.addCtrl({tagName:"input",typeName:"datespan",construct:"tptps.ctrl.datespan.construct"});
	δ.addCtrl({tagName:"input",typeName:"numspin",construct:"tptps.ctrl.numspin.construct"});
	δ.addCtrl({tagName:"input",typeName:"numspan",construct:"tptps.ctrl.numspan.construct"});
	δ.addCtrl({tagName:"input",typeName:"listbox",construct:"tptps.ctrl.listbox.construct"});
	δ.addCtrl({tagName:"input",typeName:"toolbox",construct:"tptps.ctrl.toolbox.construct"});
	δ.addCtrl({tagName:"input",typeName:"gridbox",construct:"tptps.ctrl.gridbox.construct"});
	δ.addCtrl({tagName:"input",typeName:"treebox",construct:"tptps.ctrl.treebox.construct"});
	δ.addCtrl({tagName:"input",typeName:"checkbox",construct:"tptps.ctrl.checkbox.construct"});
	δ.addCtrl({tagName:"input",typeName:"radio",construct:"tptps.ctrl.radio.construct"});
	δ.addCtrl({tagName:"input",typeName:"button",construct:"tptps.ctrl.button.construct"});
	δ.addCtrl({tagName:"input",typeName:"textarea",construct:"tptps.ctrl.textarea.construct"});
	
	δ.addCtrl({tagName:"div",typeName:"pagesize",construct:"tptps.ctrl.pagesize.construct"});
	δ.addCtrl({tagName:"div",typeName:"gridview",construct:"tptps.ctrl.gridview.construct"
			  ,children:[{tagName:"div",typeName:"column"},{tagName:"div",typeName:"pagesize"}]});
	δ.addCtrl({tagName:"div",typeName:"forms",construct:"tptps.ctrl.forms.construct",children:[{tagName:"div",typeName:"cell"}]});
	δ.addCtrl({tagName:"div",typeName:"toolbar",construct:"tptps.ctrl.toolbar.construct"});
	δ.addCtrl({tagName:"div",typeName:"menu",construct:"tptps.ctrl.menu.construct"});
	δ.addCtrl({tagName:"div",typeName:"tab",construct:"tptps.ctrl.tab.construct",children:[{tagName:"div",typeName:"item"}]});
	δ.addCtrl({tagName:"div",typeName:"mousemenu",construct:"tptps.ctrl.mousemenu.construct"});
	δ.addCtrl({tagName:"div",typeName:"dialog",construct:"tptps.ctrl.dialog.construct",container:true});
	δ.addCtrl({tagName:"div",typeName:"window",construct:"tptps.ctrl.window.construct",container:true});
	δ.addCtrl({tagName:"div",typeName:"panel",construct:"tptps.ctrl.panel.construct",container:true});
	δ.addCtrl({tagName:"div",typeName:"wtab",construct:"tptps.ctrl.window.fn.setupTab"
			  ,children:[{tagName:"div",typeName:"window"},{tagName:"div",typeName:"panel"}]});
	δ.addCtrl({tagName:"div",typeName:"calendar",construct:"tptps.ctrl.calendar.construct"});
	δ.addCtrl({tagName:"div",typeName:"propertygrid",construct:"tptps.ctrl.propertygrid.construct"});
})(tptps.ctrl.plugins);

/* 加载资源配置 */
(function(δ){
		  
	δ.addImage({name:"upTriangle4",src:"triangles.gif",region:{x:0,y:0,w:7,h:4},css:"icon-upTriangle4"});
	δ.addImage({name:"downTriangle4",src:"triangles.gif",region:{x:0,y:-3,w:7,h:4},css:"icon-downTriangle4"});
	δ.addImage({name:"leftTriangle4",src:"triangles.gif",region:{x:0,y:0,w:4,h:7},css:"icon-leftTriangle4"});
	δ.addImage({name:"rightTriangle4",src:"triangles.gif",region:{x:-4,y:0,w:4,h:7},css:"icon-rightTriangle4"});
	
	δ.addImage({name:"rightDownTriangle6",src:"triangles.gif",region:{x:0,y:-16,w:6,h:6},status:"black",css:"icon-rightDownTriangle6-black"});
	δ.addImage({name:"rightDownTriangle6",src:"triangles.gif",region:{x:-11,y:-16,w:6,h:6},status:"white",css:"icon-rightDownTriangle6-white"});
	
	δ.addImage({name:"rightHollowTriangle5",src:"triangles.gif",region:{x:-22,y:-7,w:5,h:9},status:"black",css:"icon-rightHollowTriangle5-black"});
	δ.addImage({name:"rightHollowTriangle5",src:"triangles.gif",region:{x:-40,y:-7,w:5,h:9},status:"white",css:"icon-rightHollowTriangle5-white"});
	
	δ.addImage({name:"upTriangle",src:"spiner_up2.png",region:{x:0,y:0,w:8,h:4},status:"up",css:"icon-upTriangle-up"});
	δ.addImage({name:"upTriangle",src:"spiner_up1.png",region:{x:0,y:0,w:8,h:4},status:"down",css:"icon-upTriangle-down"});
	δ.addImage({name:"downTriangle",src:"spiner_down2.png",region:{x:0,y:0,w:8,h:4},status:"up",css:"icon-downTriangle-up"});
	δ.addImage({name:"downTriangle",src:"spiner_down1.png",region:{x:0,y:0,w:8,h:4},status:"down",css:"icon-downTriangle-down"});
	
	δ.addImage({name:"drop",src:"drop-normal.gif",region:{x:0,y:0,w:22,h:22},status:"normal",css:"icon-drop-normal"});
	δ.addImage({name:"drop",src:"drop-over.gif",region:{x:0,y:0,w:22,h:22},status:"over",css:"icon-drop-over"});
	δ.addImage({name:"prop",src:"prop.ico",region:{x:0,y:0,w:16,h:16},status:"normal",css:"icon-prop-normal"});
	δ.addImage({name:"prop",src:"prop.ico",region:{x:0,y:0,w:16,h:16},status:"over",css:"icon-prop-over"});
	
	δ.addImage({name:"calendar",src:"calendar.gif",region:{x:0,y:0,w:22,h:22},status:"normal",css:"icon-calendar-normal"});
	δ.addImage({name:"calendar",src:"calendar.gif",region:{x:-22,y:0,w:22,h:22},status:"over",css:"icon-calendar-over"});
	
	δ.addImage({name:"plusMinus",src:"tree.gif",region:{x:-76,y:-92,w:18,h:18},status:"plus",css:"icon-plusMinus-plus"});
	δ.addImage({name:"plusMinus",src:"tree.gif",region:{x:-94,y:-92,w:18,h:18},status:"minus",css:"icon-plusMinus-minus"});
	
	δ.addImage({name:"check",src:"tree.gif",region:{x:0,y:0,w:14,h:14},status:"normal",css:"icon-check-normal"});
	δ.addImage({name:"check",src:"tree.gif",region:{x:-14,y:0,w:14,h:14},status:"select",css:"icon-check-select"});
	δ.addImage({name:"check",src:"tree.gif",region:{x:0,y:-14,w:14,h:14},status:"over",css:"icon-check-over"});
	δ.addImage({name:"radio",src:"tree.gif",region:{x:-28,y:0,w:14,h:14},status:"normal",css:"icon-radio-normal"});
	δ.addImage({name:"radio",src:"tree.gif",region:{x:-42,y:0,w:14,h:14},status:"select",css:"icon-radio-select"});
	δ.addImage({name:"radio",src:"tree.gif",region:{x:-28,y:-14,w:14,h:14},status:"over",css:"icon-radio-over"});
	
	δ.addImage({name:"folder",src:"folder-close.gif",region:{x:0,y:0,w:18,h:14},status:"close",css:"icon-folder-close"});
	δ.addImage({name:"folder",src:"folder-open.gif",region:{x:0,y:0,w:18,h:14},status:"open",css:"icon-folder-open"});
	δ.addImage({name:"folder",src:"folder-file.gif",region:{x:0,y:0,w:18,h:16},status:"file",css:"icon-folder-file"});
	
	δ.addImage({name:"treeBranch",src:"tree.gif",region:{x:-56,y:0,w:18,h:18},status:"treeF",css:"icon-treeBranch-treeF"});
	δ.addImage({name:"treeBranch",src:"tree.gif",region:{x:-56,y:-18,w:18,h:18},status:"treeT",css:"icon-treeBranch-treeT"});
	δ.addImage({name:"treeBranch",src:"tree.gif",region:{x:-56,y:-36,w:18,h:18},status:"treeL",css:"icon-treeBranch-treeL"});
	δ.addImage({name:"treeBranch",src:"tree.gif",region:{x:-56,y:-54,w:18,h:18},status:"treeWhite",css:"icon-treeBranch-treeWhite"});
	δ.addImage({name:"treeBranch",src:"tree.gif",region:{x:-74,y:0,w:18,h:18},status:"treeFplus",css:"icon-treeBranch-treeFplus"});
	δ.addImage({name:"treeBranch",src:"tree.gif",region:{x:-74,y:-18,w:18,h:18},status:"treeMplus",css:"icon-treeBranch-treeMplus"});
	δ.addImage({name:"treeBranch",src:"tree.gif",region:{x:-74,y:-36,w:18,h:18},status:"treeLplus",css:"icon-treeBranch-treeLplus"});
	δ.addImage({name:"treeBranch",src:"tree.gif",region:{x:-74,y:-54,w:18,h:18},status:"treeOplus",css:"icon-treeBranch-treeOplus"});
	δ.addImage({name:"treeBranch",src:"tree.gif",region:{x:-92,y:0,w:18,h:18},status:"treeFminus",css:"icon-treeBranch-treeFminus"});
	δ.addImage({name:"treeBranch",src:"tree.gif",region:{x:-92,y:-18,w:18,h:18},status:"treeMminus",css:"icon-treeBranch-treeMminus"});
	δ.addImage({name:"treeBranch",src:"tree.gif",region:{x:-92,y:-36,w:18,h:18},status:"treeLminus",css:"icon-treeBranch-treeLminus"});
	δ.addImage({name:"treeBranch",src:"tree.gif",region:{x:-92,y:-54,w:18,h:18},status:"treeOminus",css:"icon-treeBranch-treeOminus"});
	
	δ.addImage({name:"framebox",src:"design.gif",region:{x:0,y:0,w:6,h:6},status:"normal",css:"icon-framebox-normal"});
	δ.addImage({name:"framebox",src:"design.gif",region:{x:0,y:-5,w:6,h:6},status:"active",css:"icon-framebox-active"});
	δ.addImage({name:"framebox",src:"design.gif",region:{x:-6,y:0,w:6,h:6},status:"lock",css:"icon-framebox-lock"});
	
	δ.addImage({name:"upDock",src:"dock.gif",region:{x:-32,y:0,w:32,h:32},css:"icon-dock-upDock"});
	δ.addImage({name:"downDock",src:"dock.gif",region:{x:-32,y:-64,w:32,h:32},css:"icon-dock-downDock"});
	δ.addImage({name:"leftDock",src:"dock.gif",region:{x:0,y:-32,w:32,h:32},css:"icon-dock-leftDock"});
	δ.addImage({name:"rightDock",src:"dock.gif",region:{x:-64,y:-32,w:32,h:32},css:"icon-dock-rightDock"});
	δ.addImage({name:"upHalfDock",src:"dock.gif",region:{x:0,y:0,w:32,h:32},css:"icon-dock-upHalfDock"});
	δ.addImage({name:"downHalfDock",src:"dock.gif",region:{x:-64,y:0,w:32,h:32},css:"icon-dock-downHalfDock"});
	δ.addImage({name:"leftHalfDock",src:"dock.gif",region:{x:0,y:-64,w:32,h:32},css:"icon-dock-leftHalfDock"});
	δ.addImage({name:"rightHalfDock",src:"dock.gif",region:{x:-64,y:-64,w:32,h:32},css:"icon-dock-rightHalfDock"});
	δ.addImage({name:"centerDock",src:"dock.gif",region:{x:-32,y:-32,w:32,h:32},css:"icon-dock-centerDock"});
	
	δ.addImage({name:"toolbox",src:"toolbox.gif",region:{x:0,y:0,w:29,h:25},css:"icon-toolbox-normal"});
	δ.addImage({name:"toolbox",src:"toolbox.gif",region:{x:-29,y:0,w:29,h:25},status:"select",css:"icon-toolbox-select"});
	
	δ.addImage({name:"logo",src:"logo2.gif",region:{x:0,y:0,w:32,h:32},css:"icon-logo"});
	
	δ.addImage({name:"minWin",src:"window.gif",region:{x:-10,y:0,w:10,h:10},status:"normal",css:"icon-minWin-normal"});
	δ.addImage({name:"maxWin",src:"window.gif",region:{x:-20,y:0,w:10,h:10},status:"normal",css:"icon-maxWin-normal"});
	δ.addImage({name:"revertWin",src:"window.gif",region:{x:0,y:0,w:10,h:10},status:"normal",css:"icon-revertWin-normal"});
	δ.addImage({name:"closeWin",src:"window.gif",region:{x:-30,y:0,w:10,h:10},status:"normal",css:"icon-closeWin-normal"});
	δ.addImage({name:"downWin",src:"window.gif",region:{x:-40,y:0,w:10,h:10},status:"normal",css:"icon-downWin-normal"});
	
	δ.addImage({name:"minWin",src:"window.gif",region:{x:-10,y:-10,w:10,h:10},status:"over",css:"icon-minWin-over"});
	δ.addImage({name:"maxWin",src:"window.gif",region:{x:-20,y:-10,w:10,h:10},status:"over",css:"icon-maxWin-over"});
	δ.addImage({name:"revertWin",src:"window.gif",region:{x:0,y:-10,w:10,h:10},status:"over",css:"icon-revertWin-over"});
	δ.addImage({name:"closeWin",src:"window.gif",region:{x:-30,y:-10,w:10,h:10},status:"over",css:"icon-closeWin-over"});
	δ.addImage({name:"downWin",src:"window.gif",region:{x:-40,y:-10,w:10,h:10},status:"over",css:"icon-downWin-over"});
	
	δ.addImage({name:"minWin",src:"window.gif",region:{x:-10,y:-20,w:10,h:10},status:"select",css:"icon-minWin-select"});
	δ.addImage({name:"maxWin",src:"window.gif",region:{x:-20,y:-20,w:10,h:10},status:"select",css:"icon-maxWin-select"});
	δ.addImage({name:"revertWin",src:"window.gif",region:{x:0,y:-20,w:10,h:10},status:"select",css:"icon-revertWin-select"});
	δ.addImage({name:"closeWin",src:"window.gif",region:{x:-30,y:-20,w:10,h:10},status:"select",css:"icon-closeWin-select"});
	δ.addImage({name:"downWin",src:"window.gif",region:{x:-40,y:-20,w:10,h:10},status:"select",css:"icon-downWin-select"});
	
	δ.addImage({name:"tabFork",src:"tabs-icon.png",region:{x:0,y:0,w:17,h:17},status:"normal",css:"icon-tabFork-normal"});
	δ.addImage({name:"tabFork",src:"tabs-icon.png",region:{x:0,y:-17,w:17,h:17},status:"over",css:"icon-tabFork-over"});
	
	δ.addImage({name:"tabLeft",src:"tabs-icon.png",region:{x:0,y:0,w:16,h:16},status:"normal",css:"icon-tabLeft-normal"});
	δ.addImage({name:"tabLeft",src:"tabs-icon.png",region:{x:0,y:0,w:16,h:16},status:"over",css:"icon-tabLeft-over"});
	
	δ.addImage({name:"tabRight",src:"tabs-icon.png",region:{x:0,y:0,w:16,h:16},status:"normal",css:"icon-tabRight-normal"});
	δ.addImage({name:"tabRight",src:"tabs-icon.png",region:{x:0,y:0,w:16,h:16},status:"over",css:"icon-tabRight-over"});
	
	δ.addImage({name:"tabDrop",src:"tabs-icon.png",region:{x:0,y:0,w:16,h:16},status:"normal",css:"icon-tabDrop-normal"});
	δ.addImage({name:"tabDrop",src:"tabs-icon.png",region:{x:0,y:0,w:16,h:16},status:"over",css:"icon-tabDrop-over"});
	
	δ.addImage({name:"tabClose",src:"tabs-icon.png",region:{x:0,y:0,w:16,h:16},status:"normal",css:"icon-tabClose-normal"});
	δ.addImage({name:"tabClose",src:"tabs-icon.png",region:{x:0,y:0,w:16,h:16},status:"over",css:"icon-tabClose-over"});
	
})(tptps.widget.graph);

/* 异常处理代码配置，可以通文件中查询错语代码定位断言位置 */
(function(Δ,δ){
	δ.addError({code:"1109",message:"",callback:Δ.assert.show});
	δ.addError({code:"1110",message:"JSON数据格式错误",file:"dao.js",callback:Δ.assert.show});
	δ.addError({code:"1111",message:"解析JSON字符串错误",file:"verify.js",callback:Δ.assert.show});
	δ.addError({code:"1201",message:"渲染及控件标签错误",file:"ctrl.js",callback:Δ.assert.show});
	δ.addError({code:"1301",message:"解析JSON字符串错误",file:"core.js",callback:Δ.assert.show});
})(tptps,tptps.assert);