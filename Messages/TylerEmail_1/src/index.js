var canvas = document.querySelector("#hello");
var gl = canvas.getContext("webgl");
let program;
// num.toFixed() creates string with decimals
let sdfObjects = [{
  sdf: "sdSphere",
  position: [0.,0.,0.],
  radius: 1.0
}]

let rotate = false;

function fragTemplate(objects) {
  return`
  `
  
} 
let meltiness = 0.5;

function writeFragString(sdfObjects){
  let objString = "";
  let renderString=""
  sdfObjects.forEach((obj, i) => {
    
    objString += `
    float ${obj.sdf}${i} = ${obj.sdf}(p * rotation, vec3(${obj.position[0].toFixed(4)}, ${obj.position[1].toFixed(4)}, ${obj.position[2].toFixed(4)}), ${obj.radius.toFixed(4)});
    `;

    if (renderString != "") {
      renderString = `opSmoothUnion(${obj.sdf}${i}, ${renderString}, ${meltiness})`
    } else {
      renderString += `${obj.sdf}${i}`
    }
  })

  return `${objString}
  return ${renderString};`
}

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}



function createProgram(gl, vertexShader, fragmentShader) {
    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

async function createProgramFromFiles(filenames) {
    var vertexShaderSource = await fetch(filenames[0]).then(r => r.text());
    var fragmentShaderSource = await fetch(filenames[1]).then(r => r.text());
    // var fragmentShaderSource = fragTemplate(sdfObjects);

    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    var program = createProgram(gl, vertexShader, fragmentShader);

    return program;
}

function randomInt(range) {
    return Math.floor(Math.random() * range);
}

async function main() {

    var program = await createProgramFromFiles(['shader.vert', 'shader.frag']);

    // look up where the vertex data needs to go.
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    var colorAttributeLocation = gl.getAttribLocation(program, "a_color");

    // look up uniform locations
    var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    var timeUniformLocation = gl.getUniformLocation(program, "u_time");
    var rotateUniformLocation = gl.getUniformLocation(program, "u_rotate");

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform1f(timeUniformLocation, performance.now());
    gl.uniform1f(rotateUniformLocation, 0.0);

    gl.enableVertexAttribArray(positionAttributeLocation);

    var positionBuffer = gl.createBuffer();
    let positions = [];

    // Bind the position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2; // 2 components per iteration
    var type = gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset)


    positions = [
        0., 0.,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 0.0,
        0.0, 1.0,
        1.0, 1.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    
    size = 4;
    type = gl.UNSIGNED_BYTE;
    normalize = true;
    stride = 0;
    offset = 0;
    gl.vertexAttribPointer(
        colorAttributeLocation, size, type, normalize, stride, offset
        );
        
        let colors = new Uint8Array([
            255, 255, 0, 255,
            255, 0, 255, 255,
            0, 255, 255, 255,
            255, 255, 0, 255,
            255, 0, 255, 255,
            0, 255, 255, 255,
        ])
        
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(colorAttributeLocation);
        
        
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);

    function renderLoop(timeStamp) { 

      // set time uniform
      gl.uniform1f(timeUniformLocation, timeStamp/1000.0);
      gl.drawArrays(primitiveType, offset, count);
      // recursive invocation
      window.requestAnimationFrame(renderLoop);
    }
    
    // start the loop
    window.requestAnimationFrame(renderLoop);
}

document.addEventListener("DOMContentLoaded", main)

canvas.addEventListener("click", (e) => {
  let normMouseX = (e.clientX / canvas.width) * 4. - 2.;
  let normMouseY = ((canvas.height - e.clientY) / canvas.height) * 4. - 2.;
  
  sdfObjects.push({
    sdf: "sdSphere",
    position: [normMouseX, normMouseY, 0.],
    radius: 1.0
  }) 

  console.log(sdfObjects);
  console.log(e.clientX, e.clientY);
// window.cancelAnimationFrame();

  main();
})

document.addEventListener("keydown", (e) => {
  console.log(e.key);
    if (e.key === "r") {
      console.log("ghello");
      rotate = !rotate;
      let rotateUniformLocation = gl.getUniformLocation(program, "u_rotate");
      gl.uniform1f(rotateUniformLocation, rotate ? 1.0 : 0.0);
    }
})