var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer({preserveDrawingBuffer: true});
//renderer.autoClearColor = false
var equiManaged = new CubemapToEquirectangular( renderer, true );
var recording = false
var screenShots = 0
var recordLength = document.getElementById('frames').value



var light = new THREE.PointLight( 0xff00ff, 1, 100 );
light.position.set( 0, 10, 0 );

scene.add( light );
var time = 0;

var objects = [];



controls = new THREE.TrackballControls(camera);
controls.rotateSpeed = 4.0;
controls.zoomSpeed = 2;
controls.panSpeed = 0.8;
controls.noZoom = false;
controls.noPan = false;
controls.staticMoving = true;
controls.dynamicDampingFactor = 0.3;

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var manager = new THREE.LoadingManager();
manager.onProgress = function (item, loaded, total) {
    console.log(item, loaded, total);
};

var onProgress = function (xhr) {
    if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
};

var onError = function (xhr) {
};



function rainObj(obj, number, x, y, z){
    for(var i = 0; i < number; i++){
        var newClone = obj.children[0].clone() 
        newClone.position.x = (x * Math.random())*(Math.round(Math.random() *2) - 1);
        newClone.position.y = (y * Math.random())*(Math.round(Math.random() *2) - 1);
        newClone.position.z = (z * Math.random())*(Math.round(Math.random() *2) - 1);
        objects.push(newClone)
        scene.add(newClone)
    }
}

function record(){
    console.log(recordLength)
    recording = !recording
}





var loader = new THREE.OBJVertexColorLoader(manager);
loader.load('models/Olivia_freal.obj', function (object) {
    object.traverse(function(node){
        if(node.material){
            node.material.side = THREE.DoubleSide;
        }
    })
    window.model = object;
    object.rotation.x = Math.PI;
    object.rotation.y = Math.PI;
    console.dir(object);
}, onProgress, onError);




var light = new THREE.PointLight( 0xffff00, 1, 100 );
light.position.set( 50, 50, 50 );
scene.add( light );




camera.position.z = 5;

var animate = function () {
    requestAnimationFrame( animate );
    controls.update();
    renderer.render(scene, camera);
    objects.forEach(function(obj){
        obj.rotation.x +=.1
    })
    if(recording){
        equiManaged.update(camera,scene)
        screenShots++
        if(screenShots > recordLength){
            record()
        }
    }
};

animate();