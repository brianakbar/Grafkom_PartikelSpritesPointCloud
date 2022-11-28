function init() {
	//Declare Variables
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
	var raycaster = new THREE.Raycaster();
	var renderer = new THREE.WebGLRenderer();
	const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 3);
	const helper = new THREE.PlaneHelper(plane, 5, 0xffff00);
	var orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
	var transformControl = new THREE.TransformControls(camera, renderer.domElement);

	//Init
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	camera.position.z = 10;

	//Create Object
	var cube = createCube(1);
	cube.position.set(-3, -1, 0);

	var cube2 = createCube(1);
	cube2.position.set(3, 1, 0);
	
	var sprite = createSprite("assets/pepe.jpg")

	//Add Group
	var objectGroup = new THREE.Group();
	objectGroup.add(cube);
	objectGroup.add(cube2);
	objectGroup.add(sprite);

	//Scene Add
	scene.add(helper);
	scene.add(objectGroup);
	scene.add(transformControl);

	render();

	function createCube(size) {
		var cubeGeo = new THREE.BoxGeometry(size, size, size);
		var cubeMat = new THREE.MeshBasicMaterial({ transparent: true });
		var cube = new THREE.Mesh(cubeGeo, cubeMat);

		return cube;
	}

	function createSprite(sprite_url) {
		var map = new THREE.TextureLoader().load(sprite_url);
		var material = new THREE.SpriteMaterial({
			blending: THREE.AdditiveBlending,
			opacity: 1,
			sizeAttenuation: true,
			color: 0xffffff,
			map: map
		});

		var sprite = new THREE.Sprite(material);
		sprite.scale.set(2, 2, 1);
	
		return sprite;
	}

	function render() {
		requestAnimationFrame(render);

		orbitControl.update();

        renderer.render(scene, camera);
	}

	window.addEventListener('keydown', function (event) {
		switch (event.code) {
			case 'KeyM':
				orbitControl.enabled = !orbitControl.enabled;
				break
			case 'KeyG':
            	transformControl.setMode('translate');
            	break
        	case 'KeyR':
            	transformControl.setMode('rotate');
            	break
        	case 'KeyS':
            	transformControl.setMode('scale');
            	break
		}
	})

	document.addEventListener("click", onclick, true);
    function onclick(event) {
		var mouse = new THREE.Vector2();
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
		raycaster.setFromCamera(mouse, camera);
		transformControl.detach();
		var intersects = raycaster.intersectObjects(objectGroup.children, true); //array
		if (intersects.length > 0) {
			transformControl.attach(intersects[0].object);
		}
	}
}

window.onload = init;