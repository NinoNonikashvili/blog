import $ from 'jquery';
import Validation from './validations';
import Swiper from 'swiper/bundle';



  const filterPosts = (selectedCategories) =>{
        console.log('filter posts function')
        $('[data-post]').each(function(){
        console.log('clicked btn')
        console.log("1. selected categories: "+selectedCategories);
        console.log('2.post to check: ')
        console.log($(this))
        let post = $(this);
        let display = false;
        console.log(selectedCategories, 'in filter');
        if(selectedCategories.length === 0) {
            post.show();
        }else{
            selectedCategories.forEach(cat => {
            console.log('3.post categories '+post.data("categories"));
            console.log('4. has post any of those categories? '+post.data("categories").includes(cat.replace(/\s/g, "")))
            if(post.data("categories").includes(cat.replace(/\s/g, ""))){
                display = true;
                }
            })
            console.log('display: '+ display)
            display ? post.show() : post.hide();
        }
        
        
        })
  }
  const displayAddPostPage = () =>{
    $('#mainContent').hide();
    $('#addPostPage').show();
    $("#backFromPostForm").on('click', function(){
      $('#mainContent').show();
      $('#addPostPage').hide();
      

    }
      
    )
  }
  const displayCategories = (cat, color, bg) => {


    return `<button data-category class="category" style="color: ${color}; background-color: ${bg}">${cat}</button>`
  }
  const displayPosts = (post, single = false, swiper_class = '', timeoutId = false) => {
    console.log(post)
  
    //format date + check if date is valid
    let date = convertToCustomFormat(post.publish_date, 'DD.MM.YYYY');
    //add email to date if present
    if(post?.email){
      date += ' • ' + post.email;
    }
    let categoryBtns = '';
    let categoryDataAttr = '';
    post.categories.forEach(function(cat, index){
      categoryBtns += displayCategories(cat.title, cat.text_color, cat.background_color) + ' ';
      if(index + 1 === post.categories.length){
        categoryDataAttr += cat.title;
      }else{
        categoryDataAttr += cat.title + ',';
      }
      
    })
    categoryDataAttr = categoryDataAttr.replace(/\s/g, "");
  
  console.log('post data category atttrs: ' +categoryDataAttr);
  console.log('timeoutId: ' + timeoutId);
  if(timeoutId){
    clearTimeout(timeoutId);
  }
  
    return `
          <div class="card ${single ? 'card--single' : ''} ${swiper_class ? swiper_class : ''}" data-post data-categories=${categoryDataAttr}>
              <img class="card__img" src="${post.image}" alt="post image">
              <div class="card__details">
                  <h5 class="card__details__author">${post.author}</h5>
                  <h6 class="card__details__date">${date}</h6>
              </div>` + 
              `${single ? 
                `<h2 class="card__title">${post.title}</h2>`
                :
                `<h4 class="card__title">${post.title}</h4>`
              }`
              
              +`<div class="card__categories-wrapper">`
                  + categoryBtns +
              `</div>
              <p class="card__excerpt">${single? post.description :  post.description.slice(0, 86)+'...'}</p>
              <button data-card-btn data-id=${post.id} class="outline link">
                  <span>სრულად ნახვა</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="Arrow">
                    <path id="Arrow 1" d="M5.93413 13.0052C5.64124 13.2981 5.64124 13.773 5.93413 14.0659C6.22703 14.3587 6.7019 14.3587 6.99479 14.0659L5.93413 13.0052ZM14.2855 6.46446C14.2855 6.05024 13.9497 5.71445 13.5355 5.71446L6.78553 5.71445C6.37132 5.71445 6.03553 6.05024 6.03553 6.46445C6.03553 6.87867 6.37132 7.21445 6.78553 7.21445H12.7855V13.2145C12.7855 13.6287 13.1213 13.9645 13.5355 13.9645C13.9497 13.9645 14.2855 13.6287 14.2855 13.2145L14.2855 6.46446ZM6.99479 14.0659L14.0659 6.99478L13.0052 5.93412L5.93413 13.0052L6.99479 14.0659Z" fill="#5D37F3"/>
                    </g>
                  </svg>
              </button>
          </div>
    
    `
  }
  const convertToCustomFormat = (isoDate, customFormat) =>{
    const dateObject = new Date(isoDate);
    const placeholders = {
        'YYYY': dateObject.getFullYear(),
        'MM': String(dateObject.getMonth() + 1).padStart(2, '0'),
        'DD': String(dateObject.getDate()).padStart(2, '0'),
  
    };
    const formattedDate = customFormat.replace(/YYYY|MM|DD/g, match => placeholders[match]);
  
    return formattedDate;
  }
  const isDatePastOrPresent = (date, timeZone)=>{
    let options = {
    timeZone: timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  },
  formatter = new Intl.DateTimeFormat([], options);
  let today = formatter.format(new Date());
  let todayObj = new Date(today);
  let dateObj = new Date(date);
     if(dateObj - todayObj <= 0){
      console.log('display now')
        return true
    }else{
      console.log('schedule ')
  
        return dateObj - todayObj
    }
  }
  const closePopUp = (authEmailValidation) => {
    //update isAuthPopUp state
    localStorage.setItem('isAuthPopUp', false);
    localStorage.setItem('authEmail', '')
    //add default styles to popup
    $("#popUpSuccess").hide();
    $('#popUpCheck').show();
    $("#authEmail").val('');
    authEmailValidation.applyEmailStyles($('#authEmail'));

    //hide popup
    $('#mainContent').removeClass('bg-shadow');
    $('#authorizationPopup').hide();
  }
  const setupAuthPopUp = (loginUrl, token) => {
    $('#mainContent').addClass('bg-shadow');
    $('#authorizationPopup').show();
    $('#popUpCheck').show();
    $('#popUpSuccess').hide();
    $('.hint--icon-empty').hide();
    $('.hint--icon-wrong').hide();
    $('.hint--icon-none').hide();
    $('#authSubmit').addClass('disabled');
    $('#authSubmit').prop('disabled', true);
  
      //initialize validator object
      const authEmailValidation = new Validation();
  
    $('#closeAuthPopup').on('click', function(){
      closePopUp(authEmailValidation);
    })
    $('#authEmail').on('input', function(){
      let email = $(this);
      //if input is not correct add error message and apply styles
      authEmailValidation.isEmailValid(email, email.val().trim());
      let submitBtn = $('#authSubmit');
      authEmailValidation.setFinalStatus(submitBtn);
      console.log('applied styles')
      localStorage.setItem('authEmail', email.val().trim())
    });
      //only clickable when input is correct
  
    $('#authSubmit').on('click', function(){
  
      //send request to check email
      let email = $('#authEmail').val();
      let data = {
        "email": email
      }
  
      console.log(data)
      fetch(loginUrl, {
        method: 'POST',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        if (!response.ok) {
          //if not such user add error message and apply styles
          if(response.status === 422) {
            authEmailValidation.applyEmailStyles($('#authEmail'), 'none');
          }
          throw new Error('Network response was not ok EERORRRRRR');
        }
  
          $('#popUpCheck').hide();
          $('#popUpSuccess').show();
          $('#login').hide();
          $('#addPost').show();
          $('#addPost').on('click', function(){
            displayAddPostPage();
  
          })
          //update loggedIn state on localstorage
          localStorage.setItem('loggedIn', true);
          $('#authSuccessBtn').on('click', function(){
            closePopUp(authEmailValidation);
        })
  
        console.log(response.status + ' from success')
        return response.json();
      })
      .then(data => {
    
      })
      .catch(error => {
        console.error('Error:', error);
      });
      
    })
  }
  const showSinglePage = () => {

    localStorage.setItem('isSinglePage', true);
    //hide main page and show single page
    $('#displayPage').hide();
    $('#singlePage').show();
    $("html, body").animate({ scrollTop: 0 }, "slow");
    //add navigation functionality to back button
    $('#backFromSinglePost').on('click', function(){
      $('#displayPage').show();
      $('#singlePage').hide();
      localStorage.setItem('isSinglePage', false);
    })
  
    //initialize swiper
  
    var swiper = new Swiper("#postsSwiper", {
      slidesPerView: 3,
      spaceBetween: 30,
      navigation: {
        nextEl: "#swiperNextBtn",
        prevEl: "#swiperPrevBtn",
      },
    });
  }
  const fetchSinglePost = (id, posts, getPostsUrl, token) => {
    fetch(getPostsUrl+'/'+id, {
      headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      
  
      //display posts
      $('#singlePost').empty();
        $('#singlePost').append(
          displayPosts(data, true)
        )
      //select similar posts and display in slider
  
      let categories = [];
      data.categories.forEach(cat => {
        categories.push(cat.title)
      })
      let post_id = data.id;
      console.log('BLABLAPOST',posts)
      let similar_posts = findSimilarPosts(post_id, posts, categories);
  
    // })
    populateSwiper(similar_posts, posts, getPostsUrl, token)
  
  
    })
    .catch(error => {
      console.error('Error:', error);
    });
  
  }
  const findSimilarPosts = (post_id, posts, categories) => {
    let flag = false;
    let similar_posts = [];
    posts.forEach(post => {
      console.log('iteration start: ')
      flag = false;
      if(post.id !== post_id){
          post.categories.forEach(cat =>{
              console.log(cat.title, categories, categories.includes(cat.title))
              if(categories.includes(cat.title)){
                  flag = true;
              }
          })
          if(flag){
            similar_posts.push(post);
  
          }
      }
            console.log('iteration end. ')
  
      
    })
    return similar_posts;
  }
  
  const populateSwiper = (similarPosts, posts, getPostsUrl, token) => {
  
    $('#postSwiperWrapper').empty();
    similarPosts.forEach(post => {
      let checkDate = isDatePastOrPresent(post.publish_date, "Asia/Tbilisi");
      if(checkDate === true){
        $('#postSwiperWrapper').append(
    
          displayPosts(post, false, 'swiper__posts-wraper__post swiper-slide')
        )
      }else{
        console.log('implement schedule')
        let appendPost = (id) =>{
          $('#postSwiperWrapper').append(
    
            displayPosts(post, false, 'swiper__posts-wraper__post swiper-slide')
          )
        }
        let id = setTimeout(appendPost, checkDate, id)
        clearTimeout(id);
        console.log(id);
      }
      
  
    })
  //add listener to swiper posts' too
  $('[data-card-btn').each(function(){
    let btn = $(this);
    btn.on('click', function(){
      
  
      // showSinglePage();
  
      //load individual post and display
      let id = btn.data("id");
      localStorage.setItem('singlePostId', id);
      fetchSinglePost(id, posts, getPostsUrl, token);
      $("html, body").animate({ scrollTop: 0 }, "slow");
  
    })
  })
  
  
  }


  export {filterPosts, 
    displayAddPostPage, 
    displayCategories, 
    displayPosts, 
    convertToCustomFormat, 
    isDatePastOrPresent, 
    closePopUp,
    setupAuthPopUp,
    showSinglePage,
    fetchSinglePost,
    findSimilarPosts,
    populateSwiper
  };