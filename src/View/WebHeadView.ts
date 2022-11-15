import GameUtils from "../Util/GameUtils";
import BaseView from "./BaseView";

export default class WebHeadView extends BaseView {
    // 圆形头像
    circleHeadImage: Laya.Image;
    headImage: Laya.Image;


    /*
        mask遮罩的用法：
        在Image子节点创建一个Sprite，
        然后把renderType设置为mask，再在Sprite子节点创建一个形状，比如Circle
    */
    
    onAwake() {
        super.onAwake();

        let url = "http://ask.layabox.com/static/common/avatar-max-img.png";
        Laya.loader.load(url,
            Laya.Handler.create(this, () => {
                this.circleHeadImage.skin = url;
                this.headImage.skin = url;
            }));
    }
}