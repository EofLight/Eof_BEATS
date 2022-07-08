

function closeEvery(items,curItem)
{
    items.not(curItem).removeClass("active");
}


$(".color__name").click(e=>{
    const allContent=$(".colors__content");
    console.log(allContent);

    const $this=$(e.currentTarget);
    console.log($this);

    const winWidth=$("window").width();
    const needWidth=winWidth - $this.width() * 3;

    const curContent=$this.siblings(".colors__content");
    console.log(curContent);

    closeEvery(allContent,curContent);
    
    if(!curContent.hasClass("active")){
        curContent.addClass("active");
        if(winWidth<768){
            curContent.width(needWidth);
        }
    } else{
        curContent.removeClass("active");
    }
/*
    if(!$this.hasClass("active")){
        $this.addClass("active");
    } else{
        $this.removeClass("active");
    }
*/
})