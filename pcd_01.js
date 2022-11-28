function init() {
	//Declare Variables
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
	var renderer = new THREE.WebGLRenderer();
	const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.5);
	const helper = new THREE.PlaneHelper(plane, 2, 0xffff00);
	var orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
    const light = new THREE.PointLight(0xffffff, 5, 100);
    const loader = new THREE.PCDLoader();

	//Init
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	camera.position.set(0, 0.2, 0.3);
    light.position.set(50, 50, 50);

	//Scene Add
    loader.load('/assets/bunny.pcd', function(points) {
        selectedPCD = points;
        scene.add(selectedPCD);
    });
    scene.add(light);
	scene.add(helper);

	render();

	function render() {
		requestAnimationFrame(render);

		orbitControl.update();

        renderer.render(scene, camera);
	}
}

window.onload = init;