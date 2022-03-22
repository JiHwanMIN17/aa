
const backToTop = document.getElementById('backtotop');
const checkScroll=() => {
    /*
      웹페이지가 수직으로 얼마나 스크롤되었는지를 확인하는 값(픽셀 단위로 반환)
      https://developer.mozilla.org/ko/docs/Web/API/Window/pageYOffset
    */
    let pageYOffset = window.pageYOffset;
    if (pageYOffset !== 0) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
}
const moveBackToTop=() => {
    if (window.pageYOffset > 0) {
        /*
        smooth 하게 스크롤하기
        https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTo
        */
       window.scrollTo({top: 0, behavior: "smooth"})
    }
}
window.addEventListener('scroll', checkScroll);
backToTop.addEventListener('click', moveBackToTop);
function transformNext(event){
   const slideNext=event.target;
   const slidePrev=slideNext.previousElementSibling;
   const classList=slideNext.parentElement.parentElement.nextElementSibling;
   let activeLi=classList.getAttribute('data-position');
   const liList=classList.getElementsByTagName('li');
   if (Number(activeLi)<0){  //하나의 카드라도 왼쪽으로 이동했다면
       activeLi=Number(activeLi)+260;   //오른쪽으로 이동시킬 수 있다.
       //왼쪽에 있는 카드가 오른쪽으로 이동했을 경우
       //다시 왼족으로 갈 수 있으므로
       //slidePrev를 활성화(칼러색 블루,hover효과) 시켜준다.
       slidePrev.style.color='#2f3059';
       slidePrev.classList.add('slide-prev-hover');   
       slidePrev.addEventListener('click',transformPrev);
       if(Number(activeLi)===0){
           //첫화면의 경우 더이상 오른쪽으로 밀 수 없으므로 오른쪽을 비활성화시킨다.
        slideNext.style.color= '#cfd8dc';
        slideNext.classList.remove('slide-next-hover');
        slideNext.addEventListener('click',transformNext)
       }
   }
   //변경된 active가 진행되는 transition,transform,data-position 설정
   classList.style.transition='transform 1s';
   classList.style.transform='translateX('+String(activeLi)+'px)';
    //이동이 되었으니까 data-position값을 activeLi값으로 넣는다.
   classList.setAttribute('data-position',activeLi);
}

function transformPrev(event){
    const slidePrev = event.target;// 해당 이벤트가 발생한 요소
    const slideNext = slidePrev.nextElementSibling;
    const classList = slidePrev.parentElement.parentElement.nextElementSibling;
    /* 
    카드리스트의 요소인 현재 위치값 data-position과
    li리스트의 요소인 li 테그를 가지고 온다.
    */
    let activeLi=classList.getAttribute('data-position');  
    const liList=classList.getElementsByTagName('li');
    if(classList.clientWidth<(liList.length*260+Number(activeLi))){
        //이 상태는 오른쪽으로 삐져나간상태임-> 왼쪽으로 이동 한칸
        activeLi=Number(activeLi)-260;
        if(classList.clientWidth>(liList.length*260+Number(activeLi))){
         //왼쪽으로 한칸 이동하고 나서 더이상 왼쪽으로 못가면 
         slidePrev.style.color='#cfd8dc';//왼쪽버튼 회색화
         slidePrev.classList.remove('slide-prev-hover');//왼쪽버튼 호버효과 제거
         
         slidePrev.removeEventListener('click',transformPrev);//왼쪽 버튼의 클릭효과 제거
        }
        //
        //왼쪽으로 이동했으니까 이제 오른쪽을 활성화(색깔과 올려두었을때 효과를 바꿈) 시켜야한다.
        slideNext.style.color= '#2f3059';
        //오른쪽 화살표의 활성화 상태를 나타내는 css설정
        // slide-next-hover
        slideNext.classList.add('slide-next-hover');
        slideNext.addEventListener('click',transformNext);// 오른쪽 으로 가야하는 클릭효과 transformNext 생성
    }
    classList.style.transition='transform 1s';
    classList.style.transform='translateX('+String(activeLi)+'px)';
    //이동이 되었으니까 data-position값을 activeLi값으로 넣는다.
    classList.setAttribute('data-position',activeLi);
}
/*----- */ 
/*
카드 갯수가 일정 class너비보다 작다면
arrow container를 삭제하는 경우
*/
const slidePrevList= document.getElementsByClassName('slide-prev');
for( let i=0; i<slidePrevList.length;i++){
    //ul테그 선택
    let classList=slidePrevList[i].parentElement.parentElement.nextElementSibling;
    //ul테그 (classList) 안의 li테그
    let liList=classList.getElementsByTagName('li');
    if(classList.clientWidth<(liList.length*260)){
        slidePrevList[i].classList.add('slide-prev-hover');
        slidePrevList[i].addEventListener('click',transformPrev);
    } else{
        const arrowContainer=slidePrevList[i].parentElement;
        arrowContainer.removeChild(slidePrevList[i].nextElementSibling);
        arrowContainer.removeChild(slidePrevList[i]);
    }
}
/* -------------------------------------------------------------------- */
let touchstartX;//최초의 마우스의 위치
let currentClassList;// 해당이미지와 관련된 클래스리스트
let currentImg;//그때 해당 이미지
let currentActiveLi;//마우스 드래그 하기시작할 때 카드의 위치
let nowActiveLi;//드래그하면서 변경된 카드의 위치
let mouseStart; //드래그가 시작되면 드래그가 시작된 상황을 boolean값으로
function processTouchMove(event){
    event.preventDefault();
    let currentX=event.clientX||event.touches[0].screenX; //지금 x의 위치가 있는 곳
    //지금 - 과거= 카드가 이동해야할 너비
    nowActiveLi=Number(currentActiveLi)+(Number(currentX)-Number(touchstartX));
    currentClassList.style.transition='transform 0s linear';
    currentClassList.style.transform='translate('+String(nowActiveLi)+'px)';
}
function processTouchStart(event){
    mouseStart=true; // 드래그가 됐어
    event.preventDefault(); // 디폴트 동작은 끌어댕길 수 있는 것인데 이것을 막는다.
    touchstartX=event.clientX||event.touches[0].screenX;
    currentImg=event.target;
    //이미지에 이벤트 걸어줘야
    //사용자가 언제 마우스 업하느냐에 따라 이미지를 케치하기 어려울 수 있다.
    //그래서 해당이미지(currentImg)에도 마우스 업을 걸어주고
    //드래그한 상태로 마우스를 이동하면 그 이벤트를 다 잡아내기 위해
    //마우스무브를 해당이미지에 걸어준다.
    currentImg.addEventListener('mousemove',processTouchMove);
    currentImg.addEventListener('mouseup',processTouchEnd);
    
    currentClassList=currentImg.parentElement.parentElement;
    currentActiveLi=currentClassList.getAttribute('data-position');
}
function processTouchEnd(event){
    event.preventDefault();

    if(mouseStart===true){
        currentImg.removeEventListener('mousemove',processTouchMove);
        currentImg.removeEventListener('mouseup',processTouchEnd);

        currentClassList.style.transition='transform 1s ease';//1초의 간격으
        currentClassList.style.transform='translateX(0px)'; // 맨 앞에 위치시킨다.
        currentClassList.setAttribute('data-position',0);//그 때의 데이터포지션 값도 0으로 셋팅
    }
}
window.addEventListener('dragend',processTouchEnd);
window.addEventListener('mouseup',processTouchEnd);
const classImgLists=document.querySelectorAll('ul li img');
for (let i=0;i<classImgLists.length;i++){
    classImgLists[i],addEventListener('mousedown',processTouchStart);
    classImgLists[i],addEventListener('touchstart',processTouchStart);
}
mousedown,mousemove,mouseup(drageend)
