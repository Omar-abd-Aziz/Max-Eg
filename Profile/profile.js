

/* 1 start Link firebase*/
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js';
import { getFirestore, collection, getDocs,getDoc, setDoc, addDoc, doc } from 'https://www.gstatic.com/firebasejs/9.8.2/firebase-firestore.js';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyC9_NRBMWMhilmQ-rYHu8YXC5aXMucxdWU",
    authDomain: "max-eg.firebaseapp.com",
    projectId: "max-eg",
    storageBucket: "max-eg.appspot.com",
    messagingSenderId: "832213298246",
    appId: "1:832213298246:web:149af181774289bd2eae47",
    measurementId: "G-PR45N85QT2"
};

firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let X;

async function getCit(db,X) {
  const citiesCol = collection(db,`${X}`);
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  return cityList;
}
/* 1 end Link firebase*/



/* 2 start get all accounts */
let AllAccounts;
function getCards() {
  getCit(db, 'accounts').then(async (e) => {
    AllAccounts = e;
    // console.log(AllAccounts)
  })
}
/* 2 end get all accounts */




/* 3 start set id on all Posts */
function setIdForAllPosts(){
  getDocs(collection(db,"posts")).then(snap=>{
      snap.docs.forEach(el=>{
          setDoc(doc(db,"posts",el.id), {
              ...el.data(),
              id: el.id,
          })
      })
      getPosts()
  })
}
setIdForAllPosts()
/* 3 end set id on all docs */


/* 4 start get person Posts */
let AllPosts;
let personPosts;
function getPosts() {

  const url = window.location.href;
  const searchParams = new URL(url).searchParams; 
  const urlSearchParams = new URLSearchParams(searchParams);
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

function showPosts(personPosts){
  personPosts.forEach(e=>{

    if(e.textImg=="undefined"){
      document.querySelector('.posts-dad').innerHTML+=`
    
      <div class="post-container">
        <div class="post-row">
          <div class="user-profile">
            <img src="images/profile-pic.jpg" class="person-img"/>
            <div>
              <p class="person-name"> </p>
              <span>${e.textDate}</span>
            </div>
          </div>
          <a href="#"><i class="fa-solid fa-ellipsis-v"></i></a>
        </div>
        <p class="post-text" dir="auto">
          ${e.text}
        </p>
  
        <div class="post-row">
          <div class="activity-icons">
            <div><img src="images/like.webp" /> 75k+</div>
            <div><img src="images/comments.webp" /> 5k+</div>
            <div><img src="images/share.webp" /> 950</div>
          </div>
        </div>
      </div>
    
    
    `
    } else{

      document.querySelector('.posts-dad').innerHTML+=`
      
        <div class="post-container">
          <div class="post-row">
            <div class="user-profile">
              <img src="images/profile-pic.jpg" class="person-img"/>
              <div>
                <p class="person-name"> </p>
                <span>${e.textDate}</span>
              </div>
            </div>
            <a href="#"><i class="fa-solid fa-ellipsis-v"></i></a>
          </div>
          <p class="post-text" dir="auto">
            ${e.text}
          </p>
          <img src="${e.textImg}" class="post-img" />
    
          <div class="post-row">
            <div class="activity-icons">
              <div><img src="images/like.webp" /> 75k+</div>
              <div><img src="images/comments.webp" /> 5k+</div>
              <div><img src="images/share.webp" /> 950</div>
            </div>
          </div>
        </div>
      
      `
    }
  })
};

/* 5 start function to show Posts */






/* 6 start get user doc and main person data */

let mainPersonData;
let docId=localStorage.getItem("doc-id");

await getDoc(doc(db, "accounts", docId)).then(e=>{
  mainPersonData=e.data()
  document.querySelector('.main-person-img').src=e.data().personImg;
});

/* 6 end get user doc and main person data */






/* 7 start get person data with id from url and check if he the main person or not*/

if(docId!==null&&docId!==''){

  const url = window.location.href;
  const searchParams = new URL(url).searchParams; 
  const urlSearchParams = new URLSearchParams(searchParams);
  let personid = urlSearchParams.get('PersonId');
  
  if(personid!==''||personid!==undefined)
  {
    await getDoc(doc(db, "accounts", personid)).then(e=>{
      document.querySelectorAll('.person-name').forEach(element=>{
        element.innerHTML=e.data().username
      });

      document.querySelectorAll('.person-img').forEach(element=>{
        element.src=e.data().personImg
      });

    });
  }

  if(mainPersonData.friends.find(element=>element.personId==personid)!==undefined||personid==docId){
    document.querySelector('.sendFriendRequest').style.display='none'
  }

  if(personid!==docId){

    document.querySelector('#label-change-person-img').style.display='none'
    document.querySelector('.person-img-notChange').style.display='block'

  }

} else {
  location.href="./login/login.html"
}

/* 7 end get person data with id from url and check if he the main person or not*/








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

    console.log(url);
    document.querySelector('.main-person-img').src=url

    setDoc(doc(db, "accounts", localStorage.getItem("doc-id")), {
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

// Dark Button Toggle
var darkBtn = document.getElementById("dark-btn");
darkBtn.onclick = function () {
  darkBtn.classList.toggle("dark-btn-on");
  document.body.classList.toggle("dark-theme");

  if (localStorage.getItem("theme") == "light") {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
};

if (localStorage.getItem("theme") == "light") {
  darkBtn.classList.remove("dark-btn-on");
  // darkBtn.body.classList.remove("dark-theme");
} else if (localStorage.getItem("theme") == "dark") {
  darkBtn.classList.add("dark-btn-on");
  document.body.classList.add("dark-theme");
} else {
  localStorage.setItem("theme", "light");
}


/* 9 end Settings Menu Toggle */









/* 10 start on window click fuction */

window.onclick=(e)=>{
  if(e.target.classList.value.includes("logout")){
    localStorage.setItem("doc-id", "");
    location.href='../login/login.html'
  }
};

/* 10 end on window click fuction */





/* 11 start btn to send friend request */

document.querySelector('.sendFriendRequest').addEventListener('click',async ()=>{
  
  let docId=localStorage.getItem('doc-id')

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
        personName: mainPersonData.username,
      })

      setDoc(doc(db,"accounts",personid), {
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
