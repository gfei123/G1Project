import GameUtils from "../Util/GameUtils";
import BaseView from "./BaseView";

export default class Joystick3DCtrlView extends BaseView {
    bgBox: Laya.Box;

    ctrlBack: Laya.Sprite;
    ctrlRocker: Laya.Sprite;
    ctrlRockerMove: Laya.Sprite;


    canMove: boolean;

    speedX: number = 0;
    speedY: number = 0;
    speedFactor: number = 0.1;
    hitResults:Array<Laya.HitResult> = new Array<Laya.HitResult>();

    onAwake() {

        super.onAwake();


        // 适配
        this.bgBox.height = Laya.stage.height - (this.bgBox.top ? this.bgBox.top : 0)
            - (this.bgBox.bottom ? this.bgBox.bottom : 0);

        Laya.Scene3D.load("scene3d/LayaScene_MoveCtrler/Conventional/MoveCtrler.ls",
            Laya.Handler.create(this, this.onLoadSceneComplete));

    }

    onLoadSceneComplete(scene3d: Laya.Scene3D) {
        this.bgBox.visible = false;
        this.addChildAt(scene3d, 0);
        let cam = scene3d.getChildByName("Main Camera") as Laya.Camera;
        let cube = scene3d.getChildByName("Cube") as Laya.Sprite3D;



        this.ctrlBack.pivot(this.ctrlBack.width / 2, this.ctrlBack.height / 2);

        this.ctrlRockerMove.pivot(this.ctrlRockerMove.width / 2, this.ctrlRockerMove.height / 2);
        this.ctrlRockerMove.visible = false;

        let backRadius = this.ctrlBack.width / 2;
        let originalPos = new Laya.Point(150, Laya.stage.height - 150);
        this.ctrlBack.pos(originalPos.x, originalPos.y);


        this.on(Laya.Event.MOUSE_DOWN, this, () => {
            let mouseX = Laya.stage.mouseX;
            let mouseY = Laya.stage.mouseY;
            if (mouseX <= Laya.stage.width / 1.5 && mouseY >= Laya.stage.height / 2) {
                this.ctrlBack.pos(mouseX, mouseY);
                this.canMove = true;
            }
        });



        this.on(Laya.Event.MOUSE_MOVE, this, () => {
            let mouseX = Laya.stage.mouseX;
            let mouseY = Laya.stage.mouseY;

            if (this.canMove) {
                this.ctrlRocker.visible = false
                this.ctrlRockerMove.visible = true
                let ang = Math.atan2(mouseY - this.ctrlBack.y, mouseX - this.ctrlBack.x);
                let d = GameUtils.Distance(mouseX, mouseY, this.ctrlBack.x, this.ctrlBack.y)
                if (d <= (this.ctrlBack.width / 2)) {
                    this.ctrlRockerMove.pos(mouseX, mouseY);
                } else {

                    this.ctrlRockerMove.pos(
                        this.ctrlBack.x + backRadius * Math.cos(ang),
                        this.ctrlBack.y + backRadius * Math.sin(ang));
                }
                // 设置角度
                let targetRot = ang * 180 / Math.PI;
                cube.transform.localRotationEulerY = -90 - targetRot;
                // 设置速度
                let force = (Math.min(d, backRadius) / backRadius);
                this.speedX = force * Math.cos(ang);
                this.speedY = force * Math.sin(ang);
            }


        })

        this.on(Laya.Event.MOUSE_UP, this, () => {
            this.ctrlBack.pos(originalPos.x, originalPos.y);
            this.ctrlRocker.visible = true
            this.ctrlRockerMove.visible = false
            this.speedX = 0;
            this.speedY = 0;
            this.canMove = false;

        });

        Laya.timer.frameLoop(1, this, () => {
            if (!this.canMove) return;

            // 要移动到的下一个点
            let nextPosX = cube.transform.position.x - this.speedX * this.speedFactor;
            let nextPosZ = cube.transform.position.z - this.speedY * this.speedFactor;

            // 射线检测，如果检测前方是地面，则移动主角
            let rayFrom = new Laya.Vector3(nextPosX, -100, nextPosZ);
            let rayTo = new Laya.Vector3(nextPosX, 100, nextPosZ);
            scene3d.physicsSimulation.raycastAllFromTo(rayFrom, rayTo, this.hitResults);
            if(this.hitResults.length > 0)
            {
                let hitPlane = false;
                for (var i:number = 0, n:number = this.hitResults.length; i < n; i++)
                {
                    if(this.hitResults[i].collider.owner.name == "Plane")
                    {
                        hitPlane = true;
                        break;
                    }
                }
                if(hitPlane)
                {
                    cube.transform.position = new Laya.Vector3(nextPosX, cube.transform.position.y, nextPosZ);
                }
            }
        });
    }

}