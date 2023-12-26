import './assets/scss/general-styles.scss';
import './assets/scss/general-styles.scss';
import './assets/scss/app.scss';
import $ from 'jquery';
import logo_img from './assets/imgs/logo.png';
import banner_img from './assets/imgs/blog-banner.png';
import arrow_img from './assets/imgs/Arrow.svg';
import chevron_left_solid_img from './assets/imgs/chevron-left-solid.svg';
import Swiper from 'swiper/bundle';
import Validation from './assets/js/validations';
import * as functions from './assets/js/functions';


// import styles bundle
import 'swiper/css/bundle';

//default states

$(function() {

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
  let singlePostCategories = localStorage.getItem('singlePostCategories');
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

console.log('test123',typeof(isAddPostPage))

$('#singlePage').hide();
$('#authorizationPopup').hide();
$('#addPostPage').hide();











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
    console.log('categories loaded. posts: ' + postsDisplayed);
    console.log(data);
    $('#catWrapper').empty();
    data.data.forEach(cat => {
       $('#catWrapper').append(
        functions.displayCategories(cat.title, cat.text_color, cat.background_color)
      )
    })

    //add click listeners on categories

    $('[data-category]').each(function(){
      let btn = $(this);

      $(this).on('click', function(){
        console.log('clicked')
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
          console.log(postsDisplayed);
          while(!postsDisplayed){

          }
          console.log('posts displayed, go on filtering. ' + postsDisplayed);
          

          functions.filterPosts(selectedCategories);

        })
        console.log('check cat during load: ', selectedCategories.includes(btn.text().trim()))
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
    console.log(data);
    //display posts
    posts = data.data;
    $('#postsWrapper').empty();
    data.data.forEach(post => {
      let checkDate = functions.isDatePastOrPresent(post.publish_date, "Asia/Tbilisi");
      console.log('checked date is true '+checkDate)
      if(checkDate === true){
        $('#postsWrapper').append(
        
          functions.displayPosts(post)
        ) 
      }else{
        console.log('implement schedule')
        let appendPost = (id) =>{
          $('#postsWrapper').append(
        
            functions.displayPosts(post, false, '', id)
          )
        }
        let id = setTimeout(appendPost, checkDate, id);
        clearTimeout(id);
        console.log(id);
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
    console.log(data);
    //display posts
    posts = data.data;
    functions.fetchSinglePost(singlePostId, posts, getPostsUrl, token);


  })
  .catch(error => {
    console.error('Error:', error);
  });
  
}







//authorization

// const setupAuthPopUp = () => {
//   $('#mainContent').addClass('bg-shadow');
//   $('#authorizationPopup').show();
//   $('#popUpCheck').show();
//   $('#popUpSuccess').hide();
//   $('.hint--icon-empty').hide();
//   $('.hint--icon-wrong').hide();
//   $('.hint--icon-none').hide();
//   $('#authSubmit').addClass('disabled');
//   $('#authSubmit').prop('disabled', true);

//     //initialize validator object
//     const authEmailValidation = new Validation();

//   $('#closeAuthPopup').on('click', function(){
//     functions.closePopUp(authEmailValidation);
//   })
//   $('#authEmail').on('input', function(){
//     let email = $(this);
//     //if input is not correct add error message and apply styles
//     authEmailValidation.isEmailValid(email, email.val().trim());
//     let submitBtn = $('#authSubmit');
//     authEmailValidation.setFinalStatus(submitBtn);
//     console.log('applied styles')
//     localStorage.setItem('authEmail', email.val().trim())
//   });
//     //only clickable when input is correct

//   $('#authSubmit').on('click', function(){

//     //send request to check email
//     let email = $('#authEmail').val();
//     let data = {
//       "email": email
//     }

//     console.log(data)
//     fetch(loginUrl, {
//       method: 'POST',
//       headers: {
//           'Authorization': token,
//           'Content-Type': 'application/json',
//           'accept': 'application/json'
//       },
//       body: JSON.stringify(data)
//     })
//     .then(response => {
//       if (!response.ok) {
//         //if not such user add error message and apply styles
//         if(response.status === 422) {
//           authEmailValidation.applyEmailStyles($('#authEmail'), 'none');
//         }
//         throw new Error('Network response was not ok EERORRRRRR');
//       }

//         $('#popUpCheck').hide();
//         $('#popUpSuccess').show();
//         $('#login').hide();
//         $('#addPost').show();
//         $('#addPost').on('click', function(){
//           functions.displayAddPostPage();

//         })
//         //update loggedIn state on localstorage
//         localStorage.setItem('loggedIn', true);
//         $('#authSuccessBtn').on('click', function(){
//           functions.closePopUp(authEmailValidation);
//       })

//       console.log(response.status + ' from success')
//       return response.json();
//     })
//     .then(data => {
  
//     })
//     .catch(error => {
//       console.error('Error:', error);
//     });
    
//   })
// }

$('#login').on('click', function(){

  //update isAuthPopUp state
  localStorage.setItem('isAuthPopUp', true);

  functions.setupAuthPopUp(loginUrl, token);



})


if(isAuthPopUp === 'true') {

  functions.setupAuthPopUp(loginUrl, token);


  if(typeof(authEmail)=== 'string' && authEmail.length !== 0){
    $('#authEmail').val(authEmail);
    $('#authEmail').trigger('input');
  }
  

}





//set on refresh
if($('#addPost').css('display') !== 'none'){

  $('#addPost').on('click', function(){
    functions.displayAddPostPage();

  })
}




});