class Explosion
{
    constructor()
    {
        this.position=null;
        this.animation=null;

        this.active=false;

        this.contador=0;
        this.timeExplosion=0.2;
    }

    Start()
    {
        this.animation = new SSAnimation(graphicAssets.explosion.image, 150.875, 151.25, [8,8,8,8], 1/88);
    }

    Update(deltaTime)
    {
        if(this.active==true)
        {
            this.animation.Update(deltaTime);
            this.contador+=deltaTime;
            if(this.contador>=this.timeExplosion)
            {
                this.contador=0;
                this.active=false;
            }
        }
    }
    Draw(ctx)
    {
        if(this.active==true)
        {
            ctx.save();
            ctx.translate(this.position.x,this.position.y);
            ctx.scale(0.5,0.5);
            this.animation.Draw(ctx);
            ctx.restore();
        }
    }
}