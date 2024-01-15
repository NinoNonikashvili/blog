import './assets/scss/general-styles.scss';
import './assets/scss/general-styles.scss';
import './assets/scss/app.scss';
import $ from 'jquery';
import logo_img from './assets/imgs/logo.png';
import banner_img from './assets/imgs/blog-banner.png';
import arrow_img from './assets/imgs/Arrow.svg';
import chevron_left_solid_img from './assets/imgs/chevron-left-solid.svg';
import * as functions from './assets/js/functions';


// import styles bundle
import 'swiper/css/bundle';

//default states

$(function() {

  //clear data
  // localStorage.clear()
  

  let selectedCategories;
  if(localStorage.getItem('selectedCategories')){
    selectedCategories = localStorage.getItem('selectedCategories').split(',');
  }else{
    selectedCategories = [];
  }
  
  let postsDisplayed = false;
  let posts  = [];
  let loggedIn = localStorage.getItem('loggedIn');
  let isSinglePage = localStorage.getItem('isSinglePage');
  let singlePostId = localStorage.getItem('singlePostId');
  let isAuthPopUp = localStorage.getItem('isAuthPopUp');
  let isAddPostPage = localStorage.getItem('isAddPostPage');
  let authEmail = localStorage.getItem('authEmail');
  


  //set login and filter posts if page is refreshed based on localstorage values
  if(loggedIn) {
    $('#login').hide();
    $('#addPost').show();
  }else{
    $('#login').show();
    $('#addPost').hide();
  }

const baseUrl = 'https://api.blog.redberryinternship.ge/api';
const categoriesUrl = baseUrl+'/categories';
const getPostsUrl = baseUrl + '/blogs';
const loginUrl = baseUrl + '/login';
const token = 'Bearer d2e9a0063133e84f32659f466d83c70750661bb2059e30a473ee062dee27a59f';


$('#singlePage').hide();
$('#authorizationPopup').hide();
$('#addPostPage').hide();
$('#addPostPage').removeClass('bg-shadow');
$('#uploadPopup').hide();



  //load categories 

  fetch(categoriesUrl, {
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
   
    let cats = [];
    $('#catWrapper').empty();
    data.data.forEach(cat => {

      cats.push(cat.title+'~'+cat.background_color+'~'+cat.text_color+'~'+cat.id);      
       $('#catWrapper').append(
        functions.displayCategories(cat.title, cat.text_color, cat.background_color, 'data-category')
      )
    })

    localStorage.setItem('categories', cats )
    //add click listeners on categories

    $('[data-category]').each(function(){
      let btn = $(this);

      if(!btn.data('id')){
        btn.on('click', function(){
          let btn = $(this);
            if(btn.hasClass('selected')){
              btn.removeClass('selected');
              let index = selectedCategories.indexOf(btn.text().trim())
              if(index> -1){
                selectedCategories.splice(index,1);
                localStorage.setItem('selectedCategories', selectedCategories);
              }
  
            }else{
              btn.addClass('selected');
              selectedCategories.push(btn.text().trim());
              localStorage.setItem('selectedCategories', selectedCategories);
            }
            //filter posts
            while(!postsDisplayed){
  
            }
            
  
            functions.filterPosts(selectedCategories);
  
          })
      }
      

      if(selectedCategories.includes(btn.text().trim())){
        btn.addClass('selected');
      }

    })

  })
  .catch(error => {
    console.error('Error:', error);
  });

  
  //load posts

  fetch(getPostsUrl, {
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
    posts = data.data;
    $('#postsWrapper').empty();
    data.data.forEach(post => {
      let checkDate = functions.isDatePastOrPresent(post.publish_date, "Asia/Tbilisi");
      if(checkDate === true){
        $('#postsWrapper').append(
        
          functions.displayPosts(post)
        ) 
      }else{
        let appendPost = (id) =>{
          $('#postsWrapper').append(
        
            functions.displayPosts(post, false, '', id)
          )
        }
        let id = setTimeout(appendPost, checkDate, id);
        // clearTimeout(id);
      }
      functions.filterPosts(selectedCategories);
      
    })
    
    //update flag
    postsDisplayed = true;

    //add click listener to posts' btns to open single post page
    $('[data-card-btn').each(function(){
      let btn = $(this);
      btn.on('click', function(){
        

        // //hide main page and show single page

        functions.showSinglePage();
        

        //load individual post and display
        
        let id = btn.data("id");
        localStorage.setItem('singlePostId', id);
        functions.fetchSinglePost(id, posts,getPostsUrl,token);
        

      })
    })

  })
  .catch(error => {
    console.error('Error:', error);
  });


if(isSinglePage === 'true'){
  functions.showSinglePage();
  //loac posts again as there are deleted after refresh
  fetch(getPostsUrl, {
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
    posts = data.data;
    functions.fetchSinglePost(singlePostId, posts, getPostsUrl, token);


  })
  .catch(error => {
    console.error('Error:', error);
  });
  
}



//authorization
$('#login').on('click', function(){

  //update isAuthPopUp state
  localStorage.setItem('isAuthPopUp', true);

  functions.setupAuthPopUp(baseUrl, token);


})


//reset states on page refresh

//display popup if displayed before refresh
if(isAuthPopUp === 'true') {

  functions.setupAuthPopUp(baseUrl, token);


  if(typeof(authEmail)=== 'string' && authEmail.length !== 0){
    $('#authEmail').val(authEmail);
    $('#authEmail').trigger('input');
  }
  

}

//click listener on add new post button
if($('#addPost').css('display') !== 'none'){

  $('#addPost').on('click', function(){
    functions.displayAddPostPage();

  })
}

console.log('btn click triggered app js? ' + isAddPostPage)
//if create-post-page was displayed before refresh, display again
if(isAddPostPage === 'true'){
  
  functions.displayAddPostPage();
}




});