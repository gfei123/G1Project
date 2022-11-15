import GameUtils from "../Util/GameUtils";
import BaseView from "./BaseView";

export default class HttpRequestView extends BaseView {

    getBtn:Laya.Button;
    postBtn:Laya.Button;

    onAwake() {
        super.onAwake();

        this.getBtn.on(Laya.Event.CLICK, this,()=>{
            this.httpGet("http://www.baidu.com/");
        });
        

        this.postBtn.on(Laya.Event.CLICK, this,()=>{
            console.log("TODO");
            GameUtils.FlyTextTips("TODO");
        });
    }

    httpGet(url: string) {
        var req = new Laya.HttpRequest();
        req.http.timeout = 10000;

        req.on(Laya.Event.PROGRESS, this, (data) => {
            console.log("get请求进行中: " + data);
        });
        req.once(Laya.Event.ERROR, this, (data) => {
            console.log("get请求错误: " + data);
        });
        req.once(Laya.Event.COMPLETE, this, (data) => {
            console.log("get请求成功: " + data);
            GameUtils.FlyTextTips("get请求成功");
        });

        req.send(url, null, "get", "text");
    }

    httpPost(url: string, data: any, contentType?: string) {
        var req = new Laya.HttpRequest();
        req.http.timeout = 10000;

        req.on(Laya.Event.PROGRESS, this, (data) => {
            console.log("post请求进行中: " + data);
        });
        req.once(Laya.Event.ERROR, this, (data) => {
            console.log("post请求错误: " + data);
        });
        req.once(Laya.Event.COMPLETE, this, (data) => {
            console.log("post请求成功: " + data);
        });
        if (contentType == null) {
            req.send(url, data, "post", "json");
        }
        else {
            req.send(url, data, "post", "json", ["content-type", contentType]);
        }
    }
}