var pelotaX = 0;
var pelotaY = 0;
var pelotaR = 5;

var dX = 2;
var dY = -5;

var maxVel = 10;

var amgulo = 1;

var listaBloques = [];

var pantallaX = 650;
var pantallaY = 480;

var paletaX = 0;
var paletaY = 0;
var paletaHanchura = 100;
var paletaAltura = 10;

var keyPres = false;
var moverDireccion = ' ';

var colores = ["#F4A460", "rgb(250, 147, 186)","#7aa04e","#8d2556","#0640ea", "rgb(250, 250, 186)"];

window.onload = () => {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = pantallaX;
    canvas.height = pantallaY;

    //inisialisar pocicion de pelota
    pelotaX = canvas.width / 2;
    pelotaY = canvas.height * 9 / 10;

    //inisialisar pocicion de paleta


    //metodos de inicialisacion
    GenerarBloques();
    //fin de metodos.
    paletaX = (canvas.width - paletaHanchura)/ 2 ;
    paletaY = canvas.height - 10 - paletaAltura;

    function DibujarBloques() {
        listaBloques.forEach(element => {
            ctx.beginPath();
            ctx.fillStyle = colores[element[4] - 1];
            ctx.fillRect(element[0],element[1],element[2],element[3]);
            ctx.closePath();
        });
    }

    function DibujarPelota(){
        ctx.beginPath();
        ctx.fillStyle = "#FFF"
        ctx.arc(pelotaX,pelotaY,pelotaR,0,2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    function DibujarPaleta(){
        ctx.beginPath();
        ctx.fillStyle = "#FFF";
        ctx.fillRect(paletaX, paletaY, paletaHanchura, paletaAltura);
        ctx.closePath();

    }
    
    function MoverPelota(){
        if(pelotaX + dX > pantallaX || pelotaX + dX < 0){
            dX = -dX;
        }

        if(pelotaY + dY > pantallaY || pelotaY + dY < 0){
            dY =-dY;
        }
        pelotaX += dX;
        pelotaY += dY;
    }

    function moverPaleta(){
        if(!keyPres)
            return;
        if(moverDireccion == 'D')
            paletaX += maxVel;
        if(moverDireccion == 'I')
            paletaX -= maxVel;
    }

    function draw(){
        //dibujar
        ctx.beginPath();
        ctx.fillStyle = "#000"
        ctx.fillRect(0,0,pantallaX,pantallaY);
        ctx.closePath();
        DibujarBloques();
        DibujarPelota();
        DibujarPaleta();

        //logica
        GolpeoBloque();
        GolpeoPaleta();
        MoverPelota();
        moverPaleta();

        if(listaBloques.length == 0){
            GenerarBloques();
        }

        //repetision
        window.requestAnimationFrame(draw);
    }
    draw();
};

function GenerarBloques() {
    let sX= 40 , sY= 20;
    
    let separation = 1;
    let ancho = ((pantallaX - sX*2 - separation*10) / 10 );
    let alto = 20;
    for(let i=0; i < 5; i++){
        for(let j=0; j <10; j++){
            listaBloques.push([sX + (j * (ancho + separation)),sY + (i * (alto+ separation)),ancho,alto, 5 - i]);
        }
    }
}

function GolpeoBloque(){
    let inexGolpe = [];
    for(let i = 0; i < listaBloques.length ; i++){
        let bloque = listaBloques[i];
        let golpeVertical = false;
        let golpeHorisontal = false;
        //golpe horisontal
        difX = [(pelotaX + pelotaR) - (bloque[0]) , (pelotaX - pelotaR) - (bloque[0] + bloque[2])]
        //if( pelotaX + pelotaR > bloque[0] && pelotaX - pelotaR < bloque[0] + bloque[2]){
        //    golpeHorisontal = true;
        //}
        if(difX[0] > 0 && difX[1] < 0){
            golpeHorisontal = true;
        }
        //golpe vertical
        difY = [(pelotaY + pelotaR) - (bloque[1]) , (pelotaY - pelotaR) - (bloque[1] + bloque[3])]
        //if( pelotaY + pelotaR > bloque[1] && pelotaY - pelotaR < bloque[1] + bloque[3])
        //    golpeVertical = true;
        if(difY[0] > 0 && difY[1] < 0){
            golpeVertical = true;
        }
        if( golpeVertical && golpeHorisontal ){
            let direccion = Math.min(Math.abs(difX[0]) ,Math.abs(difX[1])) < Math.min(Math.abs(difY[0]) ,Math.abs(difY[1])) ? 0 : 1 
            inexGolpe.push( [i,direccion] );
        }
    }
    let modfVel = [true,true]; //dX, dY
    inexGolpe.slice().reverse().forEach( indx =>{ 
        if(--listaBloques[indx[0]][4] <= 0)
            listaBloques.splice(indx[0],1) ;
        

        if(indx[1] == 1 && modfVel[1]){
            dY = -dY
            modfVel[1] = false;
        }
        else if (modfVel[0]) {
            dX = -dX
            modfVel[0] = false;
        }
    } );
}

function GolpeoPaleta(){
    let golpeVertical = false;
    let golpeHorisontal = false;
    //golpe horisontal
    let difX = [(pelotaX + pelotaR) - (paletaX),(pelotaX - pelotaR) - (paletaX + paletaHanchura) ];
    if(difX[0] > 0 && difX[1] < 0){
        golpeHorisontal = true;
    }
    //golpe vertical
    let difY = [(pelotaY + pelotaR) - (paletaY) , (pelotaY - pelotaR) - (paletaY + paletaAltura) ];
    if(difY[0] > 0 && difY[1] < 0){
        golpeVertical = true;
    }

    if( golpeVertical && golpeHorisontal ){
        if(dY > 0){
            dY = -dY
        }
        dX = /*dX*/ + 0.05 * (Math.abs(difX[0]) - Math.abs(difX[1]))
    }
}

addEventListener("keydown", (event) => {
    if (event.isComposing || event.keyCode === 229) {
        return;
    }
    if(event.key == "ArrowLeft"){
        keyPres = true;
        //paletaX -= maxVel;
        moverDireccion = 'I'
    }
    if(event.key == "ArrowRight"){
        keyPres = true;
        //paletaX += maxVel;
        moverDireccion = 'D'
    }
});

addEventListener("keyup", (event) => {
    if (event.isComposing || event.keyCode === 229) {
      return;
    }
    keyPres = false;
    // do something
  });