

function closeEvery(items,curItem)
{
    items.not(curItem).removeClass("active");
    items.not(curItem).width(0);
}


$(".color__name").click(e=>{
    const allContent=$(".colors__content");

    const $this=$(e.currentTarget);
   

    const winWidth=$(window).width();
    const needWidth= winWidth - ($this.width() * 3);


    const curContent=$this.siblings(".colors__content");
    //console.log(curContent);

    closeEvery(allContent,curContent);
    
    if(!curContent.hasClass("active")){
        curContent.addClass("active");
        if(winWidth<768){
            curContent.width(needWidth);
        }
    } else{
        curContent.removeClass("active");
        curContent.width(0);
    }
/*
    if(!$this.hasClass("active")){
        $this.addClass("active");
    } else{
        $this.removeClass("active");
    }
*/
})