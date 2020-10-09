//////////////////////////////////////////////////////
/////   Author: Zhu Sheng Wei (Nov-9th 1980)       ///
////    Nff WebUI Javascript Control Widget		  ////
//////////////////////////////////////////////////////

(function($,Δ,δ){
	Δ.widget=δ={
		popup:function(ctx){
			Δ.ctrl.base.widget.call(this);
			this.rect=null;
			this.opened=false;
			this.frameObj=null;
			this.onhide="";
			this.onshow="";
			this.border=(ctx && ctx.border)?true:false;
			this.buildElement = function(){					//初始化函数
				var css={};
				css["display"]="none";
				css["position"]="absolute";
				css["left"]="-100px";
				css["top"]="-100px";
				css["zIndex"]="9900";
				css["background-color"]="#fff";
				this.frameObj=$("<div>").css(css);
				if(this.border)this.frameObj.addClass("widget-popup-border");
			};
			this.show=function(x,y,w,h){				//显示
				if (this.frameObj){
					var elem=this.frameObj[0];
					var _x =parseFloat(x);
					if (_x==NaN)_x =0;
					var _y =parseFloat(y);
					if (_y==NaN)_y =0;
					var _w =parseFloat(w);
					if (isNaN(_w))_w =0;
					var _h =parseFloat(h);
					if (isNaN(_h))_h =0;
					if (Δ.moz){
						if (_y <0)_y =1;
						if (_x <0)_x =1;
					}
					this.frameObj.css({"left":x +"px","top":y +"px"});
					with(elem.style){
						if (_w <=0){
							if (elem.offsetWidth !=0) width =elem.offsetWidth;
						}
						else width =_w +"px";
						if (_h <=0){
							if (elem.offsetHeight !=0) height =elem.offsetHeight;
						}
						else height =_h +"px";
						display ="";
					}
				}
				this.opened =true;
				if(this.onshow)Δ.raise(this.onshow);
			};
			this.hide=function(){			//隐藏
				if (this.frameObj)this.frameObj.hide();
				this.opened =false;
				if(this.onhide)Δ.raise(this.onhide);
			};
		}
		,cover:function(){
			this.buildElement=function(){
				var elem = $("#_coverDiv");
				if(elem.length>0){
					this.frameObj=elem;
				}else{
					var css={};
					css["left"]="0px";
					css["top"]="0px";
					css["width"]="100%";
					css["height"]="100%";
					css["overflow"]="hidden";
					css["position"]="fixed";
					css["z-index"]="999";
					this.frameObj=$("<div id=\"_coverDiv\" style=\"display:none\" >").css(css).addClass("d-mask");
					$("body").append(this.frameObj);
				}
			};
			this.show=function(){
				if(this.frameObj==null)this.buildElement();
				this.frameObj.show();
				var c = this.frameObj.data("count");
				if(c){
					c++
					this.frameObj.data("count",c);
				}else{
					this.frameObj.data("count",1);
				}
			};
			this.hide=function(){
				if(this.frameObj){
					var c = this.frameObj.data("count");
					if(c){
						c--;
					}else{
						c=0;
					}
					this.frameObj.data("count",c)
					if(c==0)this.frameObj.hide();
				}
			};
		}
		,icon:function(name,state){
			this.frameObj=null;
			this.name=name;
			this.state=state;
			this.iconStyle="widget-icon";
			
			this.buildElement=function(elem){
				var html = elem ? elem:"<i>";
				this.frameObj= δ.graph.getElement(this.name,this.state,$(html).addClass(this.iconStyle));
			};
			this.setState=function(state){
				δ.graph.setElement(this.name,state,this.frameObj);
			};
			this.getWidth=function(){
				return this.frameObj.width();
			};
		}
		,triangle:function(toward,size){				//三角
			this.frameObj=null;				//标签对像
			this.toward=toward;				//方向
			this.size=size;
			this.styles={"frame":"widget-triangle","triangle":"triangle"};
	
			this.buildElement=function(){			//初始化
				var f={css:{},attr:{}},t={css:{},attr:{}};
				with(this.styles)
				{
					f.attr["class"]=frame;
					t.attr["class"]=triangle;
				}
				this.frameObj=$("<div/>").attr(f.attr).css(f.css);
				var triangle = δ.graph.getElement(this.toward+"Triangle6").attr(t.attr);
				this.frameObj.append(triangle);
			};
			this.getWidth=function(){
				return this.frameObj.width();
			};
		}
		,triangleSpin:function(){
			this.frameObj=null;
			this.up=null;
			this.upTriangle=null;
			this.down=null;
			this.downTriangle=null;
			this.styles={"spin":"widget-triangle-spin","up":"up","down":"down","triangle":"triangle"};
			
			this.buildElement=function(){			//初始化
				var f={css:{},attr:{}},u={css:{},attr:{}},t={css:{},attr:{}};
				with(this.styles){
					f.attr["class"]=spin;
					u.attr["class"]=up;
					t.attr["class"]=triangle;
				}
				this.frameObj=$("<div>").attr(f.attr).css(f.css);
				this.up=$("<div>").attr(u.attr).css(u.css);
				this.down=$("<div>").attr(u.attr).css(u.css);
				this.downTriangle = δ.graph.getElement("downTriangle4",null,$("<div>").attr(t.attr));
				this.upTriangle = δ.graph.getElement("upTriangle4",null,$("<div>").attr(t.attr));
				this.up.append(this.upTriangle);
				this.down.append(this.downTriangle);
				this.frameObj.append(this.up);
				this.frameObj.append(this.down);
			};
			this.getWidth=function(){
				return 15;
			};
		}
		,graph:{
			srcMap:{},imgMap:{},cssPath:"",imagePath:""
			,getImagePath:function(){			/* 得到页面图片的相对路径 */
				if(this.imagePath==""){
					var cssPath = this.getCssPath();
					var href = window.document.location.href;
					var n = cssPath.lastIndexOf("/css");
					var path = cssPath.substring(0,n)+"/view/img/ui/";
					this.imagePath = this.getRelativePath(path,href);
				}
				return this.imagePath;
			}
			,getRelativePath:function(path1,path2){		/* 得到两个地址的相对路径 */
				var pre = "";
				for(var i=0;i<path2.length;i++){
					if(i<path1.length && path1.charAt(i)==path2.charAt(i))pre+=path1.charAt(i);
					else break;
				}
				var n = pre.lastIndexOf("/");
				if(pre.length>1){
					if(pre.charAt(pre.length-1)!='/' && n>-1)pre = pre.substring(0,n+1);
				}else if(pre.length==1){
					if(pre.charAt(0)=='/')pre="";
				}
				if(pre){
					var part1 = path1.substring(pre.length-1);
					var part2 = path2.substring(pre.length-1);
					if(part1.charAt(0)=='/')part1=part1.substring(1);
					if(part2.charAt(0)=='/')part2=part2.substring(1);
					var part3 = "";
					n = part2.indexOf("/");
					while(n>-1){
						part3 = "../" + part3;
						n = part2.indexOf("/",n+1);
					}
					return part3+part1;
				}else{
					return path1;
				}
			}
			,getCssPath:function(){				/* 得到引用脚本的路径 */
				if(this.cssPath==""){
					var links = document.getElementsByTagName("link");
					if(links && links.length){
						for(var i=0;i<links.length;i++){
							var href = links[i].href;
							if(href.indexOf("/skin/css")>-1){
								this.cssPath = href;
							}
						}
					}
				}
				return this.cssPath;
			}
			,addImage:function(img){			/* 添加图片资源配置 */
				with(img)
				{
					if(!this.srcMap[src])this.srcMap[src]=img;
					
					var g = (this.imgMap[name])?this.imgMap[name]:{};
					if(status)g[status]=img;
					else g["default"]=img;
					this.imgMap[name]=g;
				}
			}
			,getImage:function(name,status){		/* 获得图片资源配置 */
				if(name){
					var g=this.imgMap[name];
					if(g){
						return (status)?g[status]:g["default"];
					}
				}
			}
			,getImageUrl:function(src){				/* 获得图片资源的根路径 */
				if(src.indexOf("http")>-1 || src.indexOf("/")>-1)return src;
				else return (src)?this.getImagePath()+src:this.getImagePath();
			}
			,getIcon:function(src,html){
				if(src.indexOf(".")>-1){
					var imgSrc=this.getImageUrl(src);
					var elem = (html)?$(html):$("<div>");
					elem.css({"background":"url('"+imgSrc+"') no-repeat center center"});
					return elem;
				}
				else{
					return this.getElement(src,"",html);
				}
			}
			,getElement:function(name,state,html){			/* 得到图形对像 */
				if(name){
					var g={attr:{},css:{}};
					var img = this.getImage(name,state);
					if(img){
						with(img){
							var elem = (html)?$(html):$("<div>");
							elem.attr("state",state);
							if(img.css){			/* 通过固定css优化 */
								return elem.addClass(img.css);
							}else{					/* 动态样式html代码可读性太差 */
								var imgSrc=this.getImageUrl(src);
								g.css["background"]="url('"+imgSrc+"')";
								g.css["backgroundRepeat"]="no-repeat";
								g.css["backgroundPosition"]=region.x+"px "+region.y+"px";
								g.css["backgroundPositionX"]=region.x;
								g.css["backgroundPositionY"]=region.y;
								g.css["backgroundColor"]="";
								g.css["width"]=region.w;
								g.css["height"]=region.h;
								return elem.css(g.css);
							}
						}
					}
				}
			}
			,setElement:function(name,state,elem){			/* 重新设置图形对像 */
				if(name){
					var g={attr:{},css:{}};
					var img = this.getImage(name,state);
					if(img){
						with(img){
							var oldState = elem.attr("state");
							elem.attr("state",state);
							if(img.css){			/* 通过固定css优化 */
								if(oldState!=state){
									var oldImg = this.getImage(name,oldState);
									if(oldImg && oldImg.css)
										elem.removeClass(oldImg.css);
									elem.addClass(img.css);
								}
							}else{					/* 动态样式html代码可读性太差 */
								var imgSrc=this.getImageUrl(src);
								g.css["background"]="url('"+imgSrc+"')";
								g.css["backgroundRepeat"]="no-repeat";
								g.css["backgroundPosition"]=region.x+"px "+region.y+"px";
								g.css["backgroundPositionX"]=region.x;
								g.css["backgroundPositionY"]=region.y;
								g.css["width"]=region.w;
								g.css["height"]=region.h;
								elem.css(g.css);
							}
						}
					}
				}
			}
		}
		,fn:{
			createPopup:function(ctx){
				var popup = new δ.popup(ctx);
				popup.buildElement();
				return popup;
			}
		}
	};
})(jQuery,tptps);