/* 添加验校规则 */
(function(δ){
	
	δ.addRule({ name: 'maxlength', tips: '内容过长', rule: function(obj){ return $(obj).val().length <= parseInt($(obj).attr('maxlength'), 10); }});
    δ.addRule({ name: 'required', tips: '必须填写', rule: /.+/ });
    δ.addRule({ name: 'number', tips: '必须为数值', rule: /^(-?\d+)(\.\d+)?$/ });
    δ.addRule({ name: 'money', tips: '金额格式不正确，格式为[10位].[2位]',rule: /^(([1-9]{1}((\d){0,9}))|([0]{1}))(\.(\d){1,2})?$/});
    δ.addRule({ name: 'posiNumber', tips: '必须为正数', rule: /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/ });
    δ.addRule({ name: 'negaNumber', tips: '必须为负数', rule: /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/ });
    δ.addRule({ name: 'integer', tips: '必须为整数', rule: /^-?[1-9]\d*$/ });
    δ.addRule({ name: 'posiInteger', tips: '必须为正整数', rule: /^[0-9]*[1-9][0-9]*$/ });
    δ.addRule({ name: 'negaInteger', tips: '必须为负整数', rule: /^-[0-9]*[1-9][0-9]*$/ });
    δ.addRule({ name: 'nonNegaInteger', tips: '必须为非负整数', rule: /^\d+$/ });
    δ.addRule({ name: 'nonPosiInteger', tips: '必须为非正整数', rule: /^((-\d+)|(0+))$/ });
    δ.addRule({ name: 'decimal', tips: '必须为浮点数', rule: /^(-?\d+)(\.\d+)?$/ });
    δ.addRule({ name: 'posiDecimal', tips: '必须为正浮点数', rule: /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/ });
    δ.addRule({ name: 'negaDecimal', tips: '必须为负浮点数', rule: /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/ });
    δ.addRule({ name: 'nonNegaDecimal', tips: '必须为非负浮点数', rule: /^\d+(\.\d+)?$/ });
    δ.addRule({ name: 'nonPosiDecimal', tips: '必须为非正浮点数', rule: /^((-\d+(\.\d+)?)|(0+(\.0+)?))$/ });
    δ.addRule({ name: 'date', tips: '日期格式不正确', rule: /^(\d{4})(-|\/)(\d{1,2})\2(\d{1,2})$/ });
    δ.addRule({ name: 'email', tips: '邮箱格式不正确', rule: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/ });
    δ.addRule({ name: 'mobile', tips: '手机号码填写错误', rule: /^1[0-9]{10}$/ });
    δ.addRule({ name: 'areaCode', tips: '本地区号格式不正确', rule: function(){} });
    δ.addRule({ name: 'telephone', tips: '电话号码填写错误', rule: /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/ });
    δ.addRule({ name: 'idCard', tips: '身份证只允许输入15位或者18位数字或字母', rule: /^\w{15}$|^\w{18}$/ });
    δ.addRule({ name: 'zipCode', tips: '邮政编码填写错误', rule: /^[1-9]\d{5}$/ });
    δ.addRule({ name: 'url', tips: 'URL地址格式不正确', rule: /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/ });
    δ.addRule({ name: 'ip4', tips: 'IP地址填写错误', rule: /^(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)$/ });
    δ.addRule({ name: 'rar', tips: '不是有效的压缩文件', rule: /(.*)\.(rar|zip|7zip|tgz)$/ });
    δ.addRule({ name: 'picture', tips: '图片格式不正确', rule: /(.*)\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/ });
    δ.addRule({ name: 'code1', tips: '仅允许输入数字或英文字母', rule: /^\w+$/ });
    δ.addRule({ name: 'code2', tips: '仅允许输入数字、字母或下划线', rule: /^[a-zA-Z0-9]+$/ });
    δ.addRule({ name: 'code3', tips: '仅允许输入中英文、数字或下划线', rule: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/ });
    δ.addRule({ name: 'code4', tips: '仅允许输入英文字母', rule: /^[A-Za-z]+$/ });
    δ.addRule({ name: 'upperLetter', tips: '仅允许输入大写字母', rule: /^[A-Z]+$/ });
    δ.addRule({ name: 'lowerLetter', tips: '仅允许输入小写字母', rule: /^[a-z]+$/ });
    δ.addRule({ name: 'chinese', tips: '仅允许输入中文', rule: /^[\u4E00-\u9FA5\uF900-\uFA2D]+/ });
    δ.addRule({ name: 'color', tips: '不是有效的颜色值', rule: /^[a-fA-F0-9]{6}$/ });
    δ.addRule({ name: 'ascii', tips: '仅允许填写Acsii字符', rule: /^[\x00-\xFF]+$/ });
	
})(tptps.verify);