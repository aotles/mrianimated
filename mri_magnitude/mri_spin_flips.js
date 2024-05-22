import * as THREE from 'three';

var myCanvas = document.getElementById("flips_camera");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, myCanvas.width / myCanvas.height, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({antialias: true, canvas: myCanvas});
//also hacky and not great!
renderer.setSize( window.innerWidth * .8, window.innerHeight * .8);

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x008000 } );
const cube = new THREE.Mesh( geometry, material );
//scene.add( cube );

//Adding the arrow
var dir = new THREE.Vector3( 0, 0, 0 );
const xdir = new THREE.Vector3( 1, 0, 0 );
const zdir = new THREE.Vector3( 0, 1, 0 );
const ydir = new THREE.Vector3( 0, 0, 1 );
const rfField = new THREE.Vector3( 0, 0, 1 );
//normalize the direction vector (convert to vector of length 1)
dir.normalize();
var origin = new THREE.Vector3(-15, -8, 0 );
const length = 4;
const yellow = 0xffff00;
const red = 0xff0000;
const green = 0x00ff00;
const blue = 0x0000ff;
const avgArrow = new THREE.ArrowHelper( dir, origin, 0, yellow );
const xArrow = new THREE.ArrowHelper( xdir, origin, length, red );
const yArrow = new THREE.ArrowHelper( ydir, origin, length, green );
const zArrow = new THREE.ArrowHelper( zdir, origin, length, blue );

//create 2d arrow of 100 arrows in front of screen
var numRows = 10;
var numCols = 10;
const protonVecs = [];
var avgVec = new THREE.Vector3(0, 0, 0);

var dummyVec =  new THREE.Vector3(0, 1, 0);
for (let x = 0; x < numRows; x++) {
  for (let y = 0; y < numCols; y++) {
    //give each proton a random direction
    var dummyVec = new THREE.Vector3(0,0,0).setFromSphericalCoords(1, Math.random()*Math.PI*2, Math.random()*Math.PI*2);
    protonVecs.push(dummyVec);
  }
}

scene.add( avgArrow );
scene.add( xArrow ); 
scene.add( yArrow ); 
scene.add( zArrow ); 

const protonArrows = [];
var protonArrowsOrigin;
for (let x = 0; x < protonVecs.length; x++) {
  //place it into the right column
  var xind = x % numRows;
  var yind = Math.floor(x / numRows);
  //xCoord varies from -10 to 10
  //yCoord varies from -10 to 10
  //zCoord is always 0
  var xCoord = -10 + 2*xind;
  var yCoord = -10 + 2*yind;
  protonArrowsOrigin = new THREE.Vector3(xCoord, yCoord, 0 );
  protonArrows.push(new THREE.ArrowHelper(protonVecs[x], protonArrowsOrigin, 3, yellow));
  scene.add( protonArrows[x] ); 
}

camera.position.y = 0;
camera.position.z = 16;
camera.position.x = 0;
//camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI/4);
camera.lookAt(new THREE.Vector3(0, 0, 0));
var clock = new THREE.Clock();

const T1 = 20.0;
const T2 = 20.0;
var w = 0.0;
var t = clock.getElapsedTime();
var teslas =0;

document.getElementById("teslas").addEventListener("input", function(evt) {
  teslas = this.value;
  w = teslas;
  var diffAmt = Math.floor(teslas/1);
  console.log(diffAmt);
  var count = 0;

  //orient the arrows parrallel to the magnetic field
  if (teslas > 0) {
    for (let x = 0; x < (Math.floor(protonVecs.length/2) -diffAmt); x++) {
      protonArrows[x].setDirection(new THREE.Vector3(0, -1, 0));
      protonArrows[x].setColor(red);
    }
    for (let x = (Math.floor(protonVecs.length/2) -diffAmt); x < protonVecs.length; x++) {
      protonArrows[x].setDirection(new THREE.Vector3(0, 1, 0));
      if (count < diffAmt) {
        protonArrows[x].setColor(blue);
        count++;
      }
    }
  } else { //put them back in their random positions
    for (let x = 0; x < protonVecs.length; x++) {
      protonArrows[x].setDirection(protonVecs[x]);
      protonArrows[x].setColor(orange);
    }
  }

  //Adjust magnitude of the Average Vector
  avgArrow.setLength(diffAmt/2);

});

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

animate();