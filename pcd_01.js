function init() {
	//Declare Variables
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
	var renderer = new THREE.WebGLRenderer();
	const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 3);
	const helper = new THREE.PlaneHelper(plane, 15, 0xffff00);
	var orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
    const light = new THREE.PointLight(0xffffff, 5, 100);
    var loader = new THREE.OBJLoader();
    var modelParticles = new THREE.Group();
    var mesh;

	//Init
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	camera.position.set(0, 20, 20);
    light.position.set(50, 50, 50);

	//Create Object
    var cube = createCube(1);
	cube.position.set(-3, -1, 0);

	//Scene Add
    loader.load('/assets/HuTao.obj', function (loadedMesh) {
        var material = new THREE.MeshLambertMaterial({color: 0x5C3A21});
        loadedMesh.children.forEach(function (child) {
            child.material = material;
            modelParticles.add(createPointCloud(child.geometry));
        });
        mesh = loadedMesh;
        scene.add(modelParticles);
    });
    scene.add(light);
    scene.add(cube);
	scene.add(helper);

    //GUI controls
    var controls = new function () {
        this.asParticles = true;

        this.redraw = function () {
            scene.remove(modelParticles);
            scene.remove(mesh);

            if(controls.asParticles) {
                scene.add(modelParticles);
            }
            else if(mesh) {
                scene.add(mesh);
            }
        };
    };

    var gui = new dat.GUI();
    gui.add(controls, 'asParticles').onChange(controls.redraw);
    
    controls.redraw();

	render();

    function generateSprite() {
        var canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;

        var context = canvas.getContext('2d');
        var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
        gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
        gradient.addColorStop(1, 'rgba(0,0,0,1)');

        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    function createPointCloud(geom) {
        var material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.2,
            transparent: true,
            blending: THREE.AdditiveBlending,
            map: generateSprite()
        });

        var cloud = new THREE.Points(geom, material);
        cloud.sortParticles = true;
        return cloud;
    }

    function createCube(size) {
		var cubeGeo = new THREE.BoxGeometry(size, size, size);
		var cubeMat = new THREE.MeshBasicMaterial({ transparent: true });
		var cube = new THREE.Mesh(cubeGeo, cubeMat);

		return cube;
	}

	function render() {
		requestAnimationFrame(render);

		orbitControl.update();

        renderer.render(scene, camera);
	}
}

window.onload = init;