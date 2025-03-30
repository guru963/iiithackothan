// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyD0tK07_lgT5b6AKfNaq9ICRmYSQeOZxig",
  authDomain: "netflix-clone-87c18.firebaseapp.com",
  projectId: "netflix-clone-87c18",
  storageBucket: "netflix-clone-87c18.firebasestorage.app",
  messagingSenderId: "983444021427",
  appId: "1:983444021427:web:4ffdc8a8dc7320227fd0c6"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

const signup=async(name,email,password)=>{
    try{
        const res=await createUserWithEmailAndPassword(auth,email,password)
        const user=res.user;
        await addDoc(collection(db,"user"),{
            uid:user.uid,
            name,
            authProvider:'local',
            email,
        })
    }catch(error){
        console.log(error);
        alert(error);

    }

    
}
const login=async(email,password)=>{
    try{
        await signInWithEmailAndPassword(auth,email,password)

    }catch(error){
        console.log(error)
        alert(error)
    }
}

const logout=()=>{
    signOut(auth)
}

export {auth,db,login,signup,logout}