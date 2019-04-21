class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Node {

	constructor(vertex , color, parent = null){
		//variables for drawing the tree
		this.x = 0;
		this.y = 0;
		this.mod = 0;


		this.vertex = vertex.slice();
		this.color = color.slice();
		this.parent = parent;
		this.children = [];
		this.origin_line = [];
		this.root = [];
	}

	//draws the node
	draw(){
		arrange(this.vertex);
		if(this.children.length == 0){
			fill(this.color[0],this.color[1],this.color[2]);
			strokeWeight(2);
			stroke(51);
			beginShape();
			for(var i = 0; i < this.vertex.length; i++){
				vertex(this.vertex[i].x, this.vertex[i].y)
			}
			endShape(CLOSE);

			return;
		}else {
			this.children[0].draw();
			this.children[1].draw();
		}
	}

	//creates a child based on line created by the mouse
	createChildren(){
		var left = []; 
		var right = [];
		var intersection_points = [];
		var color = [];
		var origin = [];
			
			arrange(this.vertex);
			//gets points where polygon line intersects with mouse line
			for(var i = 0; i < this.vertex.length ; i ++){
				if(i == this.vertex.length - 1)
					var point = getIntersection(this.vertex[i], this.vertex[0]);				
				else
					var point = getIntersection(this.vertex[i], this.vertex[i+1]);
				if(point != null){
					intersection_points.push(point);	
				}
			}

			left = intersection_points.slice();
			right = intersection_points.slice();
			origin = intersection_points.slice();
			//separates in two nodes
			for(var i = 0; i < this.vertex.length; i ++){
				
				if(position(mouse_press, mouse_drag, this.vertex[i]) < 0)
					left.push(this.vertex[i]);

				else if(position(mouse_press, mouse_drag, this.vertex[i]) > 0)
					right.push(this.vertex[i]);

			}

			//sets child variables
			color = this.color.slice();
			this.children.push(new Node(left, color, this));
			color = randomColor();
			this.children.push(new Node(right, color, this));	
			this.children[0].origin_line = origin.slice();
			this.children[1].origin_line = origin.slice();
			this.children[0].root = this.root;
			this.children[1].root = this.root;


	}

	mouseRelease(){
		//creates a child and updates tree
		if(isInside(mouse_press, this.vertex) && this.children.length == 0 && isInside(mouse_drag, this.vertex)){
			this.createChildren();
			build(this.root);

		}else if(isInside(mouse_press, this.vertex) && this.children.length == 0 && !isInside(mouse_drag, this.vertex)){
			//kills child and updates tree
			this.killChild();
			build(this.root);
		
		}else if(isInside(mouse_press, this.vertex) && this.children.lenght != 0){
			this.children[0].mouseRelease();
			if(this.children.length)
				this.children[1].mouseRelease();
		
		}else return;	
	}

	//changes color of the line that created the node 
	glow(){

		if(isInside(mouse_press, this.vertex) && (this.children.length == 0) && !isInside(mouse_drag, this.vertex)){
			strokeWeight(2);
			stroke(255);
			
			if(this.origin_line.length != 0){
				line(this.origin_line[0].x, this.origin_line[0].y, this.origin_line[1].x, this.origin_line[1].y);
			}else return;

		}else if(isInside(mouse_press, this.vertex) && (this.children.length !== 0)){
			this.children[0].glow();
			this.children[1].glow();

		}else return;
	
	}

	//changes color of the circle border of the clicked node 
	glowTree(){
		if(isInside(mouse_press, this.vertex) && (this.children.length == 0)){
			noFill();
			strokeWeight(2);
			stroke(255);
			ellipse(this.x, this.y, 15);

			if(!isInside(mouse_drag, this.vertex) && mouseIsDragged){
				var brother = this.getBrother();
				var father = this.parent;
				fill(brother.color[0], brother.color[1], brother.color[2]);
				strokeWeight(2);
				stroke(51);
				ellipse(father.x, father.y, 15);
			}
			return;

		}else if(isInside(mouse_press, this.vertex) && (this.children.length !== 0)){
			this.children[0].glowTree();
			this.children[1].glowTree();
		}else return;
	
	}
	getBrother(){
		if(this.parent != null){
			if(this.parent.children[0] == this)
				return this.parent.children[1];
			else return this.parent.children[0];	
		
		} else return null;

	}
//deletes a node in the tree
	killChild(){
		if(this.parent != null){
			this.parent.color = [];
			var brother = this.getBrother();
			this.parent.color = brother.color.slice();
			this.parent.children = [];
			return;
		}else return null;
	}

}

//gets the average of given points
function centroid(points){
	var center = new Point(0,0);
	for(var i = 0; i < points.length; i++){
		center.x += points[i].x;
		center.y += points[i].y;
	}
	center.x /= points.length;
	center.y /= points.length;
	return center;
}

//sorts given points in clockwise order
function arrange(points){
	var center = new Point(0,0);
	var dx, dy, alpha;
	var angles = []; 
	var list = [];
	center = centroid(points);
	//stores the angles between the center and the point
	for(var i = 0; i < points.length; i++){
		dx = points[i].x - center.x;
		dy = points[i].y - center.y;
		alpha = Math.atan2(dy, dx);
		alpha *= 180/Math.PI;
		angles[i] = alpha;	
	}

	// joins the two arrays
	for(j = 0; j < points.length; j++)
		list.push({'angle': angles[j], 'point': points[j]});	

	//sorts them in function of the angle
	list.sort(function(a, b) {
    	return (a.angle - b.angle);
	}); 

	//separates them
	for (var k = 0; k < list.length; k++) {
    	angles[k] = list[k].angle;
    	points[k] = list[k].point;
	}

}

function getIntersection( line_r, line_s){
	var onLine2;
    //TODO limpar essa funcao
    den = ((line_s.y - line_r.y) * (mouse_drag.x - mouse_press.x)) - ((line_s.x - line_r.x) * (mouse_drag.y - mouse_press.y));
    //parallel lines
    if (den == 0) {
        return null;
    }
    dy = mouse_press.y - line_r.y;
    dx = mouse_press.x - line_r.x;
    num1 = ((line_s.x - line_r.x) * dy) - ((line_s.y - line_r.y) * dx);
    num2 = ((mouse_drag.x - mouse_press.x) * dy) - ((mouse_drag.y - mouse_press.y) * dx);
    a = num1 / den;
    b = num2 / den;

    //intersection points
    x = mouse_press.x + (a * (mouse_drag.x - mouse_press.x));
    y = mouse_press.y + (a * (mouse_drag.y - mouse_press.y));
    
    //mouse line is a segment and polygon line is infinite
    if (a > 0 && a < 1) {
        onLine1 = true;
    }
    //polygon line is a segment and mouse line is infinite
    if (b > 0 && b < 1) {
        onLine2 = true;
    }
    //wanted case where intersection is on the polygon segment
    if(onLine2){
    	result = new Point(x,y);
    	return result;
    }
}

//checks if point is inside all the polygon borders
// returns boolean
function isInside(point, polygon){
	var x = point.x, y = point.y;
	var inside = false;

	for(var i = 0, j = polygon.length - 1; i < polygon.length; j = i++){
		var xi  = polygon[i].x, yi = polygon[i].y;
		var xj = polygon[j].x, yj = polygon[j].y;

		var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
	}

	return inside;
}

//returs -1, 0 or 1 depending of where the point is relative to the line
function position(line_r, line_s, point){
	return Math.sign((line_s.x - line_r.x)*(point.y - line_r.y) - (line_s.y - line_r.y)*(point.x - line_r.x));	
}

//returns a array with a random color
function randomColor(){
	var r,g,b;
	var color = [];
	r = random(255); 
	g = random(255);
	b = random(255);
	color.push(r,g,b);
	return color;
}

