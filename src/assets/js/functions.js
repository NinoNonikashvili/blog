import $ from 'jquery';
import * as validations from './validations';
import Swiper from 'swiper/bundle';

const baseUrl = 'https://api.blog.redberryinternship.ge/api';

const token = 'Bearer d2e9a0063133e84f32659f466d83c70750661bb2059e30a473ee062dee27a59f';

  const filterPosts = (selectedCategories) =>{
        $('[data-post]').each(function(){
     
        let post = $(this);
        let display = false;
        if(selectedCategories.length === 0) {
            post.show();
        }else{
            selectedCategories.forEach(cat => {
            
            if(post.data("categories").includes(cat.replace(/\s/g, ""))){
                display = true;
                }
            })
            display ? post.show() : post.hide();
        }
        
        
        })
  }
  const rgbToHex = (rgb) => {
    // Split the RGB values
    var rgbArray = rgb.match(/\d+/g);
    // Convert each value to hexadecimal and concatenate
    return '#' + rgbArray.map(function (value) {
      return ('0' + parseInt(value).toString(16)).slice(-2);
    }).join('');
  }
  const selectCategories = (postValidations) =>{
    let selectedCatInput = []

    let selectedCatsOnLS = localStorage.getItem('selectedCatInput');
    if(typeof(selectedCatsOnLS) === 'string' ){
      postValidations.isCatValid($('#postCat'));
    }
    
    postValidations.setFinalStatus($('#postSubmitBtn'));
    if(typeof(selectedCatsOnLS) === 'string' && selectedCatsOnLS.length !== 0){
      $('#postCat').empty();
      selectedCatsOnLS.split(',').forEach(cat => {
        cat = cat.split('~');
        
        $('#postCat').append(
          displayCategories(cat[0], cat[1], cat[2], 'data-form-cat-selected', cat[3])
        )
      })
      selectedCatInput = selectedCatInput.concat(selectedCatsOnLS.split(','))
    }



    $('[data-form-cat]').each(function(){
      let btn = $(this);
      
      
      btn.on('click', function(){
       
         let isSelected =  selectedCatInput.find(catStr => { 
          return catStr.includes(btn.text().trim())});
         if(isSelected){
          selectedCatInput.splice(selectedCatInput.indexOf(isSelected),1);
         }else{
          let btnData = btn.text().trim() + '~'+rgbToHex(btn.css('color'))+'~'+rgbToHex(btn.css('background-color'))+'~'+btn.data('id');
          selectedCatInput.push(btnData);
         }
        

        localStorage.setItem('selectedCatInput', selectedCatInput);
        postValidations.isCatValid($('#postCat'));
        postValidations.setFinalStatus($('#postSubmitBtn'));
        //display selected categories in input field
        $('#postCat').empty();
        selectedCatInput.forEach(cat => {
          let btnData = cat.split('~');

          $('#postCat').append(
            displayCategories(btnData[0], btnData[1], btnData[2], 'data-form-cat-selected', btnData[3])
          )
        })
      })
      
    })
    
  }
  const displayAddPostPage = () =>{

    let categories = localStorage.getItem('categories');
    $('#postDate').on('click', function(){
      $(this).trigger('focus')
    })

    if(typeof(categories) === 'string' && categories.length !== 0){

      //populate category dropdown with categories
      $('#catDropdown').empty();
      categories.split(',').forEach(cat => {
        cat = cat.split('~');
        $('#catDropdown').append(
          displayCategories(cat[0], cat[2], cat[1], 'data-form-cat', cat[3])
        )
      })

    }
    
    //update layout and save state on localstorage
    $('#mainContent').hide();
    $('#addPostPage').show();
    $('#addPostPage').removeClass('bg-shadow');
    $('#uploadPopup').hide();
    $("#backFromPostForm").on('click', function(){
      $('#mainContent').show();
      $('#addPostPage').hide();   
      localStorage.setItem('isAddPostPage', false);
    }
      
    )
    localStorage.setItem('isAddPostPage', true);

    //toggle dropdown
    $('#catDropdownToggle').on('click', function(){
      if($('#catDropdown').css('visibility') === 'visible'){
        $('#catDropdown').css('visibility', 'hidden');
      }else{
        $('#catDropdown').css('visibility', 'visible');
      }
    })

  


    validateForm();
    

    
  }
  const dragAndDrop = (postValidations)=>{
  //set layout on default
  $("#dropZone").show();
  $('#selectedImgWrapper').hide();

    const supportsFileSystemAccessAPI =
    "getAsFileSystemHandle" in DataTransferItem.prototype;
  const supportsWebkitGetAsEntry =
    "webkitGetAsEntry" in DataTransferItem.prototype;
  
  const elem = $("#dropZone");
  
  elem.on("dragover", (e) => {
    // Prevent navigation.
    e.preventDefault();
    elem.css('border', "0.0625rem solid #85858D")
  });
  
  elem.on("dragenter", (e) => {
    elem.css('border', "0.0625rem solid #85858D")
  });
  
  elem.on("dragleave", (e) => {
    elem.css('border', "0.0625rem dashed #85858D")
  });

  
  elem.on("drop", async (e) => {
    e.preventDefault();
    elem.css('border', "0.0625rem dashed #85858D")
      // Check if dataTransfer is available in the event object
  const dataTransfer = e.originalEvent.dataTransfer || e.dataTransfer;
  if (!dataTransfer) {
    console.error("Data transfer not available.");
    return;
  }

  
    const fileHandlesPromises = [...dataTransfer.items]
      .filter((item) => item.kind === "file")
      .map((item) =>
        supportsFileSystemAccessAPI
          ? item.getAsFileSystemHandle()
          : supportsWebkitGetAsEntry
          ? item.webkitGetAsEntry()
          : item.getAsFile()
      );
  
    for await (const handle of fileHandlesPromises) {
      if (handle.kind === "directory" || handle.isDirectory) {
      } else {
        const img = await handle.getFile();
        const url = URL.createObjectURL(img);
        const reader = new FileReader();

            reader.addEventListener('load', () => {
              localStorage.setItem('image', reader.result);
            });

        reader.readAsDataURL(img);
        localStorage.setItem('postImg', img);
        localStorage.setItem('postImgName', handle.name);
        $('#selectedImgWrapper').show();
        $('#dropZone').hide();
        $('#selectedImgWrapper').children('div').children('p').text(handle.name);
        addListenerToDeleteSelectedImg(postValidations);
        postValidations.isImgValid(true);
        postValidations.setFinalStatus($('#postSubmitBtn'));
        
      }
    }
  });
  }
  const displayCategories = (cat, color, bg, data_cat, id=false) => {


    return `<button ${id ? `data-id=${id} `: ''} ${data_cat}  class="category" style="color: ${color}; background-color: ${bg}">${cat}</button>`
  }
  const displayPosts = (post, single = false, swiper_class = '', timeoutId = false) => {
  
    //format date + check if date is valid
    let date = convertToCustomFormat(post.publish_date, 'DD.MM.YYYY');
    //add email to date if present
    if(post?.email){
      date += ' • ' + post.email;
    }
    let categoryBtns = '';
    let categoryDataAttr = '';
    post.categories.forEach(function(cat, index){
      categoryBtns += displayCategories(cat.title, cat.text_color, cat.background_color, 'data-category') + ' ';
      if(index + 1 === post.categories.length){
        categoryDataAttr += cat.title;
      }else{
        categoryDataAttr += cat.title + ',';
      }
      
    })
    categoryDataAttr = categoryDataAttr.replace(/\s/g, "");
  

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
        return true
    }else{
  
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
  const closeUploadPopUp = () =>{
    $('#addPostPage').removeClass('bg-shadow');
    $('#uploadPopup').hide();
  }
  const setUpUploadPopup = () =>{
    $('#uploadPopup').show();
    $('#addPostPage').addClass('bg-shadow');
    $('#closeUploadPopup').on('click', function(){
      closeUploadPopUp();
    })
    $('#uploadSuccessBtn').on('click', function(){
      $('#mainContent').show();
      $('#addPostPage').hide();
      $('#addPostPage').removeClass('bg-shadow');
      $('#uploadPopup').hide();
      

    })
    //clear localstorage post data
    localStorage.setItem('postTitle', '');
    localStorage.setItem('postDesc', '');
    localStorage.setItem("image", '');
    localStorage.setItem('postAuthor', '');
    localStorage.setItem('postDate', '');
    localStorage.getItem('selectedCatInput', '')
    localStorage.setItem('postEmail', '');
    //clear inputs
     $('#selectedImgWrapper').hide();
     $('#dropZone').show();
     $('#postAuthor').val('');
     $('#postAuthor').removeClass('input--success');
     $('#postTitle').val('');
     $('#postTitle').removeClass('input--success');
     $('#postDesc').val('');
     $('#postDesc').removeClass('input--success');
     $('#postDate').val('');
     $('#postDate').removeClass('input--success');
     $('#postCat').empty();
     $('#postCat').removeClass('input--success');
     $('#postEmail').val('');
     $('#postEmail').removeClass('input--success');
     $('#postAuthorWrongLang').removeClass('hint--success');
     $('#postAuthorWrongSymbol').removeClass('hint--success');
     $('#postAuthorWrongWord').removeClass('hint--success');
     $('#postTitleWrong').removeClass('hint--success');
     $('#postDescWrong').removeClass('hint--success');
  }
  
  const setupAuthPopUp = (url, token) => {
    $('#mainContent').addClass('bg-shadow');
    $('#authorizationPopup').show();
    $('#popUpCheck').show();
    $('#popUpSuccess').hide();
    $('#authEmailEmpty').hide();
    $('#authEmailWrong').hide();
    $('#authEmailNone').hide();
    $('#authSubmit').addClass('disabled');
    $('#authSubmit').prop('disabled', true);
  
      //initialize validator object
      const authEmailValidation = new validations.EmailValidation();
  
    $('#closeAuthPopup').on('click', function(){
      closePopUp(authEmailValidation);
    })
    $('#authEmail').on('input', function(){
      let email = $(this);
      //if input is not correct add error message and apply styles
      authEmailValidation.isEmailValid(email, email.val().trim());
      let submitBtn = $('#authSubmit');
      authEmailValidation.setFinalStatus(submitBtn);
      localStorage.setItem('authEmail', email.val().trim())
    });
      //only clickable when input is correct
  
    $('#authSubmit').on('click', function(){
  
      //send request to check email
      let email = $('#authEmail').val();
      let data = {
        "email": email
      }
  
      fetch(url + '/login', {
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
            displayAddPostPage(url, token);
  
          })
          //update loggedIn state on localstorage
          localStorage.setItem('loggedIn', true);
          $('#authSuccessBtn').on('click', function(){
            closePopUp(authEmailValidation);
        })
  
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
      flag = false;
      if(post.id !== post_id){
          post.categories.forEach(cat =>{
              if(categories.includes(cat.title)){
                  flag = true;
              }
          })
          if(flag){
            similar_posts.push(post);
  
          }
      }
  
      
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
        let appendPost = (id) =>{
          $('#postSwiperWrapper').append(
    
            displayPosts(post, false, 'swiper__posts-wraper__post swiper-slide')
          )
        }
        let id = setTimeout(appendPost, checkDate, id)
        // clearTimeout(id);
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
  const addListenerToDeleteSelectedImg = (postValidations) =>{
    $('#deleteSelectedImg').on('click', function(){
      $('#dropZone').show();
      $('#selectedImgWrapper').hide();
      localStorage.setItem('postImg', '');
      localStorage.setItem('postImgName', '');
      postValidations.isImgValid(false);
      postValidations.setFinalStatus($('#postSubmitBtn'))
    })
    
  }

  const validateForm = () =>{

    
    const postValidations = new validations.PostValidations();
    //get form elements
    let postImg = $('#postImg');
    let postAuthor = $('#postAuthor');
    let postTitle = $('#postTitle');
    let postDesc = $('#postDesc');
    let postDate = $('#postDate');
    let postCat = $('#postCat');
    let postCatToggle = $('#catDropdownToggle');
    let postEmail = $('#postEmail');
    let postSubmitBtn = $('#postSubmitBtn');

    //implement drag and drop on img
    dragAndDrop(postValidations);

    //handle categories
    selectCategories(postValidations);
    
    //clicks
    postImg.on('input', function(e){
      //save on localstorage
      let img = $(this);
      if (img.prop('files') && img.prop('files').length > 0) {

           // Use the first selected file
           const selectedFile = img.prop('files')[0];


           const reader = new FileReader();

            reader.addEventListener('load', () => {
              localStorage.setItem('image', reader.result);
            });

            reader.readAsDataURL(selectedFile);


           localStorage.setItem('postImg', selectedFile)
           localStorage.setItem('postImgName', img.prop('files')[0]['name']);
           $('#dropZone').hide();
           $('#selectedImgWrapper').show();
           $('#selectedImgWrapper').children('div').children('p').text(img.prop('files')[0]['name']);
           addListenerToDeleteSelectedImg(postValidations);
           postValidations.isImgValid(true);
           postValidations.setFinalStatus($('#postSubmitBtn'))
  
      }
      

      
      //check if valid
      //apply styles
      //validate input in validation object as its value is mindfucking
      //update formstate -> submit button
    });
    postAuthor.on('input', function(){
      let btn = $(this);
      //save on localstorage
      localStorage.setItem('postAuthor', postAuthor.val().trim())
      //check if valid and apply styles
      postValidations.isAuthorValid(btn);
      //update formstate -> submit button
      postValidations.setFinalStatus($('#postSubmitBtn'));
    });
    postTitle.on('input', function(){
      let btn = $(this);
      
      //save on localstorage
      localStorage.setItem('postTitle', postTitle.val().trim())
      //check if valid and apply styles
      postValidations.isTitleValid(btn);
      //update formstate -> submit button
      postValidations.setFinalStatus($('#postSubmitBtn'));
    });
    postDesc.on('input', function(){
      let btn = $(this);
      //save on localstorage
      localStorage.setItem('postDesc', postDesc.val().trim())
      //check if valid and apply styles
      postValidations.isDescValid($(btn));
      //update formstate -> submit button
      postValidations.setFinalStatus($('#postSubmitBtn'));
    });
    postDate.on('input', function(){
      let btn = $(this);
      //save on localstorage
      localStorage.setItem('postDate', postDate.val().trim())
      //check if valid and apply styles
      postValidations.isDateValid(btn);
      //update formstate -> submit button
      postValidations.setFinalStatus($('#postSubmitBtn'));
    });
    //category is handled differently
    // postCat.on('change', function(){
    //   let btn = $(this)
    //   //save on localstorage

    //   //check if valid and apply styles
    //   postValidations.isCatValid(btn);
    //   //update formstate -> submit button
    //   postValidations.setFinalStatus($('#postSubmitBtn'));
    // });
    postEmail.on('input', function(){
      let btn = $(this);
      //save on localstorage
      localStorage.setItem('postEmail', postEmail.val().trim())
      //check if valid
      //apply styles
      postValidations.isEmailValid(btn);
      //update formstate -> submit button
      postValidations.setFinalStatus($('#postSubmitBtn'))
    });




    if(typeof(localStorage.getItem('postImg')) === 'string' && localStorage.getItem('postImg').length !== 0){
      $('#dropZone').hide();
      $('#selectedImgWrapper').show();
      $('#selectedImgWrapper').children('div').children('p').text(localStorage.getItem('postImgName'));
      addListenerToDeleteSelectedImg(postValidations);
      //validation value is not updated here so no need to check form state
      postValidations.valIsImglValid = true;
    }
    if(typeof(localStorage.getItem('postAuthor')) === 'string' && localStorage.getItem('postAuthor').length !== 0){
      postAuthor.val(localStorage.getItem('postAuthor'))
      postAuthor.trigger('input');
    }
    if(typeof(localStorage.getItem('postTitle')) === 'string' && localStorage.getItem('postTitle').length !== 0){
      postTitle.val(localStorage.getItem('postTitle'))
      postTitle.trigger('input');
      
    }
    if(typeof(localStorage.getItem('postDesc')) === 'string' && localStorage.getItem('postDesc').length !== 0){
      postDesc.val(localStorage.getItem('postDesc'))
      postDesc.trigger('input');
    }
    if(typeof(localStorage.getItem('postDate')) === 'string' && localStorage.getItem('postDate').length !== 0){
      postDate.val(localStorage.getItem('postDate'))
      postDate.trigger('input');
    }
    //category is handles differently in selectCategory
    if(typeof(localStorage.getItem('selectedCatInput')) === 'string' && localStorage.getItem('selectedCatInput').length !== 0){
      //cast string to array
      postValidations.valIsCatValid = true;
    }
    if(typeof(localStorage.getItem('postEmail')) === 'string'){
      postEmail.val(localStorage.getItem('postEmail'))
      postEmail.trigger('input');
    }
        //set form state on refresh 
        postValidations.setFinalStatus($('#postSubmitBtn'));

    //add click listener on submit button
    $('#postSubmitBtn').on('click', function(){
      //collect data
      let categories = localStorage.getItem('selectedCatInput').split(',');
      let cat_ids = categories.map(cat => { return parseInt(cat.split('~')[3])});
      let img2 = localStorage.getItem('image');



      //image blob
      fetch(img2)
      .then(response => response.blob())
      .then(blob => {
        // Use the blob as needed, for example, append it to FormData
        // Create FormData object
      let formData = new FormData();
      formData.set("title", localStorage.getItem('postTitle'));
      formData.set("description", localStorage.getItem('postDesc'));
      formData.set("image", blob);
      formData.set("author", localStorage.getItem('postAuthor'));
      formData.set("publish_date", localStorage.getItem('postDate'));
      formData.set("categories", JSON.stringify(cat_ids));
      formData.set("email", localStorage.getItem('postEmail'));

      //create post
      addPostRequest(baseUrl+'/blogs', token, formData)
      })
      .catch(error => console.error('Error fetching image:', error));
 
        


    })

  }

  const addPostRequest = (url, token, data) => {
    fetch(url, {
      method: 'POST',
      headers: {
          'Authorization': token,
          'accept': 'application/JSON'
      },
      body: data
      
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
            //adjust layout

      setUpUploadPopup();
      return response.json();





    })
    .then(data => {

  
    })
    .catch(error => {
      console.error('Error:', error);
    });
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