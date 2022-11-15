import GameUtils from "../Util/GameUtils";
import BaseView from "./BaseView";

export default class RayCastToMoveView extends BaseView {
    bgBox: Laya.Box;
    ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, -2, 0));
    hitResult = new Laya.HitResult();
    moveDir: Laya.Vector3 = new Laya.Vector3;
    moveSpeed: number = 0.01;

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

        let canMove = false;
        this.on(Laya.Event.MOUSE_DOWN, this, () => {
            canMove = false;
            //从屏幕空间生成射线
            var point = new Laya.Vector2();
            point.x = Laya.MouseManager.instance.mouseX;
            point.y = Laya.MouseManager.instance.mouseY;

            cam.viewportPointToRay(point, this.ray);

            //物理射线与碰撞器相交检测
            scene3d.physicsSimulation.rayCast(this.ray, this.hitResult);
        });

        let nextPos = new Laya.Vector3;
        let deltaVector = new Laya.Vector3;
        let curMoveDir = new Laya.Vector3;
        Laya.timer.frameLoop(1, this, () => {
            if (!canMove) return;
            Laya.Vector3.subtract(this.hitResult.point, cube.transform.position, curMoveDir);

            if (Laya.Vector3.dot(this.moveDir, curMoveDir) > 0) {
                Laya.Vector3.scale(this.moveDir, Laya.timer.delta * this.moveSpeed, deltaVector);
                Laya.Vector3.add(cube.transform.position, deltaVector, nextPos);
                cube.transform.position = nextPos;
            }
            else {
                // 到达目的地
                cube.transform.position = this.hitResult.point;
                canMove = false;
            }


        });

        this.on(Laya.Event.MOUSE_UP, this, () => {
            if (!this.hitResult.succeeded) return;
            console.log("点中了: " + this.hitResult.collider.owner.name);
            if ("Plane" != this.hitResult.collider.owner.name) return;


            this.hitResult.point.y = cube.transform.position.y;
            Laya.Vector3.subtract(this.hitResult.point, cube.transform.position, this.moveDir);
            Laya.Vector3.normalize(this.moveDir, this.moveDir);

            // 让主角朝向移动的方向
            let lookAtPos = new Laya.Vector3();
            Laya.Vector3.add(cube.transform.position, new Laya.Vector3(-this.moveDir.x, 0, -this.moveDir.z), lookAtPos);
            cube.transform.lookAt(lookAtPos, new Laya.Vector3(0, 1, 0), false);

            canMove = true;
            // 测试，画线
            // let lineSprite = scene3d.addChild(new Laya.PixelLineSprite3D(1)) as Laya.PixelLineSprite3D;
            // let targetPos = new Laya.Vector3(0, 0, 0);
            // let targetDir = new Laya.Vector3(0, 0, 0);
            // Laya.Vector3.scale(this.ray.direction, 100, targetDir);
            // Laya.Vector3.add(this.ray.origin, targetDir, targetPos);
            // lineSprite.addLine(this.ray.origin, cube.transform.position, Laya.Color.RED, Laya.Color.RED);


            // 使用Tween移动
            // this.hitResult.point.y = cube.transform.position.y;
            // Laya.Tween.to(cube.transform, 
            //     {
            //         localPositionX: this.hitResult.point.x, 
            //         localPositionY: this.hitResult.point.y, 
            //         localPositionZ: this.hitResult.point.z 
            //     }, 
            //     1000);

            // 直接设置坐标
            // cube.transform.position = this.hitResult.point;
        });
    }
}