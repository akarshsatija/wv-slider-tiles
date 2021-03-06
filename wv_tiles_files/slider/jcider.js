(function($){function getElementString(arr,content){if(content===undefined){content='';}
var tag='',classes='',id='',current='tag';for(var x=0;x<arr.length;x++){var ch=arr[x];if(ch==='.'){classes+=x>1?' ':'';current='class';continue;}else if(ch==='#'){current='id';continue;}
if(current==='tag'){tag+=ch;}else if(current==='class'){classes+=ch;}else if(current==='id'){id+=ch;}}
el='<'+tag;if(id!=='')el+=' id=\"'+id+'\"';if(classes!=='')el+=' class=\"'+classes+'\"';el+='>'+content+'</'+tag+'>';return el;}
function detectIE(){var ua=window.navigator.userAgent;var msie=ua.indexOf("MSIE ");var version=parseInt(ua.substring(msie+5,ua.indexOf(".",msie)));return(msie>0||!!navigator.userAgent.match(/Trident.*rv\:11\./))?true:false;}
function checkFallback(){if(!window.getComputedStyle){return false;}
var el=document.createElement('p'),check3d,check2d=[],transforms={'webkitTransform':'-webkit-transform','OTransform':'-o-transform','msTransform':'-ms-transform','MozTransform':'-moz-transform','transform':'transform'};document.body.insertBefore(el,null);for(var t in transforms){if(el.style[t]!==undefined){check2d.push();el.style[t]="translate3d(1px,1px,1px)";check3d=window.getComputedStyle(el).getPropertyValue(transforms[t]);}}
document.body.removeChild(el);if(check3d!==undefined&&check3d.length>0&&check3d!=='none')return'3d';else if(check2d.length>0)return'2d';else return false;}
$.fn.jcider=function(settings){var config=$.extend({looping:false,visibleSlides:1,variableWidth:false,variableHeight:true,fading:false,easing:'cubic-bezier(.694, .0482, .335, 1)',transitionDuration:400,autoplay:false,slideDuration:3000,controls:true,controlsWrapper:'div.jcider-nav',controlsLeft:['span.jcider-nav-left',''],controlsRight:['span.jcider-nav-right',''],pagination:true,paginationWrapper:'div.jcider-pagination',paginationPoint:'div.jcider-pagination-point'},settings);return this.each(function(){var $window=$(window),$wrapper=$(this),$slideWrap=$wrapper.children(),$slides=$slideWrap.children(),slideCount=$slides.length,$controls,$controlsLeft,$controlsRight,$pagination,$paginationPoints,$current,currentWidth,currentHeight,initPos=false,fallback=checkFallback(),ie=detectIE(),pause=false,offset=[];function calcWidth(){if(config.fading)return;var width=0;offset=[];for(var x=0;x<slideCount;x++){offset[x]=-width;$slides.eq(x).css('left',width);width+=$slides.eq(x).outerWidth(true);}}
function initControls(){var element=config.controlsWrapper.split('');$wrapper.append(getElementString(element));$controlsWrapper=$wrapper.find(config.controlsWrapper);$controlsWrapper.append(getElementString(config.controlsLeft[0].split(''),config.controlsLeft[1]));$controlsWrapper.append(getElementString(config.controlsRight[0].split(''),config.controlsRight[1]));$controlsLeft=$controlsWrapper.find(config.controlsLeft[0]);$controlsRight=$controlsWrapper.find(config.controlsRight[0]);if(config.pagination!==true){$controlsWrapper.hide();}}
function initPagination(){var pagWrap=getElementString(config.paginationWrapper.split(''));$wrapper.append(pagWrap);$pagination=$wrapper.find(config.paginationWrapper);var pagPoint=getElementString(config.paginationPoint.split(''));for(var x=0;x<Math.ceil(slideCount/config.visibleSlides);x++){$pagination.append(pagPoint);}
$paginationPoints=$pagination.children(config.paginationPoint);if(config.pagination!==true){$pagination.hide();}}
function transition(nextOffset){if(fallback==='3d'){$slideWrap.css({'-webkit-transform':'translate3d('+nextOffset+'px,0, 0)','-moz-transform':'translate3d('+nextOffset+'px,0, 0)','transform':'translate3d('+nextOffset+'px,0, 0)'});}else if(fallback==='2d'){$slideWrap.css({'-webkit-transform':'translate('+nextOffset+'px,0)','-moz-transform':'translate('+nextOffset+'px,0)','-ms-transform':'translate('+nextOffset+'px,0)','-o-transform':'translate('+nextOffset+'px,0)','transform':'translate('+nextOffset+'px,0)'});}else{$slideWrap.css({'left':nextOffset+'px'});}}
function moveTo(index){var start=index<0,last=index+config.visibleSlides===slideCount+1;if(!config.looping){if(start||last){return;}
if($controlsLeft.hasClass('disabled')){$controlsLeft.removeClass('disabled');}
if($controlsRight.hasClass('disabled')){$controlsRight.removeClass('disabled');}
if(index===0){$controlsLeft.addClass('disabled');}else if(index+config.visibleSlides>=slideCount){$controlsRight.addClass('disabled');}}
var $prev;if(initPos){$prev=$slides.filter('.active');if($prev.index()===index)return;$prev.removeClass('active');if(config.pagination){$paginationPoints.filter('.active').removeClass('active');}}
if(last){index=0;}else if(start||index+config.visibleSlides>slideCount){index=slideCount-config.visibleSlides;}
$current=$slides.eq(index);if(config.visibleSlides===1){if(config.variableHeight){currentHeight=$current.height();$wrapper.css({'height':currentHeight+'px'});}
if(config.variableWidth){currentWidth=$current.width();$wrapper.css({'width':currentWidth+'px'});}}
if(config.pagination){var nextPoint=Math.floor(index/config.visibleSlides);if(index===slideCount-config.visibleSlides){nextPoint=Math.floor((slideCount-1)/config.visibleSlides);}
$paginationPoints.eq(nextPoint).addClass('active');}
$current.addClass('active');if(config.fading){if(initPos){$prev.fadeOut(config.transitionDuration);}
$current.fadeIn(config.transitionDuration);}else{nextOffset=offset[index];transition(nextOffset);}
if(!initPos){initPos=true;}}
function next(){moveTo($current.index()+1);}
function prev(){moveTo($current.index()-1);}
function play(){if(!config.autoplay){config.autoplay=true;}
if(pause){pause=false;return;}
setTimeout(function(){next();play();},config.slideDuration);}
function stopPlay(){if(config.autoplay){config.autoplay=false;}
if(!pause){pause=true;}}
function togglePlay(){if(!pause){stopPlay();}else{pause=false;play();}}
function hideControls(){if(config.controls){config.controls=false;}
if($controlsWrapper.css('display')!=='none'){$controlsWrapper.hide();}}
function showControls(){if(!config.controls){config.controls=true;}
if($controlsWrapper.css('display')==='none'){$controlsWrapper.show();}}
function toggleControls(){if(config.controls){config.controls=false;}else{config.controls=true;}
if($controlsWrapper.css('display')!=='none'){$controlsWrapper.hide();}else{$controlsWrapper.show();}}
function hidePagination(){if(config.pagination){config.pagination=false;}
if($pagination.css('display')!=='none'){$pagination.hide();}}
function showPagination(){if(!config.pagination){config.pagination=true;}
if($pagination.css('display')==='none'){$pagination.show();}}
function togglePagination(){if(config.pagination){config.pagination=false;}else{config.pagination=true;}
if($pagination.css('display')!=='none'){$pagination.hide();}else{$pagination.show();}}
function eventHanlers(){$paginationPoints.on('click',function(e){e.stopPropagation();var index=$(this).index()*config.visibleSlides;moveTo(index);return false;});$controlsLeft.on('click',function(e){e.stopPropagation();prev();return false;});$controlsRight.on('click',function(e){e.stopPropagation();next();return false;});}
function init(){$wrapper.css({'position':'relative','overflow':'hidden','transition':'all '+config.transitionDuration+'ms ease-out'});$slideWrap.css({'height':'100%','width':'100%'});$slides.css({'position':'absolute','left':'0'});if(config.fading){$slideWrap.css({'width':'100%'});$slides.not(0).fadeOut();}else{$slideWrap.css({'transition':'all '+config.transitionDuration+'ms '+config.easing,'left':'0','cursor':'move'});if(fallback==='3d'){$slideWrap.css({'-webkit-backface-visibility':'hidden','-moz-backface-visibility':'hidden','-ms-backface-visibility':'hidden','backface-visibility':'hidden','-webkit-perspective':'1000','-moz-perspective':'1000','-ms-perspective':'1000','perspective':'1000'});}}
initControls();initPagination();eventHanlers();calcWidth();if($current!==undefined){var n=$current.index();moveTo(0);moveTo(n);}else{moveTo(0);}
if(config.autoplay){play();}
$wrapper.load(function(){calcWidth();});}
init();function reset(newConfig){if(newConfig!==undefined){for(var newProp in newConfig){if(config.hasOwnProperty(newProp)){config[newProp]=newConfig[newProp];}}}
$controlsWrapper.remove();$pagination.remove();init();}
var mouseDown=false,mouseMove=false,mouseStart=0,mouseX=0,touchStartY=0,touchStartX=0;$wrapper.on({'mousedown':function(e){mouseDown=true;if(ie){mouseStart=event.clientX+document.body.scrollLeft;}else{mouseStart=e.pageX;}},'mouseup':function(e){mouseDown=false;if(!mouseMove){return;}
mouseMove=false;var limit=10;if(mouseStart>mouseX+limit){next();}else if(mouseStart<mouseX+limit){prev();}},'mousemove':function(e){if(!mouseDown)return;mouseMove=true;if(ie){mouseX=event.clientX+document.body.scrollLeft;}else{mouseX=e.pageX;}},'touchstart':function(e){touchStartY=e.originalEvent.touches[0].clientY;touchStartX=e.originalEvent.touches[0].clientX;},'touchend':function(e){var touchEndY=e.originalEvent.changedTouches[0].clientY,touchEndX=e.originalEvent.changedTouches[0].clientX,yDiff=touchStartY-touchEndY,xDiff=touchStartX-touchEndX;if(Math.abs(xDiff)>Math.abs(yDiff)){if(xDiff>5){next();}else{prev();}}
touchStartY=null;touchStartX=null;},'touchmove':function(e){}});$window.resize(function(){if(!config.fading){calcWidth();moveTo($current.index());}});$.fn.jcider.reset=reset;$.fn.jcider.moveTo=moveTo;$.fn.jcider.moveRight=next;$.fn.jcider.moveLeft=prev;$.fn.jcider.play=play;$.fn.jcider.pause=stopPlay;$.fn.jcider.togglePlay=togglePlay;$.fn.jcider.hidePagination=hidePagination;$.fn.jcider.showPagination=showPagination;$.fn.jcider.togglePagination=togglePagination;$.fn.jcider.hideControls=hideControls;$.fn.jcider.showControls=showControls;$.fn.jcider.toggleControls=toggleControls;});};})(jQuery);