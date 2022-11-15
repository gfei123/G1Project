export default class BaseView extends Laya.Scene {
    panel: Laya.Panel;
    backBtn: Laya.Button;
    center: Laya.Box;
    

    onAwake() {
        this.height = 548;
        

        if (null != this.backBtn) {
            this.backBtn.on(Laya.Event.CLICK, this, () => {
                this.destroy();
                // this.removeSelf();
            });
        }

        // 屏幕分辨率变化，重新设置Panel的高度
        Laya.stage.on(Laya.Event.RESIZE, this, this.onScreenResize);
        // 主动触发一次resize
        this.onScreenResize();
    }

    onScreenResize() {
        if (null != this.panel) {
            // 设置Panel的高度
            this.panel.height = Laya.stage.height - (this.panel.top ? this.panel.top : 0)
                - (this.panel.bottom ? this.panel.bottom : 0);
        }
        if (null != this.center) {
            this.center.y = Laya.stage.height / 2;
        }
    }
}