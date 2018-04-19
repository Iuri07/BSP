



function drawTree(node){

	if(node.children.length !== 0){
		fill(255);
	}
	else fill(node.color[0],node.color[1],node.color[2]);
	strokeWeight(2);
	stroke(51);
	if(node.children.length !== 0){
		line(node.x, node.y, node.children[0].x, node.children[0].y);
		line(node.x, node.y, node.children[1].x, node.children[1].y);
	}
	ellipse(node.x, node.y, 15);
	if(node.children.length !== 0){
		drawTree(node.children[0]);
		drawTree(node.children[1]);
	}
}

// sets how many nodes are blow
function setHeight(node){
		if(node.children.length !== 0){
			node.depth_left = getHeight(node.children[0], 1);
			node.depth_right = getHeight(node.children[1], 1);
			setHeight(node.children[0]);
			setHeight(node.children[1]);
		}else {
			node.depth_left = 0;
			node.depth_right = 0;
			return;
		}
	}

function getHeight(node, height){
		if(node.children.length !== 0){
			height++;
			var right = getHeight(node.children[0], height);
			var left = getHeight(node.children[1], height);
			return max(right, left);
		}
		if(node.children.length == 0){
			return height;
		}
	}

//assigns primary x and y, x depends on depth( distance*2^depth) 
function setPoints(node, x, y){
		// console.log(node.x);
		node.x = x;
		node.y = y;
		if(node.children.length !== 0){
			if(node.depth_left > 0 || node.depth_right > 0){
				setPoints(node.children[0], x - (7*Math.pow(2,node.depth_left)), y + 30);
				setPoints(node.children[1], x + (7*Math.pow(2,node.depth_right)), y + 30);
			}else {
				setPoints(node.children[0], x - 20, y + 40);
				setPoints(node.children[1], x + 20, y + 40);
			
			}
		}else return;


	}

	var contourl = [];
	var contourr = [];

function build(root){
	setHeight(root);
	setPoints(root, windowWidth/2, 30);
}