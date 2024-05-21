import * as THREE from 'three';

var myCanvas = document.getElementById("ResonanceSpin");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, myCanvas.width / myCanvas.height, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({antialias: true, canvas: myCanvas});
//also hacky and not great!
renderer.setSize( window.innerWidth, window.innerHeight*.8);

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
//scene.add( cube );

//Adding the arrow
var dir = new THREE.Vector3( 1, 0, 0 );
const xdir = new THREE.Vector3( 1, 0, 0 );
const zdir = new THREE.Vector3( 0, 1, 0 );
const ydir = new THREE.Vector3( 0, 0, 1 );
const rfField = new THREE.Vector3( 0, 0, 1 );
//normalize the direction vector (convert to vector of length 1)
dir.normalize();
const origin = new THREE.Vector3( 0, -1, 0 );
const length = 4;
const hex = 0xffff00;
const red = 0xff0000;
const green = 0x00ff00;
const blue = 0x0000ff;
const teal = 0x00ffff;
const protonArrow = new THREE.ArrowHelper( dir, origin, length, hex );
var protonDir = new THREE.Vector3( 1, 3, 0 ).normalize();
var Bfield = new THREE.Vector3( 0, 1, 0 );
//set an initial direction for the proton arrow - so that we can see the resonance spin
protonArrow.setDirection(protonDir);    //My
const xArrow = new THREE.ArrowHelper( xdir, origin, length, red );
const yArrow = new THREE.ArrowHelper( ydir, origin, length, green );
const zArrow = new THREE.ArrowHelper( zdir, origin, length, blue );
const rotxArrow = new THREE.ArrowHelper( xdir, origin, length, red );
const rotyArrow = new THREE.ArrowHelper( ydir, origin, length, green );
scene.add( protonArrow );
scene.add( xArrow ); 
scene.add( yArrow ); 
scene.add( zArrow ); 

const centerScreen = new THREE.Vector3(0, 0, 0);
var camPosition = new THREE.Vector3(5, 1, 5);
camera.position.copy(camPosition);
camera.lookAt(centerScreen);
var clock = new THREE.Clock();

const w = 2*Math.PI/4; //2pi /second
var t = clock.getElapsedTime();
var Beff = new THREE.Vector3(0, 2, 0);
const beffArrow = new THREE.ArrowHelper( Beff, origin, 5, teal );
scene.add( beffArrow ); 
var tipAmnt = 0.1;
var offResonancePhi = 0;
var flipAngleMax = document.getElementById("flipAngle").value / 180 * Math.PI;
var currFA = 0;
var currTime = clock.getElapsedTime();

var sphereVec = new THREE.Vector3(0,0,0);      //My
/* add event listeners */
document.getElementById("wdelta").addEventListener("input", function(evt) {
  offResonancePhi = (this.value / 180) * Math.PI;
});
document.getElementById("flipAngle").addEventListener("input", function(evt) {
  flipAngleMax = (this.value / 180) * Math.PI;
  currTime = clock.getElapsedTime();
});

var enRotCam = false; 
document.getElementById("rotCam").addEventListener("input", function(evt) {
  enRotCam = this.checked;
});



function animate() {
	requestAnimationFrame( animate );
  t = clock.getElapsedTime() - currTime;
  if (currFA < flipAngleMax) {
    currFA = tipAmnt*t;
  }
  else {
    currFA = flipAngleMax;
  } 
  sphereVec.setFromSphericalCoords(1, currFA, w*t);
  Beff.setFromSphericalCoords(1, offResonancePhi, w*t);
  var sphereVec4= new THREE.Vector4(sphereVec.x, sphereVec.y, sphereVec.z, 1);
  var rotateOnX = new THREE.Matrix4().makeRotationX(offResonancePhi);
  var rotateOnZ = new THREE.Matrix4().makeRotationY(w*t);// we use Y instead of Z
  sphereVec4.applyMatrix4(rotateOnX);
  sphereVec4.applyMatrix4(rotateOnZ);
  //if (offResonancePhi != 0) {
  //}
  sphereVec.set(sphereVec4.x, sphereVec4.y, sphereVec4.z);
  
  protonArrow.setDirection(
    sphereVec
    );    
  beffArrow.setDirection(
    Beff
    );
  //rotating camera vs stationary
  if (enRotCam) {
    var dummy = new THREE.Vector3(0, 0, 0); 
    dummy.setFromCylindricalCoords(7.07, w*t + Math.PI/4, 1);
    camera.position.copy(dummy);
    //camera.position(new THREE.Vector3(5*Math.cos(w*t), 1, 5*Math.sin(w*t));
    camera.lookAt(centerScreen);
  } else {  
    camera.position.copy(camPosition);
    camera.lookAt(centerScreen);
  }
	renderer.render( scene, camera );
}

animate();