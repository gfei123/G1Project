import GameUtils from "../Util/GameUtils";
import BaseView from "./BaseView";

export default class PrefabAniView extends BaseView {

    bgBox: Laya.Box;

    onAwake() {
        super.onAwake();

        Laya.Scene3D.load("scene3d/LayaScene_ParticleScene/Conventional/ParticleScene.ls",
            Laya.Handler.create(this, this.onLoadSceneComplete));

        this.bgBox.height = Laya.stage.height - (this.bgBox.top ? this.bgBox.top : 0)
            - (this.bgBox.bottom ? this.bgBox.bottom : 0);
    }

    onLoadSceneComplete(scene3D: Laya.Scene3D) {
        console.log("onLoadSceneComplete");
        this.bgBox.visible = false;
        this.addChildAt(scene3D, 0);
        let cam = scene3D.getChildByName("Main Camera") as Laya.Camera;
        let ptc = scene3D.getChildByName("Particle") as Laya.Sprite3D;
        if (null != ptc) {
            this.on(Laya.Event.MOUSE_DOWN, this, () => {
                let targetPos = GameUtils.ScreenToWorld(cam, new Laya.Vector3(Laya.stage.mouseX, Laya.stage.mouseY, -10));
                ptc.transform.position = targetPos;
            });

            this.on(Laya.Event.MOUSE_MOVE, this, () => {
                let targetPos = GameUtils.ScreenToWorld(cam, new Laya.Vector3(Laya.stage.mouseX, Laya.stage.mouseY, -10));
                ptc.transform.position = targetPos;
            });
        }

    }
}
