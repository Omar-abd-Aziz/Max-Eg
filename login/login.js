
/////* start firebase */////

/*1*/
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js';
import { getFirestore, collection, getDocs,getDoc, setDoc, addDoc, doc,query,where } from 'https://www.gstatic.com/firebasejs/9.8.2/firebase-firestore.js';

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

// firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let X;

async function getCit(db,X) {
  const citiesCol = collection(db,`${X}`);
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  return cityList;
}
/*1*/



















/*Start Sing In*/


document.querySelector(".btn-sign-in").addEventListener("click",async()=>{
    let username =  document.querySelector(".username-in").value
    let password =  document.querySelector(".password-in").value

    if (username.trim()!==""&&password.trim()!=="") {

        const q = query(collection(db, "accounts"), where("username", "==", `${username}`), where("password", "==", `${password}`));

        const querySnapshot = await getDocs(q);
        if(querySnapshot.docs.length==0){
            Swal.fire("","Usename Or Password Are Wrong","error");
        }
        querySnapshot.forEach((doc) => {  
            if(doc.data().id!==undefined){
                document.querySelector(".username-in").value=""
                document.querySelector(".password-in").value=""
                /**/
                localStorage.setItem("doc-id",doc.data().id);
                /**/
                location.href="../index.html"
            } else {
                Swal.fire("","Usename Or Password Are Wrong","error");
            }
        });

    } else {Swal.fire("","Enter Usename And Password","error")}

})

/*End Sing In*/





/* start create account */

document.querySelector(".btn-sign-up").addEventListener("click",async()=>{
    var username = document.querySelector(".username-up").value
    var password = document.querySelector(".password-up").value
    var password2 = document.querySelector(".password-up-2").value
    var email = document.querySelector(".email-up").value


    

    if(username!==""&&password!==""&&password2!==""&&email!==""&&password==password2)
    {

        function idGenerator() {
            var S4 = function() {
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            };
            return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
        };
    
        let randomId = idGenerator();

            
        let q = query(collection(db, "accounts"), where("username", "==", `${username}`));

        const querySnapshot = await getDocs(q);
        if(querySnapshot.docs.length==0){
            setDoc(doc(db,"accounts",`${randomId}`),{
                id: randomId,
                username: username,
                password: password,
                email: email,
                time: Date.now(),
                N:"",
                personImg: './images/profile-pic.jpg',
                personPosts:[],
                friends:[],
                friendRequests:[],
            }).then(e=>{
                Swal.fire('تم انشاء الحساب','يمكنك الان تسجيل الدخول','success')
            });

            document.querySelector(".username-up").value=""
            document.querySelector(".password-up").value=""
            document.querySelector(".email-up").value=""
            document.querySelector(".password-up-2").value=""

            document.querySelector("#tab-1").click()
    
        } else {
            Swal.fire(
                'الاسم موجود بالفعل',
                'برجاء اختيار اسم اخر',
                'error'
            )
        }


      
  
      


    } else if(username!==""&&password!==password2&&email!=="") {
        Swal.fire("","The Two Password Should be the Same","error")
    } else {
        Swal.fire("","Enter Username,Password and Email","error")
    }
})

/* end create account */





// await getDoc(doc(db, "accounts", "L8tRIutxitBgha5OdTby")).then(e=>cs(e.data()))
