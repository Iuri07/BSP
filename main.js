function setup() {
	createCanvas(windowWidth, windowHeight);
	noLoop();

	//drawing flags
	enter_flag = false;
	glow_flag = false;
	mouseIsDragged = false;

	mouse_press = new Point(0,0);
	mouse_drag = new Point(0,0);

	//root points
	upper_left = new Point(1,1);
	upper_right = new Point(windowWidth-1,1);
	down_left = new Point(1,windowHeight -1);
	down_right = new Point(windowWidth-1, windowHeight-1);

	//creating the root
	vertices = color = [];
	vertices.push(upper_right, upper_left, down_right, down_left);
	color = randomColor();
	node = new Node(vertices, color, null);
	node.root = node;

	//builds graphic binary tree
	build(node);

}

function draw() {
	background(240);
	node.draw();
	
	//line glow
	if(glow_flag)
  		node.glow();		
	
	if(enter_flag)
		drawTree(node);
	
	//tree border glow
	if(enter_flag && mouseIsPressed){
		node.glowTree();
	}
	
	if(mouseIsDragged){
		strokeWeight(1.5);
		stroke(255);
  		line(mouse_press.x, mouse_press.y, mouse_drag.x, mouse_drag.y);
	}
}

function mouseDragged(){
  	mouse_drag.x = mouseX;
  	mouse_drag.y = mouseY;
  	glow_flag = true;
  	mouseIsDragged = true;
  	redraw();
}

function mousePressed(){
  	mouse_press.x = mouseX;
  	mouse_press.y = mouseY;
  	redraw();
} 

function mouseReleased(){
  	glow_flag = false;
  	mouseIsDragged = false;
	mouse_drag.x = mouseX;
  	mouse_drag.y = mouseY;
  	if(mouse_drag.x != mouse_press.x && mouse_drag.y != mouse_press.y)
		node.mouseRelease();
  	redraw();
} 

function keyPressed() {
	if (keyCode === ENTER)
		enter_flag = !enter_flag;	
	redraw();
}

function windowResized(){
  setup();
  redraw();
}