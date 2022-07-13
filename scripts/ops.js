const sections = $(".section");
const display = $(".maincontent");
const sideMenu = $(".fixed-menu");
const menuItems = sideMenu.find(".fixed-menu__item");

const mobileDetect = new MobileDetect(window.navigator.userAgent);

const isMobile = mobileDetect.mobile();


let inScroll = false;

sections.first().addClass("active");

const countSectionPosition = (sectionEq) =>{
    const position = sectionEq* -100;
    if(isNaN(position)){
        console.error('неверный параметр,ошибка в расчётах countSectionPosition()');
        return 0;
    }
    return position
}

const changeMenuThemeForSection = (sectionEq) =>{
    const currentSection = sections.eq(sectionEq);
    const menuTheme = currentSection.attr("data-sidemenu-theme");

    if(menuTheme==="def")
    {
        sideMenu.removeClass("fixed-menu--shadowed");
    }
    if(menuTheme==="white"){
        sideMenu.addClass("fixed-menu--shadowed");
    }
}

const resetActiveClassForItem = (items,itemEq,activeClass)=>{
    items.eq(itemEq).addClass(activeClass).siblings().removeClass(activeClass);
}

const performTransition = sectionEq=>{
    if(inScroll) return;
    const trasitionOver =1000;
    const mouseInertialOver=300;
        inScroll=true;
        const position = countSectionPosition(sectionEq);

        changeMenuThemeForSection(sectionEq);


        
        display.css({
            Transform:`translateY(${position}%)`
        });

        resetActiveClassForItem(sections,sectionEq,"active");
        
        setTimeout(()=>{
            inScroll=false;
            resetActiveClassForItem(menuItems,sectionEq,"fixed-menu__item--active");
            

        },trasitionOver+mouseInertialOver);
        
    
}

const viewportScroller = ()=>{
    const activeSection = sections.filter(".active");
    const nextSection = activeSection.next();
    const prevSection = activeSection.prev();

    return {
        next(){
            performTransition(nextSection.index());
        },
        prev(){
            performTransition(prevSection.index());
        }
    }

}

$(window).on("wheel",e=>{
    const deltaY=e.originalEvent.deltaY;

    const scroller = viewportScroller();

    if(deltaY>0){
        scroller.next()
        
    }

    if(deltaY<0){
        scroller.prev();
    }
});

$(window).on("keydown", e=>{
    const tagName = e.target.tagName.toLowerCase();
    const scroller = viewportScroller();
    const userTypingInInputs=tagName=="input" || tagName=="textarea";

    if(userTypingInInputs) return;
    
    switch(e.keyCode){
        case 38:
            scroller.prev();
            break;
        case 40:
            scroller.next()
            break;
    }
    
});

$("[data-scroll-to]").click(e=>{
    e.preventDefault();

    const $this = $(e.currentTarget);
    const target = $this.attr("data-scroll-to");
    const reqSection = $(`[data-section-id=${target}]`);

    performTransition(reqSection.index());

})

if(isMobile){
$(".wrapper").on("touchmove", e=>e.preventDefault());


$("body").swipe( {
    //Generic swipe handler for all directions
    swipe:function(event, direction) {
        const scroller = viewportScroller();
        let scrollDirection="";
        if(direction==="up") scrollDirection="next";
        if(direction==="down") scrollDirection="prev";

        scroller[scrollDirection]();
        
    }
  });
}