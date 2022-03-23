class PlayerShop
{
    constructor(Player)
    {
        this.player=Player;
        //this.image=;

        this.FirstItem=null;
        this.SecondItem=null;
        this.ThirdItem=null;

        this.FirstItemCost=null;
        this.SecondItemCost=null;
        this.ThirdItemCost=null;

        this.FirstItemAvaliable=true;
        this.SecondItemAvaliable=true;
        this.ThirdItemAvaliable=true;

    }

    Draw(ctx)
    {
        ctx.save();
        if(this.player.IsOverShop==true)
        {
            //Canvas Tienda
            ctx.fillStyle ="rgba(0,0,0,1)";
            ctx.fillRect(this.player.position.x-95, this.player.position.y-225, 210, 160);

            ctx.fillStyle ="rgba(255,255,255,1)";
            ctx.fillRect(this.player.position.x-90, this.player.position.y-220, 200, 150);
            ctx.fillStyle = "black";
            ctx.font = "25px Times New Roman";
            ctx.fillText('TIENDA', this.player.position.x-30, this.player.position.y-190);
    
            //canvas de tienda
            if(this.player.score>= this.FirstItemCost && this.FirstItemAvaliable==true)
            {
                ctx.fillStyle = "black";
                ctx.font = "15px Times New Roman";
                ctx.fillText('1-'+this.FirstItem, this.player.position.x-80, this.player.position.y-150);

                ctx.fillText(this.FirstItemCost+"pts", this.player.position.x+75, this.player.position.y-150);
            }
            else
            {
                ctx.fillStyle = "red";
                ctx.font = "15px Times New Roman";
                ctx.fillText('1-'+this.FirstItem, this.player.position.x-80, this.player.position.y-150);
                ctx.fillText(this.FirstItemCost+"pts", this.player.position.x+75, this.player.position.y-150);
            }

            
            if(this.player.score>= this.SecondItemCost && this.SecondItemAvaliable==true)
            {
                ctx.fillStyle = "black";
                ctx.font = "15px Times New Roman";
                ctx.fillText('2-'+this.SecondItem, this.player.position.x-80, this.player.position.y-120);
                ctx.fillText(this.SecondItemCost+"pts", this.player.position.x+75, this.player.position.y-120);
            }
            else
            {
                ctx.fillStyle = "red";
                ctx.font = "15px Times New Roman";
                ctx.fillText('2-'+this.SecondItem, this.player.position.x-80, this.player.position.y-120);
                ctx.fillText(this.SecondItemCost+"pts", this.player.position.x+75, this.player.position.y-120);
            }


            if(this.player.score>=this.ThirdItemCost && this.ThirdItemAvaliable==true)
            {
                ctx.fillStyle = "black";
                ctx.font = "15px Times New Roman";
                ctx.fillText('3-'+this.ThirdItem, this.player.position.x-80, this.player.position.y-90);
                ctx.fillText(this.ThirdItemCost+"pts", this.player.position.x+75, this.player.position.y-90);
            }
            else
            {
                ctx.fillStyle = "red";
                ctx.font = "15px Times New Roman";
                ctx.fillText('3-'+this.ThirdItem, this.player.position.x-80, this.player.position.y-90);
                ctx.fillText(this.ThirdItemCost+"pts", this.player.position.x+75, this.player.position.y-90);
            }
        }
        ctx.restore();
    }
}