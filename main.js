
//////////////////////*start firebase*////////////////////////////

/* 01 start link firebase*/
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js';
import { getFirestore, collection, query, where, getDocs,getDoc, setDoc, addDoc, doc,deleteDoc,onSnapshot,orderBy, limit,startAt, startAfter,endAt } from 'https://www.gstatic.com/firebasejs/9.8.2/firebase-firestore.js';

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
/* 01 end link firebase*/






/* 02 start get AllAccounts */

let AllAccounts;

await getCit(db, 'accounts').then(async (e) => {
    AllAccounts = e;
})

async function getUserDataWithId(id){
    return AllAccounts.find(e=>e.id==id)
}

/* 02 end get All Accounts */









/* 03 start check and get user doc */

let mainPersonData;
let docId = await localStorage.getItem("doc-id");

if(docId!==null&&docId.trim()!==''){
    document.querySelector('.profile-btn').dataset.personid=docId;
    mainPersonData=await getUserDataWithId(docId);
    getUserData(mainPersonData);
} else {
  location.href="./login/login.html"
}

/* 03 end check and get user doc */









/* 04 start function to getUserData */

async function getUserData(mainPersonData){
    
    document.querySelectorAll('.main-person-name').forEach(element=>{
        element.innerHTML=mainPersonData.username;
    });
  
    document.querySelectorAll('.main-person-img').forEach(element=>{
        element.src=mainPersonData.personImg;
    });
}

/* 04 end function to getUserData */






/*05 start return All Posts */

let AllPosts;

async function forAllPosts(X){

  const q = query(collection(db, "posts"), orderBy("textTime","desc"), limit(X||10));
  const querySnapshot = await getDocs(q);
  const cityList = querySnapshot.docs.map(doc => doc.data());

  AllPosts=cityList;

  return AllPosts;
};


/*05 end return All Posts  */





/*06 start loadMorePosts */

async function loadMorePosts(X){
    const q = query(collection(db, "posts"), orderBy("textTime","desc"), limit(X||10),startAfter(AllPosts[AllPosts.length-1].textTime));
    const querySnapshot = await getDocs(q);
    const cityList = querySnapshot.docs.map(doc => doc.data());
    return cityList;
}

/*06 end loadMorePosts  */











/* start get more posts on scrool */


window.onscroll=async ()=>{
    

    let triggerHeight = window.scrollY + document.body.offsetHeight;

    
    
    if(window.scrollY+window.innerHeight >= document.body.scrollHeight-1){
        loadMorePosts(5).then(e=>{
            ToShowAllPosts(e);
        });
    };


};


/* end get more posts on scrool */



async function ToShowAllPosts(DataToShow){

        AllPosts=DataToShow;
        
        AllPosts.forEach(onePosts=>{

            
            if(onePosts.textImg!=="undefined"){
               
                document.querySelector('.posts-dad').innerHTML+=`
            
                <div class="fb-post">
                    <div class="fb-post-container">
                        <div class="fb-p-main">
                            <div class="post-title">
        
                                <div style="display: flex; padding: 5px; position: relative; top: 20px; left: 30px; transform: translate(-50%, -50%); margin-right: 10px;">
                                    <label style="width: 50px; height: 50px; overflow: hidden; border-radius: 50px;">
                                        <img src="${onePosts.personImg}" loading="lazy" class="profile-btn" data-personid="${onePosts.personId}" alt="user picture">
                                    </label>
                                </div>
        
                                <ul>
                                    <li><h3 style="font-family: system-ui;">${onePosts.personName}</h3></li>
                                    <li><span>${onePosts.textDate}</span></li>
                                </ul>
                                <p style="width: 100%; font-size: 20px; font-family: system-ui; padding: 0px 10px 10px;" dir="auto" > 
                                    ${onePosts.text} 
                                </p>
                            </div>
        
                            <div class="post-images">
                                <div class="post-images" style="width: 100%;">
                                    <img src="${onePosts.textImg}" loading="lazy" alt="post images 01" style="">
                                </div>
                            </div>
        
                            <div class="like-comment">
                                <ul>
                                <li>
                                    <img id="like-img${onePosts.id}" class="like-btn" data-postid="${onePosts.id}" src="images/like.webp" alt="like" style="cursor: pointer;">
                                    <span class="liksNum${onePosts.id}">
                                    ${
                                        eval(getAllPostDocs(onePosts.id).then(e=>{
                                        
                                        if(e.length==0){
                                            document.querySelector(`.liksNum${onePosts.id}`).textContent='';
                                        } else{
                                            document.querySelector(`.liksNum${onePosts.id}`).textContent=e.length;
                                        }
                                        
                                        let likeDoc=e.find(el=>el.personId==mainPersonData.id);

                                        if(likeDoc!==undefined){

                                            let likeid=likeDoc.id;

                                            
                                            document.querySelector(`#like-img${onePosts.id}`).src="./images/like-blue.webp";

                                            document.querySelector(`#like-img${onePosts.id}`).dataset.likeid=likeid;
                                        };

                                    }))}
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
                            <div class="post-title">
        
                                <div style="display: flex; padding: 5px; position: relative; top: 20px; left: 30px; transform: translate(-50%, -50%); margin-right: 10px;">
                                    <label style="width: 50px; height: 50px; overflow: hidden; border-radius: 50px;">
                                        <img src="${onePosts.personImg}" loading="lazy" class="profile-btn" data-personid="${onePosts.personId}" alt="user picture">
                                    </label>
                                </div>
        
                                <ul>
                                    <li><h3 style="font-family: system-ui;">${onePosts.personName}</h3></li>
                                    <li><span>${onePosts.textDate}</span></li>
                                </ul>
                                <div class="PostTextDiv" postId="${onePosts.id}" style="width: 100%; font-size: 20px; font-family: system-ui;" dir="auto" >${onePosts.text.trim()}</div>
                                
                            </div>

        
                            <div class="like-comment">
                                <ul>
                                    <li>
                                        <img id="like-img${onePosts.id}" class="like-btn" data-postid="${onePosts.id}" src="images/like.webp" alt="like" style="cursor: pointer;">
                                        <span class="liksNum${onePosts.id}">
                                        ${
                                            eval(getAllPostDocs(onePosts.id).then(e=>{
                                            
                                            
                                            if(e.length==0){
                                                document.querySelector(`.liksNum${onePosts.id}`).textContent='';
                                            } else{
                                                document.querySelector(`.liksNum${onePosts.id}`).textContent=e.length;
                                            }
                                            
                                            let likeDoc=e.find(el=>el.personId==mainPersonData.id);
    
                                            if(likeDoc!==undefined){
    
                                                let likeid=likeDoc.id;
    
                                                
                                                document.querySelector(`#like-img${onePosts.id}`).src="./images/like-blue.webp";
    
                                                document.querySelector(`#like-img${onePosts.id}`).dataset.likeid=likeid;
                                            };
    
                                        }))}
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

};

/* end function to check scroll and show posts */










/* strart get PostLikes */

async function getAllPostDocs(postId) {
    const c1 = collection(db, "posts", postId, "PostLikes");
    const c2 = await getDocs(c1);
    const c3 = c2.docs.map(doc => doc.data());
    return c3;
};


/* end get PostLikes */










/* 07 start function to show Allposts */

ShowAllPosts();

async function ShowAllPosts() {

    document.querySelector('.posts-dad').innerHTML=``;

    await forAllPosts(5).then(e=>{
        ToShowAllPosts(e);
    });
    

};

/* 07 end function to show Allposts */





/* 08 start btn for dark theam */

var darkButton = document.querySelector(".darkTheme");
if(localStorage.getItem("darkTheme")==="dark"){
    document.body.classList.toggle("dark-color");
    darkButton.classList.toggle("fa-sun");
    darkButton.classList.toggle("fa-moon");
}

darkButton.onclick = function(){
    darkButton.classList.toggle("fa-sun");
    darkButton.classList.toggle("fa-moon");
    document.body.classList.toggle("dark-color")

    if([...document.body.classList].includes("dark-color")){
        localStorage.setItem("darkTheme","dark");
    } else{
        localStorage.setItem("darkTheme","white");
    }

};
/* 09 end btn for dark theam */






/* 10 start staties btns */

let statusBtnRight = document.querySelector(".btn-right")
let statusBtnLeft = document.querySelector(".btn-left")

cheekStatiesBtn(statusBtnLeft)

statusBtnLeft.addEventListener('click',()=>{
   document.querySelector(".stories-dad").scrollLeft-= 150;
   cheekStatiesBtn(statusBtnLeft)
})

statusBtnRight.addEventListener('click',()=>{
    document.querySelector(".stories-dad").scrollLeft+= 150;
    cheekStatiesBtn(statusBtnLeft)
})


function cheekStatiesBtn(statusBtnLeft){
    if(document.querySelector(".stories-dad").scrollLeft>1){
        statusBtnLeft.style.display='block'
    } else{
        statusBtnLeft.style.display='none'
    }
}


/* 10 end staties btns */










/* 11 start profile btn */

window.onclick=(e)=>{

    if(e.target.classList.value.includes("Home-btn")){
        ShowAllPosts();
    }

    if(e.target.classList.value.includes("profile-btn")){
        location.href='./profile.html'+'?PersonId='+e.target.dataset.personid;
    }

    if(e.target.classList.value.includes("personToOpenProfile")){
        location.href='./profile.html'+'?PersonId='+e.target.dataset.personid;
    }

    if(e.target.classList.value.includes('searchAboutPerson')){
        searchAboutPerson();
    }

    /* btn to accept fiend request */
    if(e.target.classList.value.includes('accept-friend-request')){

        /* the person who send request */

        var personId=e.target.dataset.id;

        getUserDataWithId(`${personId}`).then(Data=>{
            let PersonData=Data;

            let personFriends=[...PersonData.friends] ;
            personFriends.push({
                personId: mainPersonData.id,
                personImg: mainPersonData.personImg,
                personName: mainPersonData.username,
            });

            setDoc(doc(db,"accounts",personId), {
                ...PersonData,
                friends: personFriends,
            });

            var mainFriends=[...mainPersonData.friends];
            mainFriends.push({
                personId: PersonData.id,
                personImg: PersonData.personImg,
                personName: PersonData.username,
            });

            let mainPersonFriendRequests=[...mainPersonData.friendRequests];
            mainPersonFriendRequests = mainPersonFriendRequests.filter(ee=>ee.personId!==`${PersonData.id}`)

            setDoc(doc(db,"accounts",mainPersonData.id), {
                ...mainPersonData,
                friendRequests: mainPersonFriendRequests,
                friends: mainFriends,
            })

            let friendToRemove = e.target.parentNode.parentNode.parentNode;
            if(friendToRemove.classList.value.includes('friend')){
                friendToRemove.remove();
            }

        })
    }


    /* btn to remove/refuse fiend request */
    if(e.target.classList.value.includes('remove-friend-request')){

        var mainPersonFriendRequests=[...mainPersonData.friendRequests];
        mainPersonFriendRequests = mainPersonFriendRequests.filter(ee=>ee.personId!==`${e.target.dataset.id}`)

        setDoc(doc(db,"accounts",mainPersonData.id), {
            ...mainPersonData,
            friendRequests: mainPersonFriendRequests,
        })

        let friendToRemove = e.target.parentNode.parentNode.parentNode;
        if(friendToRemove.classList.value.includes('friend')){
            friendToRemove.remove();
        };

    };



    /* sratt Like btn*/
    

    if(e.target.classList.value.includes("like-btn")){
        let postId=e.target.dataset.postid;

        LikeBtn(postId,e.target);

    };



};

/* 11 end profile btn */



async function LikeBtn(postId,LikeBtn){


    if(`${LikeBtn.src}`.includes("like.webp")){
        
        let randomId = parseInt(Math.random()*10000000);

        

        setDoc(doc(db, "posts", postId, "PostLikes",`${randomId}`),{
            id: randomId,
            personName: mainPersonData.username,
            personId: mainPersonData.id,
            personImg: mainPersonData.personImg,
        });


        
        LikeBtn.dataset.likeid=randomId;
        


        getAllPostDocs(postId).then(e=>{
            LikeBtn.parentNode.children[1].innerHTML=`${e.length}`
        });

        

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






/* 12 start close and open Post div btn */

document.querySelector('#close-post-div').addEventListener('click',()=>{
    document.querySelector('.create-post-dad').style.display='none'
})

document.querySelector('.createPost').addEventListener('click',()=>{
    document.querySelector('.create-post-dad').style.display='block'
})

/* 12 end close and open Post div btn */







/* 13 start close and open accountsFromSearchDad div btn */

document.querySelector('#close-accountsFromSearchDad-div').addEventListener('click',()=>{
    document.querySelector('.accountsFromSearchDad').style.display='none'
})

/* 13 end close and open accountsFromSearchDad div btn */








/* 14  start function to upload img */

let PostImgSrc;
async function uploadImage() {

    const ref = firebase.storage().ref();
    const file =  document.querySelector("#PostInput").files[0];
    const name = +new Date() + "-" + file.name;
    const metadata = {
      contentType: file.type,
    };
  
    const task = ref.child(name).put(file, metadata);
    task
    .then(async snapshot => snapshot.ref.getDownloadURL())
    .then(async url => {

        PostImgSrc=url;
        document.querySelector(".loaderDad").style.display="none";

    })
    .catch(console.error);
    
};

/* 14  end function to upload img */








/* 15 start Post Btn */

document.querySelector('.ImBtnForPost').addEventListener('click',()=>{
    document.querySelector("#PostInput").click();
})

document.querySelector('#PostInput').addEventListener('change',()=>{
    
    uploadImage();

    document.querySelector(".loaderDad").style.display="block"
})


let textImg='';
document.querySelector('#Post-Btn').addEventListener('click',async ()=>{
    let text = document.querySelector('#Post-Input').innerHTML
    textImg=PostImgSrc;

    let randomId = parseInt(Math.random()*10000000);

    if(text.trim()!==''||textImg.trim()!==''){

        setDoc(doc(db,"posts",`${randomId}`),{
            id: `${randomId}`,
            text: `${text}`,
            textImg: `${textImg}`,
            textTime: Date.now(),
            textDate: `${showDate()}`,
            personId: mainPersonData.id,
            personName: mainPersonData.username,
            personImg: mainPersonData.personImg,
        }).then(e=>{
            location.reload();
        })

        document.querySelector('#Post-Input').value='';
        document.querySelector('.create-post-dad').style.display='none';

    };
});

/* 15 end Post Btn */








/* 16 start btn search */

function searchAboutPerson(){
    Swal.fire({
        title: 'Who are you looking for?',
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Look up',
        showLoaderOnConfirm: true,
        preConfirm: async(login) => {

            login=login.trim();

            if(login!==''){
                let AllAccountsHasTheSameName=AllAccounts.filter(el=>el.username.includes(`${login}`));
                return AllAccountsHasTheSameName;
            }else{
                Swal.fire(
                    'Sorry',
                    'No Person Found..',
                    'info'
                );
            };
            
            
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        let AllaccountsFromSearch = document.querySelector('.AllaccountsFromSearch')
        AllaccountsFromSearch.innerHTML='';

        if(result.value==`${[]}`){
            Swal.fire(
                'Sorry',
                'No Person Found..',
                'info'
            )
        } else {


            result.value.forEach(e=>{

                var isFriend = 'not friend'

                if(mainPersonData.friends.find(element=>element.personId==e.id)!==undefined){
                    isFriend='friend';
                } else if(mainPersonData.friends.find(element=>element.personId==e.id)==undefined&&e.id==docId){
                    isFriend='you';
                }

                AllaccountsFromSearch.innerHTML+=
                `
                
                <div class="friend " style="border-bottom: 1px solid  rgb(151, 208, 182); margin: 10px auto;">
                    <ul>
                        <li><img class='personToOpenProfile' data-personid="${e.id}" src="${e.personImg}" loading="lazy" style='cursor: pointer; user-select: none;' alt="user"></li>
                        <li>
                            <b style="color: rgb(151, 208, 182);">${e.username}</b>
                            <p style="color: white;">${isFriend}</p>
                        </li>
                    </ul>
                </div>
                

                `
            })
    
            document.querySelector('.accountsFromSearchDad').style.display='block'
        };

    })
};


/* 16 end btn search */









/* 17 start function to get all user friendRequests */

async function getAllFriendRequests(){
    
    let AllFriendRequests=mainPersonData.friendRequests;

    document.querySelector('.AllfriendRequests').innerHTML=''

    AllFriendRequests.forEach(el=>{

        document.querySelector('.AllfriendRequests').innerHTML+=`

        <div class="friend" style="border-bottom: 1px solid  rgb(151, 208, 182); margin: 10px auto;">
            <ul>
                <li><img src="${el.personImg}" alt="user" loading="lazy"></li>
                <li>
                    <b style="color: rgb(151, 208, 182);">${el.personName}</b>
                    <p style="color: white;">not friend</p>
                    <button class="accept-friend-request" data-id='${el.personId}'>Confirm</button>
                    <button class="remove-friend-request friend-remove" data-id='${el.personId}'>Remove</button>
                </li>
            </ul>
        </div>
        `

    })
};

getAllFriendRequests();

/* 17 end function to get all user friendRequests */









/* 18 start close and open friendRequestsDad div btn */

document.querySelector('.friend-requests').addEventListener('click',()=>{
    document.querySelector('.friendRequestsDad').style.display='block'
})


document.querySelector('#close-friendRequestsDad-div').addEventListener('click',()=>{
    document.querySelector('.friendRequestsDad').style.display='none'
})

/* 18 end close and open friendRequestsDad div btn */






/* 19 start function to get data now */
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


/* 19 end function to get data now */












// let darkThemeBtn = document.querySelector(".darkTheme")

// darkThemeBtn.addEventListener("click",()=>{
//     if([...darkThemeBtn.classList])
//     console.log("done")
// });