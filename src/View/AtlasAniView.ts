import GameUtils from "../Util/GameUtils";
import BaseView from "./BaseView";

export default class AtlasAniView extends BaseView {
    ani: Laya.Animation;
    spawnAtlas: string = "res/atlas/PlayerSpawn.atlas";
    idleAtlas: string = "res/atlas/PlayerIdle.atlas";
    runAtlas: string = "res/atlas/PlayerRun.atlas";
    doBtn: Laya.Button;

    onAwake() {
        super.onAwake();

        Laya.loader.load([this.spawnAtlas, this.idleAtlas, this.runAtlas], Laya.Handler.create(this, this.onLoadComplete), null, Laya.Loader.ATLAS);

    }

    onLoadComplete() {

        this.ani.loadAtlas(this.spawnAtlas, null, "spawn");
        this.ani.loadAtlas(this.idleAtlas, null, "idle");
        this.ani.loadAtlas(this.runAtlas, null, "run");

        this.ani.interval = 40;
        this.ani.play(0, false, "spawn");
        this.ani.on(Laya.Event.COMPLETE, this, () => {
            this.ani.offAll();
            this.ani.play(0, true, "idle");
            
            this.doBtn.on(Laya.Event.MOUSE_DOWN, this, () => {
                this.ani.play(0, true, "run");
            });
            this.doBtn.on(Laya.Event.MOUSE_UP, this, () => {
                this.ani.play(0, true, "idle");
            });
        });
    }
}