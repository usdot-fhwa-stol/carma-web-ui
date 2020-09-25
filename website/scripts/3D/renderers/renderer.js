 //3D scripts placeholder                     
import { LineGeometry } from '../../../thirdparty/three/modules/lines/LineGeometry.js'; //https://threejs.org/examples/jsm/lines/LineGeometry.js
import { Line2 } from '../../../thirdparty/three/modules/lines/Line2.js'; //https://threejs.org/examples/jsm/lines/Line2.js
import { LineMaterial } from '../../../thirdparty/three/modules/lines/LineMaterial.js';//https://threejs.org/examples/jsm/lines/LineMaterial.js

 //
 var scene = new THREE.Scene();
 var camera = new THREE.PerspectiveCamera( 50, 0.5*window.innerWidth / window.innerHeight, 0.1, 1000 );
 scene.background = new THREE.Color( 0x2A2828 );
 var renderer = new THREE.WebGLRenderer();
 renderer.setSize( window.innerWidth, window.innerHeight );
 document.getElementById('main-canvas').appendChild( renderer.domElement );
 window.addEventListener('resize',()=>{
     renderer.setSize( window.innerWidth, window.innerHeight );
 }); 
 var controls = new THREE.OrbitControls( camera, renderer.domElement );
 var light = new THREE.AmbientLight( 0xFFFFFF ); // soft white light
 scene.add( light );
 camera.position.set( -35, 25, 0);
 controls.update();     
 
 var plane = new THREE.Plane()
                 .setFromNormalAndCoplanarPoint
                 (
                         new THREE.Vector3(0, 0, 1), 
                         new THREE.Vector3(0, 0, 1)
                 );
 var raycaster = new THREE.Raycaster();
 var corner = new THREE.Vector2();
 var cornerPoint = new THREE.Vector3();
 corner.set(-1, -1); 
 raycaster.setFromCamera(corner, camera);
 raycaster.ray.intersectPlane(plane, cornerPoint);
 
// instantiate a loader for car 1 obj

 const mtlLoader = new THREE.MTLLoader();   
 var loadedcar_cur =null;  
 var loadedcar2 =null;  
 var loadedcar_front=null; 
 mtlLoader.load('images/models/car_blue.mtl', materials => {
     materials.preload();  
     //car1 --current                              
     const objLoader = new THREE.OBJLoader();    
     objLoader.setMaterials(materials);
     objLoader.load('images/models/car.obj', loaded => {
         loaded.scale.set(2.5,2,1);//change car shape
         //set car position
         loaded.position.x=-20;
         loaded.position.y=0;
         loaded.position.z=0;
         loadedcar_cur = loaded;
         scene.add( loaded );
     }); 
 });

 var geometryCube = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
 var materialCube = new THREE.MeshBasicMaterial( {color: 0x000000} );
 var cube = new THREE.Mesh( geometryCube, materialCube );
 scene.add( cube );

 //car3 - front
 mtlLoader.load('images/models/car_black.mtl', materials => {
     materials.preload();  
     //car1 --current                              
     const objLoader = new THREE.OBJLoader();    
     objLoader.setMaterials(materials);
     objLoader.load('images/models/car.obj', loaded => {
       loaded.scale.set(1,1,1);//change car shape
         // loaded.position.copy(cornerPoint).add(new THREE.Vector3(0, 15, 0)); 
         loaded.position.x=-8;
         loaded.position.y=0;
         loaded.position.z=0;
         loadedcar_front = loaded;
       //  scene.add( loaded );
     });
 });

 mtlLoader.load('images/models/car_red.mtl', materials => {
     materials.preload();  
     //car1 --current                              
     const objLoader = new THREE.OBJLoader();    
     objLoader.setMaterials(materials);
      //car2 -right
      objLoader.load('images/models/car.obj', loaded => {
       loaded.scale.set(1,1,1);//change car shape
         // loaded.position.copy(cornerPoint).add(new THREE.Vector3(0, 15, 0)); 
         loaded.position.x=8;
         loaded.position.y=0;
         loaded.position.z=0;
         loadedcar2 = loaded;
       //  scene.add( loaded );
     });
 });

 //Add Gray floow
 var geometry = new THREE.PlaneBufferGeometry(1000,1000);
 var material = new THREE.MeshStandardMaterial({
     color: 0x2f2f2f,
     roughness: 1.0,
     metalness:0.0
 });
 var floor = new THREE.Mesh( geometry,material )
 // floor.rotation.x = -Math.PI / 2;
 floor.position.y = 0;
// scene.add( floor );

 //add Grid floor
 var grid = new THREE.GridHelper(50,30,0xcccccc,0x00ccff);
 //scene.add( grid );

 //Add Play Area
 // create the road surface plane Area for car 1,2,3           
 var planeArea = new THREE.Mesh(
     new THREE.PlaneGeometry(
         1000,
         15.55,
         1,
         1),
         new THREE.MeshLambertMaterial(
         {
             color: 0xffffff,
             emissive:0x2A2828,
             emissiveIntensity: .2,
             side: THREE.DoubleSide
         })
 );
 planeArea.rotation.x = -Math.PI/2;
 planeArea.position.y = 0.01;
 planeArea.position.z = 0;
 scene.add(planeArea);

/**
 * LineDashedMaterial
var dashlineMaterial = new THREE.LineDashedMaterial( {
    color: 0xffffff,
    linewidth: 2,
    scale: 1,
    dashSize: 5,
    gapSize: 10,
  } );
 var points = [];
 points.push( new THREE.Vector3( -1000, 0, 2.5 ) );
 points.push( new THREE.Vector3( 1000, 1, 2.5) );
 var geometry = new THREE.BufferGeometry().setFromPoints( points );
 var dashLineRight = new THREE.Line( geometry, dashlineMaterial );
 dashLineRight.computeLineDistances();
 scene.add( dashLineRight );
 ***/
var roadLineMaterial = new LineMaterial({
    color:  0xffffff,
    linewidth: 0.012,
    dashed: true,
    dashScale: 1,
    dashSize: 14,
    gapSize: 12,
    resolution: THREE.Vector2(innerWidth,innerHeight), // to be set by renderer
 });
 roadLineMaterial.defines.USE_DASH="";

 var positions = [];
 positions.push(  -1000, 0.05, -2.5  );
 positions.push( 1000, 0.05, -2.5 );
 var lineGeometryLeft = new LineGeometry();
 lineGeometryLeft.setPositions(positions);
 var dashLineLeft = new Line2( lineGeometryLeft, roadLineMaterial );
 dashLineLeft.computeLineDistances();
 dashLineLeft.scale.set(1,1,1);
 scene.add( dashLineLeft );
 
 positions = [];
 positions.push( -1000, 0.05, 2.5 );
 positions.push( 1000, 0.05, 2.5 );
 var lineGeometryRight = new LineGeometry();
 lineGeometryRight.setPositions(positions);
 var dashLineRight = new Line2( lineGeometryRight, roadLineMaterial );
 dashLineRight.computeLineDistances();
 dashLineRight.scale.set(1,1,1);
 scene.add( dashLineRight );

 // create the plane lanes' material	
 var planeMaterial =
 new THREE.MeshLambertMaterial(
 {
     color: 0x1c1c1c,
     emissive:0x1c1c1c,
     emissiveIntensity: .2,
     side: THREE.DoubleSide
 });

 // create the road surface 
 var plane_lane1 = new THREE.Mesh(
     new THREE.PlaneGeometry(
         1000,
         5,
         1,
         1),
     planeMaterial
 );
 plane_lane1.rotation.x = -Math.PI/2;
 plane_lane1.position.y = 0.03;
 plane_lane1.position.z = -5;
 scene.add(plane_lane1);

 var plane_lane2 = new THREE.Mesh(
     new THREE.PlaneGeometry(
         1000,
         5,
         1,
         1),
     planeMaterial
 );
 plane_lane2.rotation.x = -Math.PI/2;
 plane_lane2.position.y = 0.03;
 scene.add(plane_lane2);

 // create the road surface plane1 lane1 for car 1
 var plane_lane3 = new THREE.Mesh(
     new THREE.PlaneGeometry(
         1000,
         5,
         1,
         1),
     planeMaterial
 );
 plane_lane3.rotation.x = -Math.PI/2;
 plane_lane3.position.y = 0.03;
 plane_lane3.position.z = 5;
 scene.add(plane_lane3);

 function animate() 
 {
     requestAnimationFrame( animate );              
     render();                
 }

 function render()
 {
   //rotate camera
   // var timer = Date.now()  * 0.001;
   // camera.position.x = Math.cos( timer ) * 10;
   // camera.position.z = Math.sin( timer ) * 10;
   // camera.lookAt( scene.position);

   //rotate around quaternion
   // camera.position.applyQuaternion( new THREE.Quaternion().setFromAxisAngle(
   //     new THREE.Vector3(20,0,0),
   //     Math.PI / 1000 
   // ));
     // loadedcar.rotation.x += 0.01;
   //loadedcar.rotation.y += 0.01;
   
   if(loadedcar_cur!=null){
       //move cars
       //loadedcar_cur.position.x +=0.3;
       //  loadedcar2.position.x +=0.02;
       //  loadedcar_front.position.x +=0.01;                   
           
       //move camera

       cube.position.x=loadedcar_cur.position.x+10;
       cube.position.y=loadedcar_cur.position.y;
       cube.position.z=loadedcar_cur.position.z;
       camera.position.x =cube.position.x-25;
       camera.position.z =cube.position.z;
       camera.position.y =cube.position.y+25;
       camera.lookAt(cube.position);  

   }

   // camera.lookAt( scene.position );
   //roate scene
   // scene.rotation.x = -90 * Math.PI/ 180;
     renderer.render( scene, camera );
 }
 animate();