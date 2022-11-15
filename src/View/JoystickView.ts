import GameUtils from "../Util/GameUtils";
import BaseView from "./BaseView";

export default class JoystickView extends BaseView {
    ctrlBack: Laya.Sprite;
    ctrlRocker: Laya.Sprite;
    ctrlRockerMove: Laya.Sprite;

    avatar: Laya.Sprite;
    canMove:boolean;

    speedX: number = 0;
    speedY: number = 0;
    speedFactor: number = 2;

    onAwake() {

        super.onAwake();
        
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
                this.canMove=true;
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
                let targetRot = ang * 180 / Math.PI
                let force = (Math.min(d, backRadius) / backRadius);
                //this.infoLbl.text = "角度:" + targetRot.toFixed(1) + ", 大小: " + (Math.min(d, backRadius) / backRadius).toFixed(2);
                // 速度
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
            if(!this.canMove) return;
            // 移动主角
            this.avatar.x += this.speedX * this.speedFactor;
            this.avatar.y += this.speedY * this.speedFactor;
        });
    }

}