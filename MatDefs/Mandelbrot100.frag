// Created by inigo quilez - iq/2013
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.


// This shader computes the distance to the Mandelbrot Set for everypixel, and colorizes
// it accoringly.
// 
// Z -> ZÂ²+c, Z0 = 0. 
// therefore Z' -> 2Â·ZÂ·Z' + 1
//
// The Hubbard-Douady potential G(c) is G(c) = log Z/2^n
// G'(c) = Z'/Z/2^n
//
// So the distance is |G(c)|/|G'(c)| = |Z|Â·log|Z|/|Z'|
//
// More info here: https://iquilezles.org/articles/distancefractals

// contribution by Jason Wilkins - Tup/2016 - Generalized Mandelbrot and distance function


vec2 cpow(vec2 c, float exponent){
    if (abs(c.x) < 1e-5 && abs(c.y) < 1e-5) {
        return vec2(0,0);
    } else {
        float cAbs = length(c);
        vec2  cLog = vec2(log(cAbs), atan(c.y,c.x));
        vec2  cMul = exponent*cLog;
        float expReal = exp(cMul.x);
        return vec2(expReal*cos(cMul.y), expReal*sin(cMul.y));
    }
}

void main(){
    vec2 resolution = vec2(1.0, 1.0);
    vec2 p = (1.0*coord) - vec2(0.5, 0.5);

    // animation	
    float n = 4.0 - 2.0*cos(0.225*time);
    float zoo = 3.25;
    vec2 c = vec2(.005,.01) + p*zoo;

    // iterate
    vec2 z  = vec2(0.0);
    float m2 = 0.0;
    vec2 dz = vec2(0.0);
    for( int i=0; i<256; i++ ){
        if( m2>1024.0 ) break;
        
		// Z' -> nÂ·Z^(n-1)Â·Z' + 1
        vec2 chain = n*cpow(z,n-1.0);
        dz = mat2(chain,-chain.y,chain.x) * dz + vec2(1,0);
        // Z -> Z^n + c			
        z = cpow(z, n) + c;
			
        m2 = dot(z,z);
    }

    // distance	
	// d(c) = |Z|Â·log|Z|/|Z'|
    float d = 0.5*sqrt(m2/dot(dz,dz))*log(m2);

	
    // do some soft coloring based on distance
    d = clamp( 8.0*d/zoo, 0.0, 1.0 );
    d = pow( d, 0.25 );
    inside = d;
}