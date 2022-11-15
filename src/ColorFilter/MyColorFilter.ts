import GameUtils from "../Util/GameUtils";

/**
 * 颜色过滤器
 */
export default class MyColorFilter extends Laya.Script
{
	/** @prop {name:colorFilter, tips:"颜色", type:Color}*/
	colorFilter:string = "#ffffff";

    onAwake()
    {
		let color = GameUtils.ColorStringToRGB(this.colorFilter);
        //由 20 个项目（排列成 4 x 5 矩阵）组成的数组，红色
		let mat = [
			color.r/255, 0, 0, 0, 0, // R
			0, color.g/255, 0, 0, 0, // G
			0, 0, color.b/255, 0, 0, // B
			0, 0, 0, color.a/255, 0  // A
		];
		//创建一个颜色滤镜对象,红色
		let f = new Laya.ColorFilter(mat);
		let spr = this.owner as Laya.Sprite;
		spr.filters = [f];
    }
}