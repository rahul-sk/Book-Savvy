// let p=new Promise((resolve,reject) =>{
//     let sum=1+7;
//     if(sum==2){
//         resolve("success");
//     }
//     else{
//         reject("failure");
//     }
// })

// p.then((message) => {
//     console.log("then contains "+message)
// }).catch((message) => {
//     console.log("catch contains "+message)
// });
// %%%%%%%%%%%%%%%%%%%%%%%
// let math=true;
// let sc=false;

// function fpromse(){
//     return new Promise((resolve,reject) =>{
//         if(math==false){
//             reject({
//                 "maths":"less marks",
//                 "result":"failed"
//             })
//         }
//         else if(sc==false){
//             reject({
//                 "sc":"less marks",
//                 "result":"failed"
//             })
//         }
//         else{
//             resolve("Passed");
//         }
//     })
// }

// fpromse().then((mess)=>{
//     console.log("you "+mess);
// }).catch((mess)=>{
//     console.log("You Failed, here is your result -> "+mess.sc+" "+mess.result);
// });

// let a=new Promise((resolve,reject)=>{
//     resolve("a resolved")
// });

// let b=new Promise((resolve,reject)=>{
//     resolve("b resolved");
// })

// let c=new Promise((resolve,reject) =>{
//     resolve("c resolved")
// });

// Promise.all([a,b,c]).then((mess)=>{
//     console.log(mess);
// }).catch((mess)=>{
//     console.log("some one didn't resolve");
// });


// function req(str){
//     return new Promise((resolve,reject)=>{
//         console.log("req function is called");
//         if(str==='apple'){
//             resolve("apple was called successfully");
//         }
//         else{
//             reject("this is only apple suported :(");
//         }
//     })
// }

// function extra(mess){
//     return new Promise((resolve,reject)=>{
//         resolve("Extra information "+mess);
//     })
// }

// async function help(){
//     try{
//         const a=await req("google");
//         console.log("recieved response");
//         const b=await extra(a);
//         console.log("extra string appended");
//         console.log(b);
//     }
//     catch(exp){
//         console.log("from catch "+exp);
//     }

// }

// help();



