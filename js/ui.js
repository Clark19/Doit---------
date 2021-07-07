// $(document).ready(function(){
window.onload = function () {
  document.getElementById('container').classList.add('start');
  const menuItems = document.querySelectorAll('nav li');
  for (const item of menuItems) {
    item.onclick = () => menuClickHandler(menuItems, item);
  }

  //도서소개 롤링 배너
  document.querySelector('.roll_left').onclick = function() {
    const bookImgElements = document.querySelectorAll('.book_roll li');
    const firstEl = document.querySelector('.book_roll li:first-child');
    const lastEl = bookImgElements[bookImgElements.length-1];
    insertAfter(firstEl, lastEl);
  };
  document.querySelector('.roll_right').addEventListener('click', function() {
    const bookImgElements = document.querySelectorAll('.book_roll li');
    const firstEl = document.querySelector('.book_roll li:first-child');
    const lastEl = bookImgElements[bookImgElements.length-1];
    lastEl.parentNode.insertBefore(lastEl, firstEl);
  });

  // 도서 롤링 배너 클릭시 도서 상세 페이지 ajax로 변경
  changeBookDetail();

  const faqList = document.querySelectorAll('.accordio_box ol li');
  faqList.forEach(el => {
    el.onclick = function() {
      faqList.forEach(el => el.classList.remove('on'));
      el.classList.add('on');
    };
  });

  document.querySelector('.close').onclick = function() {
    document.querySelector('.thankyou_message').style.display = 'none';
  };

// });
};


function menuClickHandler(menuItems, item) {
  const containerEl = document.getElementById('container');
  containerEl.style.maxWidth = '100%';
  // document.querySelectorAll('#container h2').forEach(el => el.style.opacity='100')
  const id = item.getAttribute('data-rol');
  menuItems.forEach(el => el.classList.remove('on'));
  item.setAttribute('class', 'on');
  // 클릭 시 가지고 있던 클래스 모두 삭제
  const contentEls = document.querySelectorAll('.content');
  contentEls.forEach(el => el.classList.remove('prev', 'this', 'next'));
  
  // 클릭한 메뉴와 매칭되는 id에 this 클래스를 지정하고, 그 앞의 모든 section 태그는 .prev 클래스를 지정.
  target = document.querySelector('#'+id);
  preElems = getPreSiblings(target);
  preElems.forEach(el => el.classList.add('prev'));
  target.classList.add('this');
  nextElems = getNextSiblings(target);
  nextElems.forEach(el => el.classList.add('next'));
  // nextElems.forEach(el => el.setAttribute('class', 'next'));
  // setAttribute 사용금지. 사용하면 이전 클래스들이 없어지면서 이상작동 함.
  
  document.getElementsByClassName('logo_box')[0].onclick = function() {
      menuItems.forEach(el => el.classList.remove('on'));
      contentEls.forEach(el => el.classList.remove('prev', 'this', 'next'));
      containerEl.style.maxWidth = '1200px';
  };
}

// menuClickHandler의 jQuery 버전 - js와 jQuery 비교/변환 학습용
function menuClickHandler_jQuery(menuItems, item) {
  $("#container").css("max-width", "100%");
  const id = $(item).attr("data-rol");
  $('nav li').removeClass('on');
  $(item).addClass('on');
  $(".content").removeClass("prev this next"); // 클릭 시 가지고 있던 클래스 모두 삭제
 
  $("#" + id).addClass("this").prevAll().addClass("prev");
  // 클릭한 메뉴와 매칭되는 id에 this 클래스를 지정하고, 그 앞의 모든 section 태그는 .prev 클래스를 지정.
  $("#" + id).nextAll().addClass("next");
}


// Util 함수들 Class로 빼볼 것
function getPreSiblings(elem) {
  let sibliings = [];
  if (!elem.parentNode) return sibliings;

  let sibling = elem.parentNode.firstChild;
  while (sibling) {
    if (sibling === elem) break;
    if (sibling.nodeType === 1 && sibling !== elem)
      sibliings.push(sibling);
    sibling = sibling.nextSibling;
  }
  return sibliings;
}

function getNextSiblings(elem) {
  let sibliings = [];
  if (!elem.parentNode) return sibliings;

  let sibling = elem.nextElementSibling;
  while (sibling) {
    if (sibling === elem) break;
    if (sibling.nodeType === 1 && sibling !== elem)
      sibliings.push(sibling);
    sibling = sibling.nextSibling;
  }
  return sibliings;
}

function insertAfter(newElement, referenceElement) {
  referenceElement.parentNode.insertBefore(newElement, referenceElement.nextSibling);
}

function changeBookDetail() {
  let detailContentEl = document.querySelector('.notebook');
  let httpRequest = new XMLHttpRequest();
  document.querySelectorAll('.book_roll li').forEach(el => {
    el.onclick = function() {
      const liUrl = this.getAttribute('data-url');
      detailContentEl.innerHTML = '';
      if (!httpRequest) {
        console.log('Could not make XMLHTTP instance!!');
        return false;
      }
      httpRequest.onreadystatechange = showBookContent;
      httpRequest.open('GET', liUrl); // 이 에제에선 Get으로 하든 POSt로 하든 상관 없음.
      httpRequest.send();
    }
  });
  
  function showBookContent() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200 || httpRequest.status === 0) { // 0 이란? 
        detailContentEl.innerHTML = httpRequest.responseText;
      } else {
        console.log('request에 뭔가 문제 있음');
        console.log(`${httpRequest.readyState}, [${httpRequest.status}] : [${httpRequest.statusText}]`);
        console.log(httpRequest.responseText)
      }
    }
  }
}

function changeBookDetail_jQuery() {
  document.querySelectorAll('.book_roll li').forEach(el => {
    el.onclick = function() {
      const liUrl = this.getAttribute('data-url');
      document.querySelector('.notebook').innerHTML = '';
      $.ajax({
        type: 'post',
        url: 'https://cors-anywhere.herokuapp.com/'+liUrl,
        // url: liUrl,
        dataType: 'html',
        success: function(data) {
          $('.notebook').html(data);
        }
      });
    };
  });
}