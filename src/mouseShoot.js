class mouseShoot
{
    constructor(InitialPosition)
    {
        this.image = graphicAssets.Shoot.image;
        this.initialPosition = InitialPosition;
        this.position = {};
        [this.position.x, this.position.y] = [InitialPosition.x, InitialPosition.y];
        
        this.pivot = {
            x: this.image.width / 2,
            y: this.image.height / 2
        };
        this.speed = 200;
    }

    Update(deltaTime)
    {
        this.position.x =Input.mouse.x;
        this.position.y =Input.mouse.y;
    }
    Draw(ctx)
    {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.scale(0.3,0.3);
        ctx.drawImage(this.image, -this.pivot.x, -this.pivot.y);
        ctx.restore();
    }
}