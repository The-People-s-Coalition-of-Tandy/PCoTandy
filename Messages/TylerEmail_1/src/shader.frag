// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default. It means "medium precision"
precision mediump float;
varying vec4 v_color;
varying vec2 v_UVs;


uniform float u_time;

// constants
#define PI 3.1415925359
#define TWO_PI 6.2831852
#define NUMBER_OF_STEPS 200
#define MAX_DIST 100. 
#define SURFACE_DIST 1. //EPSILON

#define SKY_COLOR vec3(0.3, 0.1, 0.1)


///////////////////////
// Primitives
///////////////////////
 
// Round Box - exact
float roundBoxSDF( vec3 p, vec3 b, float r ) {
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0) - r;
}
 
// Triangular Prism - exact
float triPrismSDF( vec3 p, vec2 h ) {
    const float k = sqrt(3.0);
    h.x *= 0.5*k;
    p.xy /= h.x;
    p.x = abs(p.x) - 1.0;
    p.y = p.y + 1.0/k;
    if( p.x+k*p.y>0.0 ) p.xy=vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
    p.x -= clamp( p.x, -2.0, 0.0 );
    float d1 = length(p.xy)*sign(-p.y)*h.x;
    float d2 = abs(p.z)-h.y;
    return length(max(vec2(d1,d2),0.0)) + min(max(d1,d2), 0.);
}
 
// Rounded Cylinder - exact
float roundedCylinderSDF( vec3 p, float ra, float rb, float h ) {
  vec2 d = vec2( length(p.xz)-2.0*ra+rb, abs(p.y) - h );
  return min(max(d.x,d.y),0.0) + length(max(d,0.0)) - rb;
}
 
///////////////////////
// Boolean Operators
///////////////////////
  
float intersectSDF(float distA, float distB) {
    return max(distA, distB);
}
  
float unionSDF(float distA, float distB) {
    return min(distA, distB);
}
  
float differenceSDF(float distA, float distB) {
    return max(distA, -distB);
}
 
/////////////////////////////
// Smooth blending operators
/////////////////////////////
 
float smoothIntersectSDF(float distA, float distB, float k ) {
  float h = clamp(0.5 - 0.5*(distA-distB)/k, 0., 1.);
  return mix(distA, distB, h ) + k*h*(1.-h); 
}
 
float smoothUnionSDF(float distA, float distB, float k ) {
  float h = clamp(0.5 + 0.5*(distA-distB)/k, 0., 1.);
  return mix(distA, distB, h) - k*h*(1.-h); 
}
 
float smoothDifferenceSDF(float distA, float distB, float k) {
  float h = clamp(0.5 - 0.5*(distA+distB)/k, 0., 1.);
  return mix(distA, -distB, h ) + k*h*(1.-h); 
}
/////////////////////////

// params:
// p: arbitrary point in 3D space
// c: the center of our sphere
// r: the radius of our sphere
float sdfSphere(in vec3 p, in vec3 c, float r) {
  return length(p - c) - r;
}

float worldMap(in vec3 p) {
  float displacement = sin(5.0 * p.x) * sin(5.0 * p.y) * sin(5.0 * p.z) * 0.25;
  float sphere_0 = sdfSphere(p, vec3(sin(u_time), cos(u_time), 0.), 1.0);
  float sphere_1 = sdfSphere(p, vec3(cos(u_time),0.,0.), 1.);
  float sun = sdfSphere(p, vec3(5.,5.,2.), 1.);

  float floor = p.y +1.;


  float SCENE_SDF = smoothUnionSDF(sphere_0, sphere_1, .51);
  SCENE_SDF = smoothUnionSDF(SCENE_SDF, floor,1.);
  SCENE_SDF = unionSDF(SCENE_SDF,sun);
  return SCENE_SDF;
}

vec3 calculate_normal(in vec3 p) {
  const vec3 small_step = vec3(0.001, 0.0, 0.0);

  float gradient_x = worldMap(p + small_step.xyy) - worldMap(p - small_step.xyy);
  float gradient_y = worldMap(p + small_step.yxy) - worldMap(p - small_step.yxy);
  float gradient_z = worldMap(p + small_step.yyx) - worldMap(p - small_step.yyx);

  vec3 normal = vec3(gradient_x, gradient_y, gradient_z);

  return normalize(normal);
}

// tetrahedron technique (more efficient, only 4)
vec3 calcNormal( in vec3 p ) // for function f(p)
{
    const float h = 0.0001; // replace by an appropriate value
    const vec2 k = vec2(1,-1);
    return normalize( k.xyy*worldMap( p + k.xyy*h ) + 
                      k.yyx*worldMap( p + k.yyx*h ) + 
                      k.yxy*worldMap( p + k.yxy*h ) + 
                      k.xxx*worldMap( p + k.xxx*h ) );
}


vec3 phong(vec3 lightDir, vec3 normal, vec3 rd) {
  // ambient
  float k_a = 0.6;
  vec3 i_a = vec3(0.1216, 0.051, 0.255);
  vec3 ambient = k_a * i_a;

  // diffuse
  float k_d = 01.5;
  float dotLN = clamp(dot(lightDir, normal), 0., 1.);
  vec3 i_d = vec3(0.107, 0.815, 0.6);
  vec3 diffuse = k_d * dotLN * i_d;

  // specular
  float k_s = 0.6;
  float dotRV = clamp(dot(reflect(lightDir, normal), -rd), 0., 1.);
  vec3 i_s = vec3(1, 1, 1);
  float alpha = 10.;
  vec3 specular = k_s * pow(dotRV, alpha) * i_s;

  return ambient + diffuse + specular;
}

//THIS IS THE RENDER CALL
vec3 ray_march(in vec3 ray_origin, in vec3 ray_direction) {
  float total_distance_traveled = 0.0;
  // const int NUMBER_OF_STEPS = 32;
  const float MINIMUM_HIT_DISTANCE = 0.01;
  const float MAXIMUM_TRACE_DISTANCE = 100.0;

  for(int i = 0; i < NUMBER_OF_STEPS; ++i) {

        // Calculate our current position along the ray
    vec3 current_position = ray_origin + total_distance_traveled * ray_direction;

        // We wrote this function earlier in the tutorial -
        // assume that the sphere is centered at the origin
        // and has unit radius
    float distance_to_closest = worldMap(current_position);

    if(distance_to_closest < MINIMUM_HIT_DISTANCE) // hit
    {
      vec3 normal = calcNormal(current_position);

          // For now, hard-code the light's position in our scene
      vec3 light1_position = vec3(100., cos(u_time)*10., -3.0);
          // Calculate the unit direction vector that points from
          // the point of intersection to the light source
      vec3 direction_to_light1 = normalize(current_position - light1_position);
      float light1_diffuse_intensity = max(0.0, dot(normal, direction_to_light1));
      vec3 light1_color = vec3(1.0, 1.,01.);
      vec3 light1 = light1_color * light1_diffuse_intensity;


          // For now, hard-code the light's position in our scene
      vec3 light2_position = vec3(-100., -100., 30.0);
          // Calculate the unit direction vector that points from
          // the point of intersection to the light source
      vec3 direction_to_light2 = normalize(current_position - light2_position);
      float light2_diffuse_intensity = max(0.0, dot(normal, direction_to_light2));
      vec3 light2_color = vec3(0.2, 0.4,1.);
      vec3 light2 = light2_color * light2_diffuse_intensity;

        // We hit something! Return red for now
      vec3 diffuse = (light1 + light2) / 2.;


//////PHONG START
      // light #1
      vec3 lightPosition1 = vec3(-8., -6., -5.);
      vec3 lightDirection1 = normalize(lightPosition1 - current_position);
      float lightIntensity1 = 0.6;
      
      // light #2
      vec3 lightPosition2 = vec3(1., 1., 1.);
      vec3 lightDirection2 = normalize(lightPosition2 - current_position);
      float lightIntensity2 = 0.7;

      // final sphere color
      vec3 diffusePhong = lightIntensity1 * phong(lightDirection1, normal, ray_direction);
      diffusePhong += lightIntensity2 * phong(lightDirection2, normal , ray_direction);
  
      // return diffuse;
      return diffusePhong;
    }

    if(total_distance_traveled > MAXIMUM_TRACE_DISTANCE) // miss
    {
      break;
    }

        // accumulate the distance traveled thus far
    total_distance_traveled += distance_to_closest;
  }

    // If we get here, we didn't hit anything so just
    // return a background color (black)
  return SKY_COLOR;
}

void main() {
    // gl_FragColor is a special variable a fragment shader
    // is responsible for setting
  vec2 st = v_UVs;

      // Remap the space to -1. to 1.
  vec2 uv = st * 2. - 1.;

  vec3 camera_position = vec3(0.0, 0.0, -5.0);
  vec3 ro = camera_position;
  vec3 rd = vec3(uv, 1.0);

  vec3 color = ray_march(ro, rd);
  //RGB to sRGB gamma correction <3
  color = pow(color, vec3(1.0/2.2));

    // Visualize the distance field
  gl_FragColor = vec4(color, 1.);
}