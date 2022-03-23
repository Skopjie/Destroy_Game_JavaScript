class Nube
{
    constructor()
    {

        this.image=graphicAssets.Nube.image;
        this.numOfClouds=3;
        this.positionsClouds={x:Math.random() * (600 -310 ) + -310, y:Math.random() * (250 -50 ) + 50};
        
        this.speedClouds=null;

        this.maxSpeed=15;
        this.minSpeed=5;

    }
    Start()
    {
        this.speedClouds=Math.random() * (this.maxSpeed - this.minSpeed ) + this.minSpeed;
    }
    Update(deltaTime)
    {
        this.positionsClouds.x+=this.speedClouds*deltaTime;
        if(this.positionsClouds.x>canvas.width-500)
        {
            this.positionsClouds.x=-250;
            this.positionsClouds.y=Math.random() * (225 -50 ) + 50;
        }
    }
    Draw(ctx)
    {
        ctx.save();
        ctx.scale(1,1);
        ctx.translate(this.positionsClouds.x, this.positionsClouds.y);
        ctx.drawImage(graphicAssets.Nube.image,this.positionsClouds.x, this.positionsClouds.y);
        ctx.restore();
    }
}