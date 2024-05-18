import * as THREE from 'three';

var myCanvas = document.getElementById("ResonanceSpin");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, myCanvas.width / myCanvas.height, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({antialias: true, canvas: myCanvas});
//also hacky and not great!
renderer.setSize( window.innerWidth, window.innerHeight);

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
const protonArrow = new THREE.ArrowHelper( dir, origin, length, hex );
var protonDir = new THREE.Vector3( 1, 3, 0 ).normalize();
var Bfield = new THREE.Vector3( 0, 1, 0 );
//set an initial direction for the proton arrow - so that we can see the resonance spin
protonArrow.setDirection(protonDir);    //My
const xArrow = new THREE.ArrowHelper( xdir, origin, length, red );
const yArrow = new THREE.ArrowHelper( ydir, origin, length, green );
const zArrow = new THREE.ArrowHelper( zdir, origin, length, blue );
scene.add( protonArrow );
scene.add( xArrow ); 
scene.add( yArrow ); 
scene.add( zArrow ); 

camera.position.y = 1;
camera.position.z = 5;
camera.position.x = 5;
//camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI/4);
camera.lookAt(new THREE.Vector3(0, 0, 0));
var clock = new THREE.Clock();

const T1 = 20.0;
const T2 = 20.0;
const w = 1.0;
var t = clock.getElapsedTime();

var crossResult = new THREE.Vector3 (0, 0, 0);
function animate() {
	requestAnimationFrame( animate );
  //lamor procession - > is the 1 in the z direction
  //protonArrow.setDirection(dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.01));
  //protonArrow.setDirection(new THREE.Vector3(delta*10.0, 1, 0).normalize());
  
  crossResult.crossVectors(protonDir, Bfield).normalize();
  protonArrow.setDirection(
    //Lamor freq is simply caused by u x B
    protonDir.addScaledVector(crossResult, 0.01)
    );    
  t = clock.getElapsedTime();
	renderer.render( scene, camera );
}

animate();