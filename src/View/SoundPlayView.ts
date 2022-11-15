import BaseView from "./BaseView";

export default class FontNumView extends BaseView {
    soundBtn:Laya.Button;
    musicBtn:Laya.Button;

    soundVol:Laya.Slider;
    musicVol:Laya.Slider;

    onAwake()
    {
        super.onAwake();
        this.soundBtn.on(Laya.Event.CLICK, this, ()=>{
            Laya.SoundManager.playSound("sounds/sound.wav", 1);
        });

        this.musicBtn.on(Laya.Event.CLICK, this, ()=>{
            console.log("play music");
            Laya.SoundManager.playMusic("sounds/bgm.wav", -1, Laya.Handler.create(this,()=>{
                console.log("播放完了");
            }));

        });
        
        this.musicVol.on(Laya.Event.CHANGE, this, ()=>{
            Laya.SoundManager.setMusicVolume(this.musicVol.value/100);
        });
        this.musicVol.value = Laya.SoundManager.musicVolume*100;


        this.soundVol.on(Laya.Event.CHANGE, this, ()=>{
            Laya.SoundManager.setSoundVolume(this.soundVol.value/100);
        });
        this.soundVol.value = Laya.SoundManager.soundVolume*100;
    }
}

