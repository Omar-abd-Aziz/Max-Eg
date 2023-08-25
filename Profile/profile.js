
/* start import all firebase methods filles from firebase js*/
import {firebaseConfig,initializeApp ,getFirestore,getCountFromServer, collection, query, where, getDocs,getDoc, setDoc, addDoc, doc,deleteDoc,onSnapshot,orderBy, limit,startAt, startAfter,endAt  } from "../firebase.js";

firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = firebase.storage();

let X;

async function getCit(db,X) {
  const citiesCol = collection(db,`${X}`);
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  return cityList;
}
/* 1 end Link firebase*/






/* 2 start get user doc and main person data */

let mainPersonData;
let userProfileData;
let docId=localStorage.getItem("max-eg-doc-id");

// console.log(docId)

/* 2 end get user doc and main person data */



/* 7 start get person data with id from url and check if he the main person or not*/

if(docId!==null&&docId!==''&&docId!==undefined){

  await getDoc(doc(db, "accounts", docId)).then(e=>{
    mainPersonData=e.data()
    document.querySelector('.main-person-img').src=e.data().personImg;
  });

  let url = window.location.href;
  let searchParams = new URL(url).searchParams; 
  let urlSearchParams = new URLSearchParams(searchParams);
  let personid = urlSearchParams.get('PersonId');


  if(true){

    if(personid!==''||personid!==undefined)
    {
      await getDoc(doc(db, "accounts", personid)).then(e=>{
        userProfileData=e.data();
        // console.log(userProfileData);
        document.querySelectorAll('.person-name').forEach(element=>{
          element.innerHTML=e.data().name||e.data().username;
        });
  
        document.querySelectorAll('.person-img').forEach(element=>{
          element.src=e.data().personImg;
        });


        console.log(userProfileData.id);
        console.log(mainPersonData.id);
    
        if(userProfileData.id!==mainPersonData.id){
    
          document.querySelector('#label-change-person-img').style.display='none'
          document.querySelector('.person-img-notChange').style.display='block'
        }

        let img = document.querySelector(".person-img-notChange")
        img.addEventListener("click",()=>{
          Swal.fire({
            imageUrl: `${img.src}`,
            imageAlt: 'A image'
          })
        })
    

        ShowAllPosts();
  
      });
    }


    if(mainPersonData.friends.find(element=>element.personId==personid)!==undefined||personid==docId){
      document.querySelector('.sendFriendRequest').style.display='none'
    }



  }
  

} else {
  location.href="./login/login.html"
}

/* 7 end get person data with id from url and check if he the main person or not*/



















/* 2 start get all accounts */
// let AllAccounts;
// function getCards() {
//   getCit(db, 'accounts').then(async (e) => {
//     AllAccounts = e;
//     // console.log(AllAccounts)
//   })
// }
/* 2 end get all accounts */




/* 3 start set id on all Posts */
// function setIdForAllPosts(){
//   getDocs(collection(db,"posts")).then(snap=>{
//       snap.docs.forEach(el=>{
//           setDoc(doc(db,"posts",el.id), {
//               ...el.data(),
//               id: el.id,
//           })
//       })
//       getPosts()
//   })
// }
// setIdForAllPosts()
/* 3 end set id on all docs */


/* 4 start get person Posts */
let AllPosts;
let personPosts;
function getPosts() {

  let url = window.location.href;
  let searchParams = new URL(url).searchParams; 
  let urlSearchParams = new URLSearchParams(searchParams);
  let personid = urlSearchParams.get('PersonId');
  
  getCit(db, 'posts').then(async (e) => {
    AllPosts = e;
    personPosts=AllPosts.filter(e=>e.personId==personid);
    
    personPosts=personPosts.sort(function(a, b) {
      return a.textTime - b.textTime;
    });
    
    personPosts=personPosts.reverse();

    showPosts(personPosts);
  })
}
/* 4 end get person Posts */



/* 5 start function to show Posts */

// function showPosts(personPosts){
//   personPosts.forEach(e=>{

//     if(e.textImg=="undefined"){
//       document.querySelector('.posts-dad').innerHTML+=`
    
//       <div class="post-container">
//         <div class="post-row">
//           <div class="user-profile">
//             <img src="images/profile-pic.jpg" class="person-img"/>
//             <div>
//               <p class="person-name"> </p>
//               <span>${e.textDate}</span>
//             </div>
//           </div>
//           <a><i class="fa-solid fa-ellipsis-v remove-post" data-personid="${e.personId}" data-postid="${e.id}"></i></a>
//         </div>
//         <p class="post-text" dir="auto">
//           ${e.text}
//         </p>
  
        
//       </div>
    
    
//     `
//     } else{

//       document.querySelector('.posts-dad').innerHTML+=`
      
//         <div class="post-container">
//           <div class="post-row">
//             <div class="user-profile">
//               <img src="images/profile-pic.jpg" class="person-img"/>
//               <div>
//                 <p class="person-name"> </p>
//                 <span>${e.textDate}</span>
//               </div>
//             </div>
//             <a><i class="fa-solid fa-ellipsis-v remove-post" data-personid="${e.personId}" data-postid="${e.id}"></i></a>
//           </div>
//           <p class="post-text" dir="auto">
//             ${e.text}
//           </p>
//           <img src="${e.textImg}" class="post-img" />
    
          
//         </div>
      
//       `
//     }
//   })
// };

/* 5 start function to show Posts */



/*05 start return All Posts */

let AllPostsByUser;

async function forAllPosts(X){

  // console.log(userProfileData.id)
  let q = query(collection(db, "posts"),where("personId","==",`${userProfileData.id}`), orderBy("textTime","desc"), limit(X||10));
  let querySnapshot = await getDocs(q);
  let List = querySnapshot.docs.map(doc => doc.data());

  AllPostsByUser=List;
  return AllPostsByUser;
};

/*05 end return All Posts  */









/* 5 start function to show Allposts */

// ShowAllPosts();

async function ShowAllPosts() {

    document.querySelector('.posts-dad').innerHTML=``;

    await forAllPosts(5).then(e=>{
        // console.log(e)
        ToShowAllPosts(e);
    });
    

};

/* 5 end function to show Allposts */















/* 08 start ShowAllPosts */

async function ToShowAllPosts(DataToShow){

  AllPosts=DataToShow;
  
  AllPosts.forEach(onePosts=>{

      
      if(onePosts.textImg!=="undefined"){
         
          document.querySelector('.posts-dad').innerHTML+=`
      
          <div class="fb-post">
              <div class="fb-post-container">
                  <div class="fb-p-main">
                      <div class="post-title" style="position: relative;">
  
                          <div style="display: flex; padding: 5px; position: relative; top: 20px; left: 30px; transform: translate(-50%, -50%); margin-right: 10px;">
                              <label style="width: 50px; height: 50px; overflow: hidden; border-radius: 50px;">
                                  <img src="${onePosts.personImg}" loading="lazy" class="profile-btn" data-personid="${onePosts.personId}" alt="user picture">
                              </label>
                          </div>
  
                          <ul>
                              <li><h3 style="font-family: system-ui;">${onePosts.personName}</h3></li>
                              <li><span>${onePosts.textDate}</span></li>
                          </ul>

                          <a class="postEditDad"><i class="fa-solid fa-ellipsis-v remove-post" data-personid="${onePosts.personId}" data-postid="${onePosts.id}"></i></a>

                          
                          <div class="PostTextDiv" postId="${onePosts.id}" style="margin: 0px 10px 10px; width: 100%; font-size: 20px; font-family: system-ui;" dir="auto" >${onePosts.text.trim()}</div>

                      </div>
  
                      <div class="post-images">
                          <div class="post-images" style="width: 100%;">
                              <img src="${onePosts.textImg}" loading="lazy" alt="post images 01" style="border: 3px solid white;">
                          </div>
                      </div>
  
                      <div class="like-comment">
                          <ul>
                          <li>
                              <img id="like-img${onePosts.id}" class="like-btn" data-postid="${onePosts.id}" src="./images/like.webp" alt="like" style="cursor: pointer;">
                              <span class="liksNum${onePosts.id}">
                              ${


                                  ((eval(
                                      getPostLikesCount(onePosts.id).then((el)=>{
                                          el=el[0];
                                        
                                          if(el.count===0){
                                              document.querySelector(`.liksNum${onePosts.id}`).textContent='';
                                          } else{
                                              document.querySelector(`.liksNum${onePosts.id}`).textContent=el.count;

                                              if(el.docPersonHaveLike!==undefined){

                                                  let likeid=el.docPersonHaveLike.id;
                                                  
                                                  document.querySelector(`#like-img${onePosts.id}`).src="./images/like-blue.webp";
                                                  // console.log("x")
                                                  document.querySelector(`#like-img${onePosts.id}`).dataset.likeid=likeid;
                                              };

                                          }

                                      })
                                  ))=="[object Promise]")?"":""

                              }
                              </span>
                          </li>
                              <li><i class="fa-regular fa-comment-dots"></i> <span></span></li>
                              <li><i class="fa-solid fa-share-from-square"></i> <span></span></li>
                          </ul>
                      </div>
                  </div>
              </div>
          </div>
      
          `
      } else{
          
  
          document.querySelector('.posts-dad').innerHTML+=`
      
          <div class="fb-post">
              <div class="fb-post-container">
                  <div class="fb-p-main">
                      <div class="post-title" style="position: relative;">
  
                          <div style="display: flex; padding: 5px; position: relative; top: 20px; left: 30px; transform: translate(-50%, -50%); margin-right: 10px;">
                              <label style=" width: 50px; height: 50px; overflow: hidden; border-radius: 50px;">
                                  <img  src="${onePosts.personImg}" loading="lazy" class="profile-btn" data-personid="${onePosts.personId}" alt="user picture">
                              </label>
                          </div>
  
                          <ul>
                              <li><h3 style="font-family: system-ui;">${onePosts.personName}</h3></li>
                              <li><span>${onePosts.textDate}</span></li>
                          </ul>

                          <a class="postEditDad"><i class="fa-solid fa-ellipsis-v remove-post" data-personid="${onePosts.personId}" data-postid="${onePosts.id}"></i></a>



                          <div class="PostTextDiv" postId="${onePosts.id}" style="width: 100%; font-size: 20px; font-family: system-ui;" dir="auto" >${onePosts.text.trim()}</div>
                          
                      </div>

  
                      <div class="like-comment">
                          <ul>
                              <li>
                                  <img id="like-img${onePosts.id}" class="like-btn" data-postid="${onePosts.id}" src="./images/like.webp" alt="like" style="cursor: pointer;">
                                  <span class="liksNum${onePosts.id}">
                                  ${
                                      

                                      ((eval(
                                          getPostLikesCount(onePosts.id).then((el)=>{

                                              
                                              el=el[0];
                                              
                                              
                                              if(el.count===0){
                                                  document.querySelector(`.liksNum${onePosts.id}`).textContent='';
                                              } else{
                                                  document.querySelector(`.liksNum${onePosts.id}`).textContent=el.count;
                                                  
                                                  if(el.docPersonHaveLike!==undefined){

                                                      let likeid=el.docPersonHaveLike.id;
                                                      
                                                      document.querySelector(`#like-img${onePosts.id}`).src="./images/like-blue.webp";
                                                      
                                                      document.querySelector(`#like-img${onePosts.id}`).dataset.likeid=likeid;
                                                  };
                                              
                                              }

                                          })
                                      ))=="[object Promise]")?"":""




                                  }
                                  </span>
                              </li>
                              <li><i class="fa-regular fa-comment-dots"></i> <span></span></li>
                              <li><i class="fa-solid fa-share-from-square"></i> <span></span></li>
                          </ul>
                      </div>
                  </div>
              </div>
          </div>
      
          `
      };

  });



document.querySelector('.posts-dad').innerHTML+=`<button style="display: none;" class="loadMorePosts">more</button>`
};

/* 08 end ShowAllPosts */










/* 09 start function getPostLikesCount and docPersonHaveLike */ 

async function getPostLikesCount(postId){

  let q = query(collection(db, "posts", `${postId}`, "PostLikes"));
  let snapshot = await getCountFromServer(q);
  let docPersonHaveLike=undefined;

  if(snapshot.data().count!==0){
      let qq1 = query(collection(db, "posts", `${postId}`, "PostLikes"), where("personId","==",mainPersonData.id));
      let qq2 = await getDocs(qq1);
      let qq3 = qq2.docs.map(doc => doc.data());
      await qq3.forEach(e=>{
          // console.log("doc of like person have :", e );
          docPersonHaveLike = e;
      })
  }

  return [{
      count: snapshot.data().count,
      docPersonHaveLike: docPersonHaveLike,
  }]
}

/* 09 end function getPostLikesCount and docPersonHaveLike */ 






/* 14 start function LikeBtn */

async function LikeBtn(postId,LikeBtn){


  if(`${LikeBtn.src}`.includes("like.webp")){
      
      let randomId = parseInt(Math.random()*10000000);

      

      setDoc(doc(db, "posts", `${postId}`, "PostLikes",`${randomId}`),{
          id: randomId,
          personName: mainPersonData.name||mainPersonData.username,
          personId: mainPersonData.id,
          personImg: mainPersonData.personImg||"https://img.freepik.com/free-icon/user_318-159711.jpg",
      });


      
      LikeBtn.dataset.likeid=randomId;

      LikeBtn.parentNode.children[1].innerHTML=`${Number(LikeBtn.parentNode.children[1].innerHTML)+1}`

      LikeBtn.src='./images/like-blue.webp';

  } else if(`${LikeBtn.src}`.includes("like-blue.webp")){

      let likeId=LikeBtn.dataset.likeid;
      let likeDoc=doc(db, "posts", postId, "PostLikes", likeId);

      deleteDoc(likeDoc);

      let numberText=LikeBtn.parentNode.children[1].textContent;


      if(Number(numberText)-1==0){
          LikeBtn.parentNode.children[1].textContent="";
      } else{
          LikeBtn.parentNode.children[1].textContent=Number(numberText)-1;
      };

      LikeBtn.src="./images/like.webp";

  };


};

/* 14 end function LikeBtn */



/* 06 start loadMorePosts */

async function loadMorePosts(X){
  let q = query(collection(db, "posts"),where("personId","==",`${userProfileData.id}`), orderBy("textTime","desc"), limit(X||10),startAfter(AllPosts[AllPosts.length-1].textTime));
  let querySnapshot = await getDocs(q);
  let List = querySnapshot.docs.map(doc => doc.data());
  return List;
}

/* 06 end loadMorePosts */







/* 07 start get more posts on scrool */

window.onscroll=async ()=>{
    
  let triggerHeight = window.scrollY + document.body.offsetHeight;

  if(window.scrollY+window.innerHeight >= document.body.scrollHeight-1){

      document.querySelector(".loadMorePosts").click();
      document.querySelector(".loadMorePosts").remove()
  };


};

/* 07 end get more posts on scrool */






/* 8 start function to uploadImage and change profile image*/


document.querySelector("#change-person-img").addEventListener("change", function () {
  
  uploadImage();

})



async function uploadImage() {

  const ref = firebase.storage().ref();
  const file = document.querySelector("#change-person-img").files[0];
  const name = +new Date() + "-" + file.name;
  const metadata = {
    contentType: file.type
  };

  const task = ref.child(name).put(file, metadata);
  task
  .then(async snapshot => snapshot.ref.getDownloadURL())
  .then(async url => {

    // console.log(url);
    document.querySelector('.main-person-img').src=url

    setDoc(doc(db, "accounts", `${localStorage.getItem("max-eg-doc-id")}`), {
      ...mainPersonData,
      personImg: url,
    });

  })
  .catch(console.error);

}

/* 8 end function to uploadImage and change profile image*/









/* 9 start Settings Menu Toggle */

let settingsMenuBtn = document.querySelector(".settingsMenuBtn")
let settingsmenu = document.querySelector(".settings-menu");
settingsMenuBtn.addEventListener("click",()=>{
  settingsMenuToggle()
})


function settingsMenuToggle() {
  settingsmenu.classList.toggle("settings-menu-height");
}



/* 9 end Settings Menu Toggle */









/* 10 start on window click fuction */

window.onclick=(e)=>{


  if(e.target.classList.value.includes("person-name")&&userProfileData.id==docId){
        
    Swal.fire({
      title: 'Change Name',
      input: 'text',
      inputValue: `${e.target.textContent.trim()}`,
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Save',
      showLoaderOnConfirm: true,
      preConfirm: async(newName) => {

        newName=newName.trim();

        if(newName!==''){

          setDoc(doc(db, "accounts", `${userProfileData.id}`), {
            ...userProfileData,
            name: newName,
          }).then(e=>{
            document.querySelectorAll(".person-name").forEach(e=>{
              e.textContent=`${newName}`;
            });

            
            Swal.fire(
              'Done',
              '',
              'success'
            );
          })
              
        }else{
          Swal.fire(
            'Error',
            '',
            'error'
          );
        };
          
          
      },
      allowOutsideClick: () => !Swal.isLoading()
    })

  } 


  if(e.target.classList.value.includes("loadMorePosts")){
        
    loadMorePosts(4).then(e=>{
        ToShowAllPosts(e);
    });

  } 

  /* start Like btn*/

  if(e.target.classList.value.includes("like-btn")){
    let postId=e.target.dataset.postid;

    LikeBtn(postId,e.target);

  };

  /* end Like btn*/


  if(e.target.classList.value.includes("logout")){
    localStorage.setItem("max-eg-doc-id", "");
    location.href='../login/login.html'
  }


  if(e.target.classList.value.includes("remove-post")){

    if(docId==e.target.dataset.personid){

      Swal.fire({
        title: 'Are you Want To delete This Post?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {

          let postToRemove=e.target.parentNode.parentNode.parentNode;
          removePost(e.target.dataset.postid,postToRemove);

          Swal.fire(
            'Deleted!',
            'Your Post has been deleted.',
            'success'
          );
        };
      });
      
      
    } else{


      Swal.fire({
        title: 'Are you Want To Report About This Post?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Report!'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Reported!',
            'Your Report has been Send.',
            'success'
          );
        };
      });


    };


  }


};

/* 10 end on window click fuction */





/* 11 start btn to send friend request */

document.querySelector('.sendFriendRequest').addEventListener('click',async ()=>{
  
  let docId=localStorage.getItem("max-eg-doc-id")

  const url = window.location.href;
  const searchParams = new URL(url).searchParams; 
  const urlSearchParams = new URLSearchParams(searchParams);
  let personid = urlSearchParams.get('PersonId');

  await getDoc(doc(db, "accounts", personid)).then(e=>{
    let friendRequests=e.data().friendRequests;

    if(friendRequests.find(e=>e.personId==`${docId}`)==undefined){

      friendRequests.push({
        personId: docId,
        personImg: mainPersonData.personImg,
        personName: mainPersonData.name||mainPersonData.username,
      })

      setDoc(doc(db,"accounts",`${personid}`), {
        ...e.data(),
        friendRequests: friendRequests,
      })
    }
    

    Swal.fire(
      ' ',
      'A friend request has been sent',
      'success'
    )

  });

})

/* 11 end btn to send friend request */







/* 12 start function to get data now */
function showDate(){
  
  const d = new Date();
  
  let year = d.getFullYear();
  let month = d.getMonth();
  let day = d.getDate();
  let hour = d.getHours();
  let mint = d.getMinutes();
  
  if(mint<10){
    mint=`0${mint}`
  }
  
  let dateNow;

  if (hour>12){
    
    dateNow= `
      ${year}/${month+1}/${day}
      => ${hour-12}:${mint} PM
      `;

  } else if (hour<=12){
    
      dateNow = `
      
      ${year}/${month+1}/${day}
      => ${hour}:${mint} AM
      
      `;
  }
  return dateNow;
}


/* 12 end function to get data now */










/* start function to remove post */


function removePost(postId,postToRemove){

  let ref = doc(db,"posts", postId);
  deleteDoc(ref);
  postToRemove.parentNode.parentNode.remove()

}

/* end function to remove post */












/* 11 start btn for dark theam */

var darkButton = document.querySelector(".darkTheme");
if(localStorage.getItem("darkTheme")==="dark"){
  // console.log("dark theme");
  document.body.classList.toggle("dark-theme");
  darkButton.classList.toggle("fa-sun");
  darkButton.classList.toggle("fa-moon");
}else{
  // console.log("white theme");
}

darkButton.onclick = function(){
    darkButton.classList.toggle("fa-sun");
    darkButton.classList.toggle("fa-moon");
    document.body.classList.toggle("dark-theme")

    if([...document.body.classList].includes("dark-theme")){
        localStorage.setItem("darkTheme","dark");
    } else{
        localStorage.setItem("darkTheme","white");
    }

};
/* 11 end btn for dark theam */
