/*
 * An object representing a 3x3 matrix
 */

var Matrix3 = function() {

	// Stores a matrix in a flat array, see the "set" function for an example of the layout
	// This format will be similar to what we'll eventually need when feeding this to WebGL
	this.elements = new Float32Array(9);

	// todo
	// this.elements should be initialized with values equal to the identity matrix
	for (var i = 0; i < 9; ++i) {
		this.elements[i] = (i % 3 == Math.floor(i / 3)) ? 1 : 0;
	}
	// -------------------------------------------------------------------------
	this.clone = function() {
		// todo
		// create a new Matrix3 instance that is an exact copy of this one and return it
		var other = new Matrix3();
		for(x=0; x < this.elements.length;x++){
			other.elements[x]=this.elements[x];
		}
		return other /* should be a new Matrix instance*/;
	};

	// -------------------------------------------------------------------------
	this.copy = function(other) {
		// todo
		// copy all of the elements of other into the elements of 'this' matrix
		for(x=0; x < this.elements.length;x++){
			this.elements[x]=other.elements[x];
		}
		return this;
	};

	// -------------------------------------------------------------------------
	this.set = function (e11, e12, e13, e21, e22, e23, e31, e32, e33) {
		// todo
		// given the 9 elements passed in as argument e-row#col#, use
		// them as the values to set on 'this' matrix
		var x = 0;
		this.elements[x++]= e11;
		this.elements[x++]= e12;
		this.elements[x++]= e13;
		this.elements[x++]= e21;
		this.elements[x++]= e22;
		this.elements[x++]= e23;
		this.elements[x++]= e31;
		this.elements[x++]= e32;
		this.elements[x++]= e33;
		return this;
	};

	// -------------------------------------------------------------------------
	this.getElement = function(row, col) {
		// todo
		// use the row and col to get the proper index into the 1d element array and return it
		return this.elements[row*3+col];
	};

	// -------------------------------------------------------------------------
	this.identity = function() {
		// todo
		// reset every element in 'this' matrix to make it the identity matrix
		for (var i = 0; i < 9; ++i) {
			this.elements[i] = (i % 3 == Math.floor(i / 3)) ? 1 : 0;
		}
		return this;
	};

	// -------------------------------------------------------------------------
	this.setRotationX = function(angle) {
		// not required yet, attempt to implement if finished early
		// create a rotation matrix that rotates around the X axis
		return this;
	};

	// -------------------------------------------------------------------------
	this.setRotationY = function(angle) {
		// not required yet, attempt to implement if finished early
		// create a rotation matrix that rotates around the Y axis
		return this;
	};


	// -------------------------------------------------------------------------
	this.setRotationZ = function(angle) {
		// not required yet, attempt to implement if finished early
		// create a rotation matrix that rotates around the Z axis
		return this;
	};

	// -------------------------------------------------------------------------
	this.multiplyScalar = function(s) {
		// todo
		// multiply every element in 'this' matrix by the scalar argument s
		for (var i = 0; i < 9; ++i) {
			this.elements[i] = this.elements[i]*s;
		}
		return this;
	};

	// -------------------------------------------------------------------------
	this.multiplyRightSide = function(otherMatrixOnRight) {
		// todo
		// multiply 'this' matrix (on the left) by otherMatrixOnRight (on the right)
		// the results should be applied to the elements on 'this' matrix
		var tmp = new Float32Array(9);
		for(x=0; x < tmp.length;x++){
			tmp[x]=0;
		}
		for (var col = 0; col < 3; col++) {
			for (var row = 0; row < 3; row++) {
				var i =  col*3+row;
				for( var u = 0; u < 3; u++){
						var h = col*3+u;
						var j = u*3+row;
						tmp[i] = tmp[i] + this.elements[h]*otherMatrixOnRight.elements[j];

				}
			}
		}
		for(x=0; x < tmp.length;x++){
			this.elements[x] = tmp[x];
		}
		return this;
	};

	// -------------------------------------------------------------------------
	this.determinant = function() {
		// todo
		// compute and return the determinant for 'this' matrix
		var x = 0;
		var a = this.elements[x++];
		var b = this.elements[x++];
		var c = this.elements[x++];
		var d = this.elements[x++];
		var e = this.elements[x++];
		var f = this.elements[x++];
		var g = this.elements[x++];
		var h = this.elements[x++];
		var i = this.elements[x++];
		var det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
		return det; // should be the determinant
	};

	// -------------------------------------------------------------------------
	this.transpose = function() {
		// todo
		// modify 'this' matrix so that it becomes its transpose
		/*
		0,4,8 Doesnt matter
		1,2,5 XOR Col with row below
		3,6,7
		*/
		var swapElms=[1,2,5];
		for (var i = 0; i <swapElms.length; ++i) {
            var row = Math.floor(swapElms[i] / 3);
			var col = swapElms[i] % 3;
			var rc = row*3+col;
			var cr = col*3+row;
			var tmp = this.elements[rc];
			this.elements[rc] = this.elements[cr];
            this.elements[cr] = tmp;
        }
		return this;
	};

	// -------------------------------------------------------------------------
	this.inverse = function() {
		// todo
		// modify 'this' matrix so that it becomes its inverse
		var invDet = 1/this.determinant();  //Find this BEFORE anything else

		//Create matrix of minors
		var tmp = new Float32Array(9);
		for(x=0; x < tmp.length;x++){
			tmp[x]=0;
		}
		for (var col = 0; col < 3; col++) {
			for (var row = 0; row < 3; row++) {
				var i =  col*3+row;
				var minors = new Float32Array(4);
				var minorCount = 0;
				for( var u = 0; u < 3; u++){
					if(u!=col){
						for( var v = 0; v < 3; v++){
							if(v!=row){
								minors[minorCount]= this.elements[u*3+v];
								minorCount= minorCount+1;
							}
						}
					}
				}
				tmp[i] = minors[0]*minors[3] - minors[1]*minors[2];
			}
		}
		for(x=0; x < tmp.length;x++){
			this.elements[x]= tmp[x];
		}

		//Compute co factors
		for(x=0; x < this.elements.length;x+=2){
			this.elements[x] = this.elements[x]*-1;
		}

		//Adjugate
		this.transpose();

		//Multiply by 1/Determinant
		for(x=0; x < this.elements.length;x++){
			this.elements[x] = this.elements[x]*invDet * -1;
		}
		return this;
	};

	// -------------------------------------------------------------------------
	this.log = function() {
		var e = this.elements;
		console.log('[ '+
					'\n ' + e[0]  + ', ' + e[1]  + ', ' + e[2]  +
			        '\n ' + e[4]  + ', ' + e[5]  + ', ' + e[6]  +
			        '\n ' + e[8]  + ', ' + e[9]  + ', ' + e[10] +
			        '\n ' + e[12] + ', ' + e[13] + ', ' + e[14] +
			        '\n]'
		);

		return this;
	};
};
