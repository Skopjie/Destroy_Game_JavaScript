class Shop
{
    constructor(Player,canvasPlayer)
    {
        this.player=Player;
        this.myCanvasPlayer=canvasPlayer;

        this.image=graphicAssets.Tienda.image;

        this.pivot = {
            x: this.image.width / 2,
            y: this.image.height / 2
        }

        this.collider={
            position:{
                x:0,
                y:0
            },
            radious:0
        };
        this.position = { x: 600, y: canvas.height-135 };

        //items de tienda
        this.AllItemsShop=["Mas Daño","Recarga Mas Rapida","Mas Vida","Mas Velocidad","Mas Salto"];
        this.AllItemsShopCost=[10,12,15,10,5];

        this.FirstItem=null;
        this.SecondItem=null;
        this.ThirdItem=null;

        this.FirstItemCost=null;
        this.SecondItemCost=null;
        this.ThirdItemCost=null;

        this.FirstItemAvaliable=true;
        this.SecondItemAvaliable=true;
        this.ThirdItemAvaliable=true;

        this.ShopClosed=false;

        this.BuySound=null;
        this.BuySoundNoDisponible=null;


    }
    Start()
    {
        this.BuySound=audio.playerBuy;
        this.BuySound.volume=0.2;

        this.BuySoundNoDisponible=audio.ShopOff;
        this.BuySoundNoDisponible.volume=0.2;
        

        var i=Math.floor(Math.random() * this.AllItemsShop.length); 
        
        this.FirstItem=this.AllItemsShop[i];
        this.FirstItemCost=this.AllItemsShopCost[i];

        i=Math.floor(Math.random() * this.AllItemsShop.length); 

        this.SecondItem=this.AllItemsShop[i];
        this.SecondItemCost=this.AllItemsShopCost[i];

        i=Math.floor(Math.random() * this.AllItemsShop.length); 

        this.ThirdItem=this.AllItemsShop[i];
        this.ThirdItemCost=this.AllItemsShopCost[i];
        
        this.collider.position.x=this.image.width/3;
        this.collider.position.y=this.image.height/3;
        this.collider.radious=Math.sqrt(
            (this.collider.position.x * this.collider.position.x)+
            (this.collider.position.y * this.collider.position.y));


    }
    Update(deltaTime)
    {
        this.collider.position.x=this.position.x;
        this.collider.position.y=this.position.y;

        //sistema de tienda y compras de items
        if(this.ShopClosed==false)
        {
            if(Math.sqrt(((this.player.collider.position.x-this.collider.position.x)*(this.player.collider.position.x-this.collider.position.x))+
            ((this.player.collider.position.y-this.collider.position.y)*(this.player.collider.position.y-this.collider.position.y)))  <=(this.player.collider.radious+this.collider.radious) &&this.player.GameOver==false )
            {
                this.player.ActiveShopCanvas();
                this.player.IsOverShop=true;
                this.myCanvasPlayer.FirstItem=this.FirstItem;
                this.myCanvasPlayer.SecondItem=this.SecondItem;
                this.myCanvasPlayer.ThirdItem=this.ThirdItem;

                this.myCanvasPlayer.FirstItemCost=this.FirstItemCost;
                this.myCanvasPlayer.SecondItemCost=this.SecondItemCost;
                this.myCanvasPlayer.ThirdItemCost=this.ThirdItemCost;

                
                this.myCanvasPlayer.FirstItemAvaliable=this.FirstItemAvaliable;
                this.myCanvasPlayer.SecondItemAvaliable=this.SecondItemAvaliable;
                this.myCanvasPlayer.ThirdItemAvaliable=this.ThirdItemAvaliable;

                //item 1 disponible
                if (Input.IsKeyDown(KEY_1) &&this.FirstItemAvaliable==true&&this.player.score>=this.FirstItemCost)
                {
                    if (Input.IsKeyDown(KEY_1))
                    {
                        this.BuySound.currentTime=0;
                        this.BuySound.play();
                        this.player.score -=this.FirstItemCost;
                        this.FirstItemAvaliable=false;
    
                        //todos los casos de items
                        switch(this.FirstItem)
                        {
                            case "Mas Daño":
                                for(var i=0;i<this.player.bulletPool.bulletArray.length;i++)
                                {
                                    if(this.player.bulletPool.bulletArray[i].damage<9)
                                    this.player.bulletPool.bulletArray[i].damage+=1;
                                   
                                }
                               
                            break;
    
                            case "Recarga Mas Rapida":
                                if(this.player.cadenciaTiro>0.3)
                                this.player.cadenciaTiro-=0.1;
                               
                            break;
                                
                            case "Mas Vida":
                                if(this.player.health<this.player.maxHealth)
                                {
                                    this.player.health++;
                                   
                                }   
                                else
                                {
                                    if(this.player.maxHealth<9)
                                    {
                                        this.player.maxHealth++;
                                        this.player.health++;
                                      
                                    }
                                }     
                            break;   
                            
                            case "Mas Velocidad":
                                if(this.player.maxHorizontalVel<9)
                                {
                                    this.player.maxHorizontalVel++;
                                }
                               
                            break;
                            
                            case "Mas Salto":
                                if(this.player.maxVerticalVel<18)
                                {
                                    this.player.maxVerticalVel++;
                                }
                                
                            break;
                        }
                    }
 
                }
                //item 1 no disponible
                else if(Input.IsKeyDown(KEY_1) &&this.FirstItemAvaliable==false||Input.IsKeyDown(KEY_1)&&this.player.score<this.FirstItemCost)
                {
                    this.BuySoundNoDisponible.currentTime=0;
                    this.BuySoundNoDisponible.play();
                }

                 //item 2 disponible
                if (Input.IsKeyDown(KEY_2) &&this.SecondItemAvaliable==true&&this.player.score>=this.SecondItemCost)
                {
                   
                    if (Input.IsKeyDown(KEY_2))
                    {
                        this.BuySound.currentTime=0;
                        this.BuySound.play();
                        this.player.score -=this.SecondItemCost;
                        this.SecondItemAvaliable=false;
    
                         //item 2 seleccion
                        switch(this.SecondItem)
                        {
                            case "Mas Daño":
                                for(var i=0;i<this.player.bulletPool.bulletArray.length;i++)
                                {
                                    if(this.player.bulletPool.bulletArray[i].damage<9)
                                    this.player.bulletPool.bulletArray[i].damage+=1;
                                   
                                }
                               
                            break;
    
                            case "Recarga Mas Rapida":
                                if(this.player.cadenciaTiro>0.3)
                                this.player.cadenciaTiro-=0.1;
                               
                            break;
                                
                            case "Mas Vida":
                                if(this.player.health<this.player.maxHealth)
                                {
                                    this.player.health++;
                                    
                                }   
                                else
                                {
                                    if(this.player.maxHealth<9)
                                    {
                                        this.player.maxHealth++;
                                        this.player.health++;
                                        
                                    }
                                }     
                            break;   
                            
                            case "Mas Velocidad":
                                if(this.player.maxHorizontalVel<9)
                                {
                                    this.player.maxHorizontalVel++;
                                }
                                
                            break;
                            
                            case "Mas Salto":
                                if(this.player.maxVerticalVel<18)
                                {
                                    this.player.maxVerticalVel++;
                                }
                                
                            break;
                        }
                    }
                    
                }
                 //item 2 no disponible
                else if(Input.IsKeyDown(KEY_2) &&this.SecondItemAvaliable==false||Input.IsKeyDown(KEY_2)&&this.player.score<this.SecondItemCost)
                {
                    this.BuySoundNoDisponible.currentTime=0;
                    this.BuySoundNoDisponible.play();
                }

                 //item 3 disponible
                if (Input.IsKeyDown(KEY_3) &&this.ThirdItemAvaliable==true&&this.player.score>=this.ThirdItemCost)
                {
                    
                    if (Input.IsKeyDown(KEY_3))
                    {
                        this.BuySound.currentTime=0;
                        this.BuySound.play();
                        this.player.score -=this.ThirdItemCost;
                        this.ThirdItemAvaliable=false;
    
                        switch(this.ThirdItem)
                        {
                            case "Mas Daño":
                                for(var i=0;i<this.player.bulletPool.bulletArray.length;i++)
                                {
                                    if(this.player.bulletPool.bulletArray[i].damage<9)
                                    this.player.bulletPool.bulletArray[i].damage+=1;
                                   
                                }
                            break;
    
                            case "Recarga Mas Rapida":
                                if(this.player.cadenciaTiro>0.3)
                                this.player.cadenciaTiro-=0.1;
                            break;
                                
                            case "Mas Vida":
                                if(this.player.health<this.player.maxHealth)
                                {
                                    this.player.health++;
                                }   
                                else
                                {
                                    if(this.player.maxHealth<9)
                                    {
                                        this.player.maxHealth++;
                                        this.player.health++;
                                    }
                                }     
                            break;   
                            
                            case "Mas Velocidad":
                                if(this.player.maxHorizontalVel<9)
                                {
                                    this.player.maxHorizontalVel++;
                                }
                            break;
                            
                            case "Mas Salto":
                                if(this.player.maxVerticalVel<18)
                                {
                                    this.player.maxVerticalVel++;
                                }
                            break;
                        }
                    }
                }
                //item 3 no disponible
                else if(Input.IsKeyDown(KEY_3) &&this.ThirdItemAvaliable==false||Input.IsKeyDown(KEY_3)&&this.player.score<this.ThirdItemCost)
                {
                    this.BuySoundNoDisponible.currentTime=0;
                    this.BuySoundNoDisponible.play();
                }
                
            }
            else{
                this.player.IsOverShop=false;
            }
        }
        else{
            this.player.IsOverShop=false;
        }

    } 
    Draw(ctx)
    {
        ctx.save();

        ctx.translate(this.position.x, this.position.y);
        ctx.scale(0.6, 0.6);

        ctx.drawImage(this.image, -this.pivot.x, -this.pivot.y);
        ctx.restore();
    }

    //cambiar items de tienda
    ChangeItemShop()
    {
        var i=Math.floor(Math.random() * this.AllItemsShop.length); 
        
        this.FirstItem=this.AllItemsShop[i];
        this.FirstItemCost=this.AllItemsShopCost[i];

        i=Math.floor(Math.random() * this.AllItemsShop.length); 

        this.SecondItem=this.AllItemsShop[i];
        this.SecondItemCost=this.AllItemsShopCost[i];

        i=Math.floor(Math.random() * this.AllItemsShop.length); 
        
        this.ThirdItem=this.AllItemsShop[i];
        this.ThirdItemCost=this.AllItemsShopCost[i];


        this.FirstItemAvaliable=true;
        this.SecondItemAvaliable=true;
        this.ThirdItemAvaliable=true;
    }
}
