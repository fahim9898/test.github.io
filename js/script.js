$(document).ready(function (){
    
})
let bf;


var TxtRotate = function(el, toRotate, period, dealy, repeat=false) {
  this.toRotate = toRotate;
  this.el = el;
  this.dealy = dealy || 0;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.repeat = repeat;
  setTimeout(() => {
      this.tick();
  }, this.dealy);
  this.isDeleting = false;
};

TxtRotate.prototype.tick = function() {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = `<span class="wrap">${this.txt.split('').map(t=>'<span class="r">'+t+'</span>').join('')}</span></span>`;

  var that = this;
  var delta = 50 * 0.3;

  if (this.isDeleting) { delta /= 2; }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;

    if(!this.repeat) {
        this.el.classList.add('complete');
        return
    }

  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function() {
    that.tick();
  }, delta);
};

function testPosition() {
    let old = $('.r').first().position();
    $('.r').first().css({position:'absolute',top: 100, left:100});
}

let BlastEffect = function (className){
    this.className = className;
    this.elements = [];
    this.click_x = 0;
    this.click_y = 0;
    this.init();
    this.animation_count = 0;
    this.max_aniamtion = 200;
    this.destroyeComplete = function (){};
    this.restoreComplete = function (){};
    this.animeInterval = null;
}
BlastEffect.prototype.init = function () {
    let that = this;
    $(that.className).each((index, val)=>{
       let position = $(val).position();
       that.elements.push({
           el: $(val),
           start: position,
           current: position,
           force: 0,
           angle: 0
        })
    })
}

BlastEffect.prototype.applyForce = function (x, y){
    let force = Math.sqrt((x-this.click_x)**2 + (y-this.click_y)**2) * 0.005;  
    this.click_x =  x;
    this.click_y =  y;
    let that = this;
    
    this.elements.forEach(item=>{
        let diff_x = item.start.left - x;
        let diff_y = item.start.top - y;
        let angle = Math.atan(diff_x/diff_y);
        item.angle = angle;
        item.force = sign_(diff_y)*force;
    });
    clearInterval(that.animeInterval);
    that.animeInterval = setInterval(() => {
        that.animation_count++; 
        if(that.animation_count >= that.max_aniamtion - 300){
            $(that.className).addClass('fadeOut_cst2')
        }
        if(that.animation_count == that.max_aniamtion - 100){
            this.destroyeComplete();
        }
        if(that.animation_count >= that.max_aniamtion){
            clearInterval(that.animeInterval);
        }
        this.animation();
    }, 1000/60);
}

BlastEffect.prototype.destroyeAmimationComplete =  function (fn) {
    this.destroyeComplete = fn;
}
BlastEffect.prototype.restoteAmimationComplete =  function (fn) {
    this.restoreComplete = fn;
}

BlastEffect.prototype.restoreAnimation = function () {
    let that = this;
    this.elements.forEach(item=>{
        let force = Math.sqrt((item.current.top-item.start.top)**2 + (item.current.left-item.current.left)**2) * 0.005;  
        let diff_x = item.start.left - item.current.left;
        let diff_y = item.start.top - item.current.top;
        let angle = Math.atan(diff_x/diff_y);
        item.angle = angle;
        item.force = -1*sign_(diff_y)*force;
    });
    $(that.className).addClass('fadeIn_cst2')
    clearInterval(that.animeInterval);
    that.animation_count = 0;
    that.animeInterval = setInterval(() => {
        that.animation_count++; 
        if(that.animation_count >= that.max_aniamtion - 300){
            $(that.className).addClass('fadeOut_cst2')
        }
        if(that.animation_count == that.max_aniamtion - 100){
            this.restoreComplete();
        }
        if(that.animation_count >= that.max_aniamtion){
            clearInterval(that.animeInterval);
        }
        this.animation(true);
    }, 1000/60);
    
}

function sign_(val){
    if(val>=0){
        return 1;
    }
    return -1;
}

BlastEffect.prototype.animation =  function (reverse = false){
    let that = this;
    console.log('called')
    that.elements.forEach(item=>{
        let new_current;
        if(!reverse){
            new_current = {
                left: (item.current.left + sign_( Math.random() - 0.5) * (item.force * Math.sin(item.angle * Math.random())) ),
                top: (item.current.top + sign_( Math.random() - 0.5) *(item.force * Math.cos(item.angle * Math.random())) )
            }
        }else {    
            let force = Math.sqrt((item.current.top-item.start.top)**2 + (item.current.left-item.start.left)**2) * 0.1 * Math.random();
            let diff_x = item.start.left - item.current.left;
            let diff_y = item.start.top - item.current.top;
            item.force = -1*sign_(diff_y)*force;  
            new_current = {
                left: (item.current.left +  (-item.force * Math.sin(item.angle)) ),
                top: (item.current.top + (-item.force * Math.cos(item.angle)) )
            }
        }
        // console.log(new_current)
        item.current = new_current;
        $(item.el).css({position:'absolute',...new_current})        
    });
}


var css = document.createElement("style");
css.type = "text/css";
css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #62E1D2 } .complete > .wrap {border-right:0px;}";
document.body.appendChild(css);


let MouseEffect = function (id){
    this.id = id;

    let that = this;
    MouseEffect.fn.mouseMove(function (x, y){
        $(that.id).css({left:x-15+'px', top: y-70-15+'px', transition: 'all 0.5s linear'});
    });
}


MouseEffect.fn = {};
MouseEffect.fn.mouseMove = function (cb){
    document.onmousemove = function(e){
        mouseX = e.screenX;
        mouseY = e.screenY;
        // console.log(mouseX, mouseY, cb)
        cb(mouseX, mouseY);
    }
}

let MVF = MouseEffect('#circle__pointer__id');