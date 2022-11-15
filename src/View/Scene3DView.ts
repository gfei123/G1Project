import BaseView from "./BaseView";

export default class DlgShowView extends BaseView {
    
    bgBox: Laya.Box;
    doBtn: Laya.Button;
    progressBar:Laya.ProgressBar;
    progressLbl:Laya.Label;
    
    cam: Laya.Camera;
    mouseLastX: number = -1;
    

    // 螺旋桨是否在转
    private windsockRoting: boolean = false;

    onAwake() {
        super.onAwake();


        this.center.visible = false;

        // 适配
        this.bgBox.height = Laya.stage.height - (this.bgBox.top ? this.bgBox.top : 0)
            - (this.bgBox.bottom ? this.bgBox.bottom : 0);

        // 方式一，没有进度监听
        //Laya.Scene3D.load("scene3d/LayaScene_3DScene/Conventional/3DScene.ls",
        //    Laya.Handler.create(this, this.onLoadSceneComplete));

        // 方式二，有进度监听
        Laya.loader.create("scene3d/LayaScene_3DScene/Conventional/3DScene.ls", 
            Laya.Handler.create(this, this.onLoadSceneComplete),
            Laya.Handler.create(this, (pro)=>{
                // console.log("data:" + pro);
                this.progressBar.value = pro;
                this.progressLbl.text = (pro*100).toFixed(2) + "%";
            }));
    }

    onLoadSceneComplete(scene:Laya.Scene3D) {
        console.log("onLoadSceneComplete");

        this.bgBox.visible = false;
        this.center.visible = true;
        this.addChildAt(scene, 0);
        this.cam = scene.getChildByName("Main Camera") as Laya.Camera;
        let windsock = scene.getChildByName("aircraft-A-A").getChildByName("Plane") as Laya.Sprite3D;


        this.on(Laya.Event.MOUSE_DOWN, this, () => {
            this.mouseLastX = Laya.stage.mouseX;

        });

        this.on(Laya.Event.MOUSE_MOVE, this, () => {

            let delta = Laya.stage.mouseX - this.mouseLastX;
            this.cam.transform.localRotationEulerY += delta * 0.15;
            this.mouseLastX = Laya.stage.mouseX;
        });

        this.doBtn.on(Laya.Event.MOUSE_DOWN, this, () => {
            this.windsockRoting = true;
        });

        this.doBtn.on(Laya.Event.MOUSE_UP, this, () => {
            this.windsockRoting = false;
        });

        Laya.timer.frameLoop(1, this, () => {

            if (!this.windsockRoting) return;
            if (null == windsock) return;
            windsock.transform.localRotationEulerZ -= Laya.timer.delta * 100;

        }, null, false);
    }
}