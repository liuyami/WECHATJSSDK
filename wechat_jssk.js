(function () {


    // TODO weixinJSBridgeReady https://www.jianshu.com/p/d7f5f5131783

    function WECHAT_JSSDK(params) {
        let _this = this;

        //合并指定配置到默认配置,
        this.opts = Object.assign({
            client_id: '9545d869-95eb-47ad-8667-98b5541d4af2',
            url: location.href,
            debug: false
        }, params);

        this._log('参数',this.opts);

        // 默认分享内容
        this.share_default_data = {
            title: '测试站点：' + document.title,
            desc: '',
            link: location.href,
            imgUrl: this._is_undefined(document.images[0]) ? '' : document.images[0].src,
            complete: function () {
            },
        };

        this._log('默认分享', this.share_default_data);


        this.envpass = false;

        if (!this._check_wechat_app()) {
            this._log('环境', '非微信内');
            return this;
        }


        // 请求签名接口
        this._request('POST', 'https://wechat.yscase.com/platform/ys/jssdk', this.opts)
            .then(data => {
                if (data.code != 0) {
                    this._log('请求签名接口返回失败', data.message);
                    return this;
                } else {
                    wx.config(data.config);

                    wx.ready(function () {
                        _this.envpass = true;
                        _this.share();
                    });
                    wx.error(function () {

                    });
                }
            })
            .catch(error => this._log('请求签名接口发生失败', error));


        return this;
    }


    // 分享
    WECHAT_JSSDK.prototype.share = function (params) {

        if (!this.envpass) {
            return this;
        }

        let share_data = Object.assign(this.share_default_data, params);

        wx.updateAppMessageShareData(share_data);
        wx.updateTimelineShareData(share_data);

    };

    // 隐藏菜单
    WECHAT_JSSDK.prototype.hideAllNonBaseMenuItem = function (params) {

        if (!this.envpass) {
            return this;
        }
        wx.hideAllNonBaseMenuItem();

    };

    // 显示菜单
    WECHAT_JSSDK.prototype.showAllNonBaseMenuItem = function (params) {

        if (!this.envpass) {
            return this;
        }
        wx.showAllNonBaseMenuItem();

    };


    /** 下面都是私有方法 */
    // 检测变量是否定义
    WECHAT_JSSDK.prototype._is_undefined = function (v) {
        return v === undefined || v === null
    };

    // 检测是否在微信APP内
    WECHAT_JSSDK.prototype._check_wechat_app = function () {
        return /MicroMessenger/i.test(navigator.userAgent) ? true : false;
    };

    // 打印 日志
    WECHAT_JSSDK.prototype._log = function(k, v){
        if(this.opts.debug) {
            console.log(k, v);
        }
    };

    // ajax 请求
    WECHAT_JSSDK.prototype._request = function (method, url, payload) {

        return fetch(url, {
            body: JSON.stringify(payload),
            method: method.toUpperCase(),
            cache: 'no-cache',
            mode: 'cors',
            headers: new Headers({
                'Accept-Charset': 'utf-8',
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            })
        })
            .then(response => response.json())
            .catch(err => err.json());
    };

    window.WECHAT_JSSDK = WECHAT_JSSDK;
})();