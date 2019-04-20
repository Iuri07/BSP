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

function setInitialX(node){
	if(node.children.length !== 0){
		setInitialX(node.children[0]);
		setInitialX(node.children[1]);
	}
	if(node.parent !== null)
		if(node.parent.children[1] == node)
			node.x = node.parent.children[0].x + 30;
		else
			node.x = 100;
	else 
		node.x = 100;
	return;
}

function setTestHeight(node, y){
	node.y = y;
	if(node.children.length !== 0){
			setTestHeight(node.children[0], y + 30);
			setTestHeight(node.children[1], y + 30);
	}else return;
}

function setSecondX(node){
	if(node.children.length !== 0){
		setSecondX(node.children[0]);
		setSecondX(node.children[1]);
		if(node.parent !== null){
			if(node.parent.children[0] == node){
				node.x = (node.children[0].x + node.children[1].x)/2;
			}else{
				node.mod = node.x - (node.children[0].x + node.children[1].x)/2;
			}
		}else
			node.x = (node.children[0].x + node.children[1].x)/2;
	}
}

function getLeftContour(node,modSum, values){
    if (!values[node.y])
        values[node.y] = node.x + modSum;
	else
        values[node.y] = Math.min(values[node.y], node.x + modSum);
  
	modSum += node.mod;
	if(node.children.length !== 0){
		getLeftContour(node.children[0], modSum, values);
		getLeftContour(node.children[1], modSum, values);
	}
}

function getRightContour(node,modSum, values){
	if (values[node.y] == undefined)
		values[node.y] = node.x + modSum;
    else
        values[node.y] = Math.max(values[node.y], node.x + modSum);
  
	modSum += node.mod;
	if(node.children.length !== 0){
		getRightContour(node.children[0], modSum, values);
		getRightContour(node.children[1], modSum, values);
	}
}

function fixMiddle(node){
	let contourleft = {};
	let contourright = {};
	let cl = [];
	let cr = [];
	let shift = 0;
	if(node.children.length > 0){
		getRightContour(node.children[0], node.mod, contourright);
		getLeftContour(node.children[1], node.mod, contourleft);
		cl = Object.values(contourleft);
		cr = Object.values(contourright);
		for(i = 0; i < (cl.length < cr.length ? cl.length : cr.length); i++){
			let distance = cl[i] - cr[i];
			console.log(cl.length < cr.length ? cl.length : cr.length)
			if(distance + shift < 30){
				shift = Math.max(shift, 30 - distance); 
			}
		}
		node.children[1].x += shift;
		node.children[1].mod += shift;
		fixMiddle(node.children[0]); 
		fixMiddle(node.children[1]); 
		return;
	}else{
		return;
	}

}

function setMod(node, modSum){
	node.x += modSum;
	modSum += node.mod;
	node.mod = 0;
	if(node.children.length !== 0){
		setMod(node.children[0], modSum);
		setMod(node.children[1], modSum);
	}else
		return;
}

function center(node){
	if(node.children.length !== 0){
		center(node.children[0]);
		center(node.children[1]);
		node.x = (node.children[0].x + node.children[1].x)/2;
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

var contourl = {};
var contourr = {};

function build(root){
	root.mod = 0;
	let height = 0;
	let total_height;
	setInitialX(root);
	setTestHeight(root, 50);
	if(root.children.length > 0){
		setInitialX(root);
		setTestHeight(root, 50);
		setSecondX(root);
		total_height = getHeight(root, height);
		for(let i = 0; i < total_height+1; i++){
			fixMiddle(root);
			setMod(root, 0);
			center(root);
			setMod(root, 0);
		}

	}
}