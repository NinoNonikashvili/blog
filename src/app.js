import './assets/scss/general-styles.scss';
import './assets/scss/general-styles.scss';
import './assets/scss/app.scss';
import $ from 'jquery';
import logo_img from './assets/imgs/logo.png';
import banner_img from './assets/imgs/blog-banner.png';
import arrow_img from './assets/imgs/Arrow.svg';

//default states

let loggedIn = false;
let selectedCategories = [];
let postsDisplayed = false;

const baseUrl = 'https://api.blog.redberryinternship.ge/api';
const categoriesUrl = baseUrl+'/categories';
const getPostsUrl = baseUrl + '/blogs';
const token = 'Bearer d2e9a0063133e84f32659f466d83c70750661bb2059e30a473ee062dee27a59f';



$('#addPost').hide();


/* states that has to stay the same after refresh
 * 1.loggedIn
 * 2.selectedCategories
 * 
*/


//display categories

let displayCategories = (cat, color, bg) => {


  return `<button data-category class="category" style="color: ${color}; background-color: ${bg}">${cat}</button>`
}

let displayPosts = (post) => {

  //format date + check if date is valid
  let date = convertToCustomFormat(post.publish_date, 'DD.MM.YYYY');
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


  return `
        <div class="card" data-post data-categories=${categoryDataAttr}>
            <img class="card__img" src="${post.image}" alt="post image">
            <div class="card__details">
                <h5 class="card__details__author">${post.author}</h5>
                <h6 class="card__details__date">${date}</h6>
            </div>

            <h4 class="card__title">${post.title}</h4>
            <div class="card__categories-wrapper">`
                + categoryBtns +
            `</div>
            <p class="card__excerpt">${post.description}</p>
            <button data-card-btn data-id=${post.id} class="outline">
                <span>სრულად ნახვა</span>
                <img src="./imgs/Arrow.svg" alt="">
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

//load categories 


fetch(categoriesUrl, {
    headers: {
        'Authorization': 'Bearer 484a705d288bb545f53698f01145d328fc253d7b4ed48d5ce13de3590ed057a4',
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
        displayCategories(cat.title, cat.text_color, cat.background_color)
      )
    })

    //add click listeners on categories

    $('[data-category]').each(function(){
5
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
          console.log(selectedCategories);
          $('[data-post]').each(function(){
            let post = $(this);
            let display = false;
            if(selectedCategories.length === 0) {
              post.show();
            }else{
              selectedCategories.forEach(cat => {
                console.log(post.data("categories"));
                if(post.data("categories").includes(cat.replace(/\s/g, ""))){
                    display = true;
                  }
                })
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
    $('#postsWrapper').empty();
    data.data.forEach(post => {
      $('#postsWrapper').append(
        displayPosts(post)
      )
    })
    


    //update flag
    postsDisplayed = true;
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