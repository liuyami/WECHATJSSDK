;(function () {
    'use strict';

    function WechatJSSDK(params) {
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
            complete: function () {},
        };

        this._log('默认分享', this.share_default_data);


        this.envpass = false;

        if (!this._check_in_wechat_app()) {
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

                        return _this;
                    });

                    wx.error(function (error) {
                        this._log('签名校验失败', error)
                        return this;
                    });
                }
            })
            .catch(error => {
                this._log('请求签名接口发生失败', error)
                return this;
            });
    }


    // 分享
    WechatJSSDK.prototype.share = function (params) {
        if (!this.envpass) {
            return this;
        }

        let share_data = Object.assign(this.share_default_data, params);

        wx.updateAppMessageShareData(share_data);
        wx.updateTimelineShareData(share_data);
    };

    // 隐藏菜单
    WechatJSSDK.prototype.hideAllNonBaseMenuItem = function () {

        if (!this.envpass) {
            return this;
        }
        wx.hideAllNonBaseMenuItem();

    };

    // 显示菜单
    WechatJSSDK.prototype.showAllNonBaseMenuItem = function () {

        if (!this.envpass) {
            return this;
        }
        wx.showAllNonBaseMenuItem();

    };

    // 调用扫一扫
    WechatJSSDK.prototype.scan = function (params) {

        if (!this.envpass) {
            return this;
        }

        let opts = Object.assign({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success:function () {

            }
        }, params);

        return wx.scanQRCode(opts);
    };

    // 微信支付
    WechatJSSDK.prototype.pay = function (opts) {
        if (!this.envpass) {
            return this;
        }
        return wx.chooseWXPay(opts);
    };

    // 网络状态接口
    WechatJSSDK.prototype.getNetworkType = function(opts) {

        if (!this.envpass) {
            return this;
        }

        wx.getNetworkType(opts);
    };

    // 在腾讯地图中打开指定位置
    WechatJSSDK.prototype.openLocation = function(opts) {

        if (!this.envpass) {
            return this;
        }

        return wx.openLocation(opts);
    };

    // 获取用户当前地址位置信息
    WechatJSSDK.prototype.getLocation = function(params) {

        if (!this.envpass) {
            return this;
        }

        let opts = Object.assign({
            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        }, params);

        return wx.getLocation(opts);
    };


    /** 下面都是私有方法 */
    // 检测变量是否是 undefined 或 null
    WechatJSSDK.prototype._is_undefined = function (v) {
        return v === undefined || v === null
    };

    // 检测是否在微信APP内
    WechatJSSDK.prototype._check_in_wechat_app = function () {
        return /MicroMessenger/i.test(navigator.userAgent) ? true : false;
    };

    // 打印 日志
    WechatJSSDK.prototype._log = function(k, v){
        if(this.opts.debug) {
            console.log(k, v);
        }
    };

    // ajax 请求
    WechatJSSDK.prototype._request = function (method, url, payload) {

        return fetch(url, {
            body: JSON.stringify(payload),
            method: method.toUpperCase(),
            cache: 'no-cache',
            headers: new Headers({
                'Accept-Charset': 'utf-8',
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            })
        })
            .then(response => response.json())
            .catch(err => err.json());
    };

    window.WechatJSSDK = WechatJSSDK;
})();