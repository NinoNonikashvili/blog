import './assets/scss/general-styles.scss';
import './assets/scss/general-styles.scss';
import './assets/scss/app.scss';
import $ from 'jquery';
import logo_img from './assets/imgs/logo.png';
import banner_img from './assets/imgs/blog-banner.png';
import arrow_img from './assets/imgs/Arrow.svg';
import chevron_left_solid_img from './assets/imgs/chevron-left-solid.svg';
import Swiper from 'swiper/bundle';

// import styles bundle
import 'swiper/css/bundle';

//default states

$(function() {

let loggedIn = false;
let selectedCategories = [];
let postsDisplayed = false;

const baseUrl = 'https://api.blog.redberryinternship.ge/api';
const categoriesUrl = baseUrl+'/categories';
const getPostsUrl = baseUrl + '/blogs';
const token = 'Bearer d2e9a0063133e84f32659f466d83c70750661bb2059e30a473ee062dee27a59f';



$('#addPost').hide();
$('#singlePage').hide();

/* states that has to stay the same after refresh
 * 1.loggedIn
 * 2.selectedCategories
 * 
*/


//display categories

let displayCategories = (cat, color, bg) => {


  return `<button data-category class="category" style="color: ${color}; background-color: ${bg}">${cat}</button>`
}

//display posts

let displayPosts = (post, single = false, swiper_class = '', timeoutId = false) => {
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
              `<h3 class="card__title">${post.title}</h3>`
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

//apply custom format to date

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

//check publish date

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

//load categories 


fetch(categoriesUrl, {
    // headers: {
    //     'Authorization': 'Bearer 484a705d288bb545f53698f01145d328fc253d7b4ed48d5ce13de3590ed057a4',
    //     'Content-Type': 'application/json'
    // }
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
        displayCategories(cat.title, cat.text_color, cat.background_color)
      )
    })

    //add click listeners on categories

    $('[data-category]').each(function(){

      $(this).on('click', function(){
        console.log('clicked')
        let btn = $(this);
          if(btn.hasClass('selected')){
            btn.removeClass('selected');
            let index = selectedCategories.indexOf(btn.text().trim())
            if(index> -1){
              selectedCategories.splice(index,1);
            }

          }else{
            btn.addClass('selected');
            selectedCategories.push(btn.text().trim())
          }
          //filter posts
          console.log(postsDisplayed);
          while(!postsDisplayed){

          }
          console.log('posts displayed, go on filtering. ' + postsDisplayed);
          
          $('[data-post]').each(function(){
            console.log('clicked btn')
            console.log("1. selected categories: "+selectedCategories);
            console.log('2.post to check: ')
            console.log($(this))
            let post = $(this);
            let display = false;
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

        })

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
    let posts = data.data;
    $('#postsWrapper').empty();
    data.data.forEach(post => {
      let checkDate = isDatePastOrPresent(post.publish_date, "Asia/Tbilisi");
      console.log('checked date is true '+checkDate)
      if(checkDate === true){
        $('#postsWrapper').append(
        
          displayPosts(post)
        ) 
      }else{
        console.log('implement schedule')
        let appendPost = (id) =>{
          $('#postsWrapper').append(
        
            displayPosts(post, false, '', id)
          )
        }
        let id = setTimeout(appendPost, checkDate, id)
        console.log(id);
      }
      
    })
    
    //update flag
    postsDisplayed = true;

    //add click listener to posts' btns to open single post page
    $('[data-card-btn').each(function(){
      let btn = $(this);
      btn.on('click', function(){
        let id = btn.data("id");

        //hide main page and show single page
        $('#displayPage').hide();
        $('#singlePage').show();
        $('#backToMainPage').on('click', function(){
          $('#displayPage').show();
        $('#singlePage').hide();
        })
        //load individual post and display
        
        
        let categories = [];

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
            $('#singlePagePostWrapper').append(
              displayPosts(data, true)
            )
          //select similar posts and display in slider
          data.categories.forEach(cat => {
            categories.push(cat.title)
          })

          console.log('categories of post: ' + categories)

          let flag = false;
          let similar_posts =[];

          posts.forEach(post => {
              console.log('iteration start: ')
              flag = false;
              if(post.id !== data.id){
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
        
        
        console.log(similar_posts);

        //add similar posts to slider


        var swiper = new Swiper("#postsSwiper", {
          slidesPerView: 3,
          spaceBetween: 30,
          navigation: {
            nextEl: "#swiperNextBtn",
            prevEl: "#swiperPrevBtn",
          },
        });

        similar_posts.forEach(post => {
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
            console.log(id);
          }
          

        })
      
      
        })
        .catch(error => {
          console.error('Error:', error);
        });

      })
    })

  })
  .catch(error => {
    console.error('Error:', error);
  });





//categories matching

// let arr = JSON.stringify({
//     "data": [
//       {
//         "id": 1,
//         "title": "Blog title",
//         "description": "Blog description",
//         "image": "https://via.placeholder.com/150",
//         "publish_date": "2023-11-19 00:00:00",
//         "categories": [
//           {
//             "id": 1,
//             "name": "bla",
//             "text_color": "#ffffff",
//             "background_color": "#000000"
//           },
//           {
//             "id": 1,
//             "name": "blo",
//             "text_color": "#ffffff",
//             "background_color": "#000000"
//           },
//           {
//             "id": 1,
//             "name": "blu",
//             "text_color": "#ffffff",
//             "background_color": "#000000"
//           }
//         ],
//         "author": "გელა გელაშვილი"
//       },
//       {
//         "id": 2,
//         "title": "Blog title",
//         "description": "Blog description",
//         "image": "https://via.placeholder.com/150",
//         "publish_date": "2023-11-19 00:00:00",
//         "categories": [
//           {
//             "id": 1,
//             "name": "marketing",
//             "text_color": "#ffffff",
//             "background_color": "#000000"
//           },
//           {
//             "id": 1,
//             "name": "ux",
//             "text_color": "#ffffff",
//             "background_color": "#000000"
//           },
//           {
//             "id": 1,
//             "name": "blu",
//             "text_color": "#ffffff",
//             "background_color": "#000000"
//           }
//         ],
//         "author": "გელა გელაშვილი"
//       },
//       {
//         "id": 3,
//         "title": "Blog title",
//         "description": "Blog description",
//         "image": "https://via.placeholder.com/150",
//         "publish_date": "2023-11-19 00:00:00",
//         "categories": [
//           {
//             "id": 1,
//             "name": "ai",
//             "text_color": "#ffffff",
//             "background_color": "#000000"
//           },
//           {
//             "id": 1,
//             "name": "ux",
//             "text_color": "#ffffff",
//             "background_color": "#000000"
//           }
//         ],
//         "author": "გელა გელაშვილი"
//       }
//     ]
//   })
//   console.log(arr)
//   arr = JSON.parse(arr);
//   console.log(arr.data)
//   let test = ['ui', 'bla', 'ux'];
//   let similar_posts = [];
//   let current_id = 2;
//   let flag = false;
    
//     arr.data.forEach(post => {
//         console.log('iteration start: ')
//         flag = false;
//         if(post.id !== current_id){
//             post.categories.forEach(cat =>{
//                 console.log(cat.name, test, test.includes(cat.name))
//                 if(test.includes(cat.name)){
//                     flag = true;
//                 }
//             })
//             if(flag){
//                similar_posts.push(post);
  
//             }
//         }
//               console.log('iteration end. ')
  
        
//     })
  
  
//   console.log(similar_posts);

});