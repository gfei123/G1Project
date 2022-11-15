import GameUtils from "../Util/GameUtils";
import BaseView from "./BaseView";

export default class PrefabAniView extends BaseView {
    bgBox: Laya.Box;
    onAwake() {
        super.onAwake();

        Laya.Scene3D.load("scene3d/LayaScene_PrefabScene/Conventional/PrefabScene.ls",
            Laya.Handler.create(this, this.onLoadSceneComplete));

        this.bgBox.height = Laya.stage.height - (this.bgBox.top ? this.bgBox.top : 0)
            - (this.bgBox.bottom ? this.bgBox.bottom : 0);
    }

    onLoadSceneComplete(scene3D: Laya.Scene3D) {
        this.bgBox.visible = false;
        this.addChildAt(scene3D, 0);
        let cube = scene3D.getChildByName("Cube") as Laya.Sprite3D;
        let cam = scene3D.getChildByName("Main Camera") as Laya.Camera;
        

        this.on(Laya.Event.MOUSE_DOWN, this, ()=>{
            let obj = Laya.Pool.getItemByCreateFun("cube", ()=>{
                return Laya.Sprite3D.instantiate(cube, cube.parent);
            }, this) as Laya.Sprite3D;
            obj.active =true;
            let targetPos = GameUtils.ScreenToWorld(cam, new Laya.Vector3(Laya.stage.mouseX, Laya.stage.mouseY, -10));
            obj.active = true;
            obj.transform.position = targetPos;

            Laya.timer.once(2000, this, ()=>{
                obj.active = false;
                Laya.Pool.recover("cube", obj);
            });
        });
      
    }

    onDestroy()
    {
        Laya.Pool.clearBySign("cube");   
    }
}