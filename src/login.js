const login = document.getElementById("login");
const register = document.getElementById("register");
const btn = document.getElementById("create-account");
const half1 = document.getElementById("half1");
const half2 = document.getElementById("half2");
const textHalf1 = document.getElementById("text-half1");
const inputs = document.querySelector("#inputs");

// const tl = new TimeLineMax();

// tl.fromTo(inputs, 1, {height: "0%"}, {height: "50%"});


function ManipulaConteudo(){
    if(login.style.display == "none"){
        login.style.display = "block";
        register.style.display = "none";
        btn.innerHTML = "Login";
        AnimacaoDeslizaFrame(half1, half2, "left");
        textHalf1.innerHTML = "Fazer Login";
    } else {
        login.style.display = "none";
        register.style.display = "block";
        btn.innerHTML = "Cadastre-se";
        AnimacaoDeslizaFrame(half1, half2, "right");
        textHalf2.innerHTML = "Criar conta";
    }
}

function AnimacaoDeslizaFrame(document1, document2, direction){
    var x;
    if (direction == "right") {
        x = "-95%";    
    } else {
        x = "+95%";  
    }
    document2.animate([
        // keyframes
        { transform: 'translateX(0px)' },
        { transform: 'translateX('+x+')'}
      ], {
        // timing options
        duration: 1000
      });      

    setTimeout(function(){
        document1.style.cssFloat = direction;
    }, 1000);       
}
 

