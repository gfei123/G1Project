export default class ViewMgr
{
    static ShowView(url:string, root:Laya.Node)
    {
        Laya.Scene.load(url, Laya.Handler.create(this, (sceneObj)=>
        {
            root.addChild(sceneObj);
        }));
    }
}