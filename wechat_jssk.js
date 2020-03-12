(function () {


    function WECHAT_JSSDK(params) {

        //合并指定配置到默认配置,
        this.opts = Object.assign({
            appid : '0b00d030-4a1c-4a36-9334-6fe361a29dbe',
            url : 'http://yami.h5.yscase.com',
            debug: false
        }, params);

        this._log('参数',this.opts);

        // 默认分享内容
        var share_default_data = {
            title: '测试站点：' + document.title,
            desc: '',
            link: location.href,
            imgUrl: this._is_undefined(document.images[0]) ? '' : document.images[0].src,
            complete: function () {},
        };

        this._log('默认分享',share_default_data);


        this.init();
    }

    /**
     * 初始化
     */
    WECHAT_JSSDK.prototype.init = function () {
        // TODO 检测是否在微信APP内
    };

    // 分享
    WECHAT_JSSDK.prototype.share = function (params) {

        return {};
    };

    // 检测变量是否定义
    WECHAT_JSSDK.prototype._is_undefined = function(v){
        return v === undefined || v === null
    };

    // 检测是否在微信APP内
    WECHAT_JSSDK.prototype._check_wechat_app = function(){
        return /MicroMessenger/i.test(navigator.userAgent) ? true : false;
    };

    // 打印 日志
    WECHAT_JSSDK.prototype._log = function(k, v){

        if(this.opts.debug) {
            console.log(k, v);
        }

    };

    // ajax 请求
    WECHAT_JSSDK.prototype._request = function(options){
        options = options || {};
        options.type = (options.type || "GET").toUpperCase();
        options.dataType = options.dataType || "json";
        options.async = options.async || true;
        var params = formatParams(options.data);
        var xhr = new XMLHttpRequest();

        if (options.type == "GET") {
            xhr.open("GET", options.url + "?" + params, options.async);
            xhr.send(null);
        } else if (options.type == "POST") {
            xhr.open("POST", options.url, options.async);
            //设置表单提交时的内容类型
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(params);
        }

        // 处理同步请求，不会调用回调函数
        if (!options.async) {
            if (options.dataType == 'json') {
                return options.success && options.success(xhr.responseText);
            } else {
                return options.fail && options.fail(xhr.responseText);;
            }
        }

        //接收
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var status = xhr.status;
                if (status >= 200 && status < 300) {
                    options.success && options.success(xhr.responseText);
                } else {
                    options.fail && options.fail(status);
                }
            }
        }
    };

    window.WECHAT_JSSDK = WECHAT_JSSDK;
})();