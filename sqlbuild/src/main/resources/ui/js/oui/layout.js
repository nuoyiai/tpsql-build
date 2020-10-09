(function($,Δ,δ){
	Δ.ctrl.layout=δ={
		/* 控件样式配置 */
		styles:function(){
			this.mainStyle="layout-main-style";		//控件外框样式
			this.borderStyle="layout-border-style";
			this.nodeStyle="layout-node-style";
		}
		,node:function(){
			this.parent=parent;
			this.width=-1;
			this.height=-1;
			this.dock="";
			
			this.buildElement=function(){
				
			};
		}
	}
})(jQuery,tptps);