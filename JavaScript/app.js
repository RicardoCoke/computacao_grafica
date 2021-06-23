document.addEventListener('DOMContentLoaded', Start);

var cena = new THREE.Scene();

function pickRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

function updateCamera() {
  camara.updateProjectionMatrix();
}  

//Camera Settings-------------------------------------------------------------------
//Variaveis necessarias
var cs = 1; //camera default
const aspectRatio = window.innerWidth / window.innerHeight;
const cameraWidth = 500;
const cameraHeight = cameraWidth / aspectRatio;

//Camera Perspectiva (0)
var camaraP = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

//Camera Ortografica (1)
var camaraO = new THREE.OrthographicCamera(
        cameraWidth / -2, // left
        cameraWidth / 2, // right
        cameraHeight / 2, // top
        cameraHeight / -2, // bottom
        0, // near plane
        1000, // far plane
    );

if (cs==0){
    camara = camaraP;
    camara.position.set(0, 0, 300);    
}
if (cs==1){
    camara = camaraO;
    camara.position.set(200, 0, 300);
    camara.lookAt(0, 0, 0);    
}

//-------------------------------------------------
// Set up renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(cena, camara); 
document.body.appendChild(renderer.domElement);

//----------------------------------------------------------
//Camera Orbit
var controls = new THREE.OrbitControls( camara, renderer.domElement );
controls.update();
//----------------------------------------------------------

//Objecto Importado
var objectoImportado;
var mixerAnimacao;
var relogio = new THREE.Clock();
var importer = new THREE.FBXLoader();

importer.load('./Objectos/Samba Dancing.fbx', function(object) {
    mixerAnimacao = new THREE.AnimationMixer(object);
    var action = mixerAnimacao.clipAction(object.animations[0]);
    action.play();

    //Tentativa de acrescentar uma animacao
    // importer.load('./Objectos/Kneeling Pointing.fbx', function (object){
    //      console.log("loaded kneel")
    //     //  animationAction = mixer.clipAction(object.animations[0]);
    //     //  animationActions.push(animationAction)
    //     //  animationsFolder.add(animations, "bellydance")
    //      action.add(animations, "kneel");
    // })

    object.traverse(function (child) {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    
     });
     cena.add(object);
     object.scale.x = 0.3;
     object.scale.y = 0.3;
     object.scale.z = 0.3;
     

     object.position.x = 150;
     object.position.y = -50;
     object.position.z = 50;
     objectoImportado = object;
     });

//Cubo Texturizado-------------------------------------------------------
const boxWidth = 20;
const boxHeight = 20;
const boxDepth = 20;
const geometry_cubetext = new THREE.BoxBufferGeometry(boxWidth, boxHeight, boxDepth);

const cubes = [];  // just an array we can use to rotate the cubes
const loader = new THREE.TextureLoader();

const materials = [
    new THREE.MeshBasicMaterial({map: loader.load('./Imagens/flower-1.jpg')}),
    new THREE.MeshBasicMaterial({map: loader.load('./Imagens/flower-2.jpg')}),
    new THREE.MeshBasicMaterial({map: loader.load('./Imagens/flower-3.jpg')}),
    new THREE.MeshBasicMaterial({map: loader.load('./Imagens/flower-4.jpg')}),
    new THREE.MeshBasicMaterial({map: loader.load('./Imagens/flower-5.jpg')}),
    new THREE.MeshBasicMaterial({map: loader.load('./Imagens/flower-6.jpg')}),
  ];

const cube_text = new THREE.Mesh(geometry_cubetext, materials);

//------------------------------------------------------------------

// var quad_vertices =
// [
// -30.0,  30.0, 0.0,
// 30.0,  30.0, 0.0,
// 30.0, -30.0, 0.0,
// -30.0, -30.0, 0.0
// ];

// var quad_uvs =
// [
// 0.0, 0.0,
// 1.0, 0.0    ,
// 1.0, 1.0,
// 0.0, 1.0
// ];

// var quad_indices =
// [
// 0, 2, 1, 0, 3, 2
// ];

// var geometry_quad = new THREE.BufferGeometry();

// var vertices = new Float32Array( quad_vertices );
// // Each vertex has one uv coordinate for texture mapping
// var uvs = new Float32Array( quad_uvs);
// // Use the four vertices to draw the two triangles that make up the square.
// var indices = new Uint32Array( quad_indices )

// // itemSize = 3 because there are 3 values (components) per vertex
// geometry_quad.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
// geometry_quad.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );
// geometry_quad.setIndex( new THREE.BufferAttribute( indices, 1 ) );

// // Load the texture asynchronously
// var textureLoader2 = new THREE.TextureLoader();
// texture = textureLoader2.load('./Imagens/c.jpg');


// var material_quad = new THREE.MeshBasicMaterial( {map: texture });
// var mesh = new THREE.Mesh( geometry_quad, material_quad );
// cena.add(mesh);
// mesh.position.x = 150;
// mesh.position.y = 25;

//--------------------------------------------------------------------------
//-----------------------------------------------------------------------
//texturas planeta
const planeta = [
    new THREE.MeshBasicMaterial({map: loader.load('./Imagens/moon.jpg')}),
    new THREE.MeshBasicMaterial({map: loader.load('./Imagens/sun.jpg')}),
];

//Variaveis para cor
const color = new THREE.Color();
var corrandom = color.setHex( Math.random() * 0xffffff );
var posicao = Math.random();

//Variaveis rotaçao e movimento
var cuboCoordRotation;
var camaraAndar = {x:0, y:0, z:0};
var velocidadeAndar = 0.005;
var movimentocarro = 5;
var movimentocarro2 = -5;

//Bomba de gasolina
const geometry_bomba = new THREE.BoxGeometry( 10, 30, 10 );
const material_bomba = new THREE.MeshBasicMaterial({map: loader.load('./Imagens/bomba.jpg')});
const bomba = new THREE.Mesh( geometry_bomba, material_bomba );
bomba.castShadow = true;
bomba.receiveShadow = true;

//Terra (Vista Lateral)
const geometry_terra = new THREE.BoxGeometry( 600, 100, 2000 );
const material_terra = new THREE.MeshBasicMaterial({map: loader.load('./Imagens/terra.jpg')});
const terra = new THREE.Mesh( geometry_terra, material_terra );

//Sol
const geometry_sun = new THREE.SphereGeometry( 12, 32, 32 );
const material_sun = new THREE.MeshBasicMaterial({map: loader.load('./Imagens/sun.jpg')});
const sun = new THREE.Mesh( geometry_sun, material_sun );

//Ceu
const loader_sky = new THREE.TextureLoader();
const bgTexture = loader_sky.load('./Imagens/ceu.jpg');
cena.background = bgTexture;

//texturas ceu
const ceu = [
    loader_sky.load('./Imagens/estrelas.jpg'),
    loader_sky.load('./Imagens/ceu.jpg'),
];

//Estrada
const geometry_estrada = new THREE.BoxBufferGeometry(90, 12, 2000);
const material_estrada = new THREE.MeshBasicMaterial({map: loader.load('./Imagens/estrada.jpg')});
const estrada = new THREE.Mesh(geometry_estrada, material_estrada);

//Relva Direita
const geometry_relvad = new THREE.BoxBufferGeometry(1500, 15, 2000);
const material_relvad = new THREE.MeshBasicMaterial({map: loader.load('./Imagens/relva2.png')});
const relvad = new THREE.Mesh(geometry_relvad, material_relvad);
relvad.position.x = -150;

//Relva Esquerda
const geometry_relvae = new THREE.BoxBufferGeometry(1500, 15, 2000);
const material_relvae = new THREE.MeshBasicMaterial({map: loader.load('./Imagens/relva2.png')});
const relvae = new THREE.Mesh(geometry_relvae, material_relvae);
relvae.position.x = -150;

//Variaveis de luz (Ambiente, Direcional e Spotlight)
var luz_noite = [0, 1]; // 0 (noite), 1 (dia)
var luz_spot = 2; // 0 (desligado), 1 (ligado)
var luz_direc = 0;
var luz_carro = 0;

var ambientLight = new THREE.AmbientLight(0xffffff, 0.6);

var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(200, 500, 300);

//Luz proveniente do sol/lua
const spotLight = new THREE.SpotLight( 0xffffff );
spotLight.position.set( 100, 1000, 100 );
spotLight.castShadow = true;

//Luz proveniente da luminaria
var spotLight_lamp = new THREE.SpotLight( 0xffffff );
spotLight_lamp.position.set( -20, -150, 0 );
spotLight_lamp.castShadow = true;

// Carro----------------------------------------------------------
//Rodas (Carro)
function createWheels() {
    const geometry = new THREE.CylinderGeometry( 8, 8, 8, 64 );
    //const material = new THREE.MeshLambertMaterial({ color: 0x333333 });
    //const material = new THREE.MeshLambertMaterial({map: loader.load('./Imagens/roda.jpg') });
    const material_roda = [
        new THREE.MeshLambertMaterial({map: loader.load('./Imagens/roda.jpg') }),
        new THREE.MeshLambertMaterial({map: loader.load('./Imagens/jante.png') }),
        new THREE.MeshLambertMaterial({map: loader.load('./Imagens/jante.png') }),
    ];
    //const wheel = new THREE.Mesh(geometry, material);
    const wheel = new THREE.Mesh(geometry, material_roda);
    return wheel;
}

function createFarol() {
    const geometry_farol = new THREE.BoxBufferGeometry(5, 3, 2);
    const material_farol = new THREE.MeshLambertMaterial({ color: 0xffff00 });
    const farol = new THREE.Mesh(geometry_farol, material_farol);
    return farol;
}
const farol = createFarol();

function createPlate() {
    const geometry_plate = new THREE.BoxBufferGeometry(10, 5, 1);
    const material_plate = new THREE.MeshLambertMaterial({ map: loader.load('./Imagens/plate.jpg') });
    const plate = new THREE.Mesh(geometry_plate, material_plate);
    return plate;
}
const plate = createPlate();

 //Posições e objectos do Carro
function createCar() {
    const car = new THREE.Group();
    
    const backWheel = createWheels();
    backWheel.position.y = 6;
    backWheel.position.x = -18;
    car.add(backWheel);
    
    const frontWheel = createWheels();
    frontWheel.position.y = 6;  
    frontWheel.position.x = 18;
    car.add(frontWheel);
  
    const main = new THREE.Mesh(
      new THREE.BoxBufferGeometry(60, 15, 30),
      new THREE.MeshLambertMaterial({ color: 0x78b14b })
    );
    main.position.y = 12;
    car.add(main);
  
    const cabin = new THREE.Mesh(
      new THREE.BoxBufferGeometry(33, 12, 24),
      new THREE.MeshLambertMaterial({ color: 0xffffff })
    );
    cabin.position.x = -6;
    cabin.position.y = 25.5;
    car.add(cabin);
  
    return car;
} 
const car = createCar();

//Texturas do Carro (Janela frente e lado)
function getCarFrontTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 32;
    const context = canvas.getContext("2d");
  
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 64, 32);
  
    context.fillStyle = "#666666";
    context.fillRect(8, 8, 48, 24);
  
    return new THREE.CanvasTexture(canvas);
}  

function getCarSideTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 32;
    const context = canvas.getContext("2d");
  
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 128, 32);
  
    context.fillStyle = "#666666";
    context.fillRect(10, 8, 38, 24);
    context.fillRect(58, 8, 60, 24);
  
    return new THREE.CanvasTexture(canvas);
} 

//Construção do carro
function createCar() {
    const car = new THREE.Group();
  
    const backWheel = createWheels();
    // backWheel.position.y = 6;
    // backWheel.position.x = -18;
    //Novo
    backWheel.position.y = 8;
    backWheel.position.x = -18;
    backWheel.position.z = 15;
    backWheel.rotation.x = 1.6;
    car.add(backWheel);

    const backWheel2 = createWheels();
    backWheel2.position.y = 8;
    backWheel2.position.x = -18;
    backWheel2.position.z = -15;
    backWheel2.rotation.x = 1.6;
    car.add(backWheel2);
  
    const frontWheel = createWheels();
    frontWheel.position.y = 8;
    frontWheel.position.x = 18;
    frontWheel.position.z = 15;
    frontWheel.rotation.x = 1.6;
    car.add(frontWheel);

    const frontWheel2 = createWheels();
    frontWheel2.position.y = 8;
    frontWheel2.position.x = 18;
    frontWheel2.position.z = -15;
    frontWheel2.rotation.x = 1.6;
    car.add(frontWheel2);

    const farol1 = createFarol();
    farol1.position.y = 15;
    farol1.position.x = 31;
    farol1.position.z = 10;
    farol1.rotation.y = 1.5;
    car.add(farol1);

    const farol2 = createFarol();
    farol2.position.y = 15;
    farol2.position.x = 31;
    farol2.position.z = -10;
    farol2.rotation.y = 1.5;
    car.add(farol2);

    const plate = createPlate();
    plate.position.y = 10;
    plate.position.x = -30;
    plate.position.z = 0;
    plate.rotation.y = 1.5;
    car.add(plate);

    const main = new THREE.Mesh(
      new THREE.BoxBufferGeometry(60, 15, 30),
      new THREE.MeshLambertMaterial({ color: 0xa52523 })
    );
    main.position.y = 12;
    car.add(main);

    const carFrontTexture = getCarFrontTexture(); 
    const carBackTexture = getCarFrontTexture();
    const carRightSideTexture = getCarSideTexture();
  
    const carLeftSideTexture = getCarSideTexture();
    carLeftSideTexture.center = new THREE.Vector2(0.5, 0.5);
    carLeftSideTexture.rotation = Math.PI;
    carLeftSideTexture.flipY = false;
  
    const cabin = new THREE.Mesh(new THREE.BoxBufferGeometry(33, 12, 24), [
      new THREE.MeshLambertMaterial({ map: carFrontTexture }),
      new THREE.MeshLambertMaterial({ map: carBackTexture }),
      new THREE.MeshLambertMaterial({ color: 0xffffff }), // top
      new THREE.MeshLambertMaterial({ color: 0xffffff }), // bottom
      new THREE.MeshLambertMaterial({ map: carRightSideTexture }),
      new THREE.MeshLambertMaterial({ map: carLeftSideTexture }),
    ]);
    cabin.position.x = -6;
    cabin.position.y = 25.5;
    car.add(cabin);
  
    return car;
}

//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//Arvore no cenário
const treeCrownColor = 0x498c2c;
const treeTrunkColor = 0x4b3f2f;
const treeTrunkGeometry = new THREE.BoxBufferGeometry(15, 15, 30);
const treeTrunkMaterial = new THREE.MeshLambertMaterial({
  color: treeTrunkColor
});
const treeCrownMaterial = new THREE.MeshLambertMaterial({
  color: treeCrownColor
});

//Fazendo uma funcao pode-se iniciar varias arvores poupando linhas de codigo
function Tree() {
    const tree = new THREE.Group();
  
    const trunk = new THREE.Mesh(treeTrunkGeometry, treeTrunkMaterial);
    //trunk.position.z = 0;
    trunk.position.y = -45;
    trunk.position.x = 87;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    trunk.matrixAutoUpdate = true;
    trunk.rotation.x = 1.6;
    tree.add(trunk);
  
    //const treeHeights = [75];
    const height = 75;
  
    const crown = new THREE.Mesh(
      new THREE.SphereGeometry(height / 2, 30, 30),
      treeCrownMaterial
    );
    //crown.position.z = height / 2 + 30;
    crown.position.x = height + 10 ; //1.75
    crown.castShadow = true;
    crown.receiveShadow = false;
    tree.add(crown);

    return tree;
  }
const tree1 = Tree(); //Criar uma arvore

//---------------------------------------------
//Luminária no cenario
const lightCrownColor = 0xffff00;
const lightTrunkColor = 0x000000;

const lightTrunkGeometry = new THREE.BoxBufferGeometry(2, 4, 50);
const lightTrunkMaterial = new THREE.MeshLambertMaterial({
  color: lightTrunkColor
});
const lightCrownMaterial = new THREE.MeshLambertMaterial({
  color: lightCrownColor
});

//Fazendo uma funcao pode-se iniciar varias luminarias poupando linhas de codigo
function Lamp() {
    const lamp = new THREE.Group();
  
    const lighttrunk = new THREE.Mesh(lightTrunkGeometry, lightTrunkMaterial);
    lighttrunk.castShadow = true;
    lighttrunk.receiveShadow = true;
    lighttrunk.rotation.x = 1.6;
    lamp.add(lighttrunk);
  
    const light_height = 20;
  
    const lightcrown = new THREE.Mesh(
      new THREE.SphereGeometry(light_height / 2.5, 30, 30),
      lightCrownMaterial
    );

    lightcrown.position.y = light_height + 10 ; //1.75
    lightcrown.castShadow = true;
    lightcrown.receiveShadow = true;
    lamp.add(lightcrown);

    return lamp;
  }
const lamp1 = Lamp(); //Criar uma luminaria
//----------------------------------------------
//Gasolina
var gasolina = 100;
var combustao = 0;
var gasolina_disponivel = 100;
//----------------------------------------------------

//Luzes do carro
var spotLight_carro = new THREE.SpotLight(0xffffff, 0, 200, Math.PI/4, 0.5);
spotLight_carro.castShadow = true;
spotLight_carro.position.x = 50;
spotLight_carro.position.y = 15;
car.add(spotLight_carro);

//Target para direcionar a luz do carro transparente
const geometry_farols = new THREE.BoxBufferGeometry(5, 3, 2);
const material_farols = new THREE.MeshLambertMaterial({color: 0x0000ff, transparent: true, opacity: 0});
const farols = new THREE.Mesh(geometry_farols, material_farols);

//Posicionamento do target invisivel para luz carro
farols.position.x = 60; //30
farols.position.y = 15;
car.add(farols);
spotLight_carro.target = farols;
//var spotLightHelper = new THREE.SpotLightHelper( spotLight_carro ); //Debug
//----------------------------------

function Start(){

    //cena.add(cube_text);
    cena.add(directionalLight);
    cena.add(ambientLight);
    cena.add(spotLight);
    cena.add(spotLight_lamp);

    cena.add(sun);
    cena.add(tree1);
    cena.add(lamp1);
    cena.add(bomba);
    cena.add(car);
    cena.add(estrada);
    cena.add(relvad);
    cena.add(relvae);
    cena.add(terra);
    cena.add(farols);
    cena.add(spotLight_carro.target) //Actualizar posicao target

    //cena.add(spotLightHelper); //Debug Luzes
    cubes.push(cube_text); //Mover objectos

    //Posição objecto importado


    //Posição do cubo de debug
    cube_text.position.x = 150;
    cube_text.position.y = 50;

    //Posição das arvores
    tree1.position.x = -50;
    tree1.position.y = 5;
    tree1.position.z = 50;

    //Alinhar o carro
    car.position.y = -40;
    car.position.x = -50;

    //Posicionar a estrada
    estrada.position.x = -60;
    estrada.position.y = -46;

    //Posicionar a relva (direita)
    //relvad.position.x = 150;
    relvad.position.y = -57;

    //Posicionar a relva (esquerda)
    relvae.position.x =  25;
    relvae.position.y = -57;

    //Posicionar o sol
    sun.position.x = 180;
    sun.position.y = 90; 
    
    //Posicionar a lampada
    lamp1.position.x = -150;
    lamp1.position.y = -20;
    lamp1.position.z = -50;

    //Posicionar bomba de gasolina
    bomba.position.x = 0;
    bomba.position.y = -30;
    bomba.position.z = 300;
    bomba.scale.x = 1.7;
    bomba.scale.y = 1.7;

    //Posicionar solo (vista lateral)
    terra.position.y = -102;
    terra.position.x = -400;

    //Rotacao na horizontal (carro) [ALTERNATIVA]
    // renderer.setAnimationLoop(() => {
    // car.rotation.y -= 0.007;
    // }); 
    

    requestAnimationFrame(update);
}

document.addEventListener('mousemove', ev =>{
    var x = (ev.clientX - 0) / (window.innerWidth - 0) * (1-(-1)) + -1;
    var y = (ev.clientY - 0) / (window.innerWidth - 0) * (1-(-1)) + -1;

    cuboCoordRotation = {
        x:x,
        y:y
    }
} );

document.addEventListener('keydown', ev =>{
    var coords = {
    x:0,
    y:0,
    z:0
};

    //Restricao de movimento com deposito vazio
    if (gasolina_disponivel <= 0){
        movimentocarro = 0;
        movimentocarro2 = 0;
        alert("O depósito ficou vazio!");
    }

    //Encher o deposito
    if (car.position.x == -220 && gasolina_disponivel <=87 && cs== 1) {
        gasolina_disponivel = 100;
        alert("O depósito foi atestado!");
    }
    if (car.position.z == 325 && gasolina_disponivel <=87 && cs== 0) {
        gasolina_disponivel = 100;
        alert("O depósito foi atestado!");
    }

    //Tecla 1 = 49 (Movimento Direita)
    if (ev.keyCode == 49){

        car.position.z += movimentocarro;
        combustao += movimentocarro/40;
        gasolina_disponivel = gasolina - combustao;

        spotLight_carro.target = farols;
        
    }

    //Tecla 2 = 50 (Movimento Esquerda)
    if (ev.keyCode == 50){

        car.position.z += movimentocarro2;
        combustao += Math.abs(movimentocarro2/40);
        spotLight_carro.target = farols;
       
    }

    //Tecla C = 67 (Camara Ortografica ou Perspectiva)
    if (ev.keyCode == 67){
        if (cs == 0){
            alert("a mudar camara cs=1");
            cs = 1;
            camara = camaraO;
            camara.position.set(200, 0, 300);
            camara.lookAt(0, 0, 0);  
            car.position.z = 0;
        }

            else {
                alert("a mudar camara cs=0");
                cs = 0;
                camara = camaraP;
                camara.position.set(0, 0, 500);
                camara.lookAt(0, 0, 0); 
                car.position.x = -50;
            }
        }
        

    //Tecla A = 65 (Luz Ambiente)
    if (ev.keyCode == 65){
        if (luz_noite == 0){
             luz_noite = 1;
             luz_carro =0;
            }
            else {
                 luz_noite = 0;
                 luz_carro = 5;
            }
          ambientLight.intensity = luz_noite; //Luz ambiente
          sun.material = planeta[luz_noite];
          cena.background = ceu[luz_noite];
          spotLight_carro.intensity = luz_carro; //Luzes farol
        }

    //Tecla D = 68 (Luz Direcional)
    if (ev.keyCode == 68){
    if (luz_direc == 0){
        luz_direc = 1;}
       else {
        luz_direc = 0;
    }
    directionalLight.intensity = luz_direc;
    }

    //Tecla S = 83 (Luz SpotLight)
    if (ev.keyCode == 83){
        if (luz_spot == 0){
            luz_spot = 2;}
           else {
                luz_spot = 0;
        }
        spotLight_lamp.intensity = luz_spot;
    }
    //Tecla H = 72 (Help)
    if (ev.keyCode == 72){
        window.alert("Comandos disponíveis: \n C - Câmera \n 1 e 2 - Movimento carro \n A - Luz Ambiente \n S - Luz Spotlight \n D - Luz Direcional \n Mouse Hold - Câmera Órbita");
    }

    camaraAndar = coords;
    
});

document.addEventListener('keyup', ev=>{
    var coords = {
        x:0,
        y:0,
        z:0
    };

    if (ev.keyCode == 87)
        //coords.z += velocidadeAndar;

    if (ev.keyCode == 83)
        //coords.z -= velocidadeAndar;

    if (ev.keyCode == 65)
        //coords.x += velocidadeAndar;

    if (ev.keyCode == 68)
        //coords.x -= velocidadeAndar;  

    camaraAndar = coords;
});




function update(){
     if(cuboCoordRotation != null)
     {
        cube_text.rotation.y +=cuboCoordRotation.y *0.1;
        sun.rotation.y +=cuboCoordRotation.y *0.1;
        car.rotation.y -= 0.007;
     }
    
    if(camaraAndar != null)
    {
        camara.position.x += camaraAndar.x;
        camara.position.z += camaraAndar.z;
    }

    if(mixerAnimacao) {
        mixerAnimacao.update(relogio.getDelta());
    }

    camaraAndar = {x:0, y:0, z:0};

    controls.update();
    renderer.render(cena, camara);
    requestAnimationFrame(update);
}

