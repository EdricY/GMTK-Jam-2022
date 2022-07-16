import * as twgl from "twgl.js"
import { imgs } from "./load";

const faceCoords = [
  { x: 0, y: Math.PI / -2 },
  { x: 0, y: Math.PI / 2 },
  { x: Math.PI / 2, y: 0 },
  { x: Math.PI / -2, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: Math.PI },
];

let diceGls = [];
for (let i = 0; i < 16; i++) {
  diceGls.push(document.createElement("canvas").getContext("webgl"))
  if (!diceGls[0].drawingBufferHeight) {
    diceGls.shift();
    break;
  }
}
console.log("webgl renderers:", diceGls.length)

diceGls.forEach(x => {
  x.canvas.height = 100;
  x.canvas.width = 100;
  document.body.appendChild(x.canvas);
  x.canvas.classList.add("gone");
})

if (!diceGls[0]) {
  console.error("no webgl :(");
}
let lastDrawns = diceGls.map(c => null);
let canvasCounter = 0;

export class DiceRender {
  constructor(faces, colors) {
    this.face = "";
    this.color = "";
    this.faceIdx = 0;
    this.faces = faces;
    this.colors = colors;
    this.done = true; //externally controlled
    this.canvasCount = (canvasCounter++) % diceGls.length;
    this.bufferCtx = document.createElement("canvas").getContext("2d");
    this.bufferCtx.canvas.width = 100;
    this.bufferCtx.canvas.height = 100;

    this.gl = diceGls[this.canvasCount];
    this.canvas = this.gl.canvas;


    // setup GLSL program
    this.program = twgl.createProgramFromScripts(this.gl, ["vertex-shader-3d", "fragment-shader-3d"]);

    // look up where the vertex data needs to go.
    this.positionLocation = this.gl.getAttribLocation(this.program, "a_position");

    // lookup uniforms
    this.matrixLocation = this.gl.getUniformLocation(this.program, "u_matrix");
    this.textureLocation = this.gl.getUniformLocation(this.program, "u_texture");

    // Create a buffer for positions
    this.positionBuffer = this.gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    // Put the positions in the buffer
    setGeometry(this.gl);

    // Create a texture.
    var texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, texture);



    this.mapFaces(faces, colors)

    this.fieldOfViewRadians = degToRad(1);
    this.rotX = degToRad(0);
    this.rotY = degToRad(0);

    this.rotXTarget = Math.PI / 4 + Math.PI / 2 * Math.floor((Math.random() * 3));
    this.rotYTarget = Math.PI / 4 + Math.PI / 2 * Math.floor((Math.random() * 3));
    this.rotXVel = .001;
    this.rotYVel = .001;
    this.rollStopTime = 0
    // Get the starting time.
  }

  mapFaces(faces, colors) {
    this.faces = faces;
    this.colors = colors;
    const ctx = document.createElement("canvas").getContext("2d");

    ctx.canvas.width = 128;
    ctx.canvas.height = 128;
    const faceInfos = [
      { target: this.gl.TEXTURE_CUBE_MAP_POSITIVE_X, faceColor: colors[0], textColor: '#222', text: faces[0] },
      { target: this.gl.TEXTURE_CUBE_MAP_NEGATIVE_X, faceColor: colors[1], textColor: '#222', text: faces[1] },
      { target: this.gl.TEXTURE_CUBE_MAP_POSITIVE_Y, faceColor: colors[2], textColor: '#222', text: faces[2] },
      { target: this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, faceColor: colors[3], textColor: '#222', text: faces[3] },
      { target: this.gl.TEXTURE_CUBE_MAP_POSITIVE_Z, faceColor: colors[4], textColor: '#222', text: faces[4] },
      { target: this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, faceColor: colors[5], textColor: '#222', text: faces[5] },
    ];
    faceInfos.forEach((faceInfo) => {
      const { target, faceColor, textColor, text } = faceInfo;
      generateFace(ctx, faceColor, textColor, text);

      // Upload the canvas to the cubemap face.
      const level = 0;
      const internalFormat = this.gl.RGBA;
      const format = this.gl.RGBA;
      const type = this.gl.UNSIGNED_BYTE;
      this.gl.texImage2D(target, level, internalFormat, format, type, ctx.canvas);
    });
    this.gl.generateMipmap(this.gl.TEXTURE_CUBE_MAP);
    this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);

  }

  draw(ctx, x, y) {
    if (this.isDoneRolling(Date.now())) {
      ctx.drawImage(this.bufferCtx.canvas, x - 50, y - 50, 100, 100);
      return;
    }
    if (lastDrawns[this.canvasCount] !== this) {
      this.mapFaces(this.faces, this.colors);
    }
    this.drawScene();
    this.bufferCtx.clearRect(0, 0, 100, 100);
    this.bufferCtx.drawImage(this.gl.canvas, 0, 0);
    ctx.drawImage(this.bufferCtx.canvas, x - 50, y - 50, 100, 100);
    lastDrawns[this.canvasCount] = this;
  }

  drawScene() {
    let { program, positionLocation, matrixLocation, textureLocation } = this;
    // convert to seconds
    let time = performance.now()
    time *= 0.001;
    // Subtract the previous time from the current time
    var deltaTime = time - this.then;
    // Remember the current time for the next frame.
    this.then = time;

    // Tell WebGL how to convert from clip space to pixels
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    this.gl.enable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.DEPTH_TEST);
    // Clear the canvas AND the depth buffer.
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    this.gl.useProgram(program);

    // Turn on the position attribute
    this.gl.enableVertexAttribArray(positionLocation);

    // Bind the position buffer.
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 3;          // 3 components per iteration
    var type = this.gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    this.gl.vertexAttribPointer(
      positionLocation, size, type, normalize, stride, offset);

    // Compute the projection matrix
    var aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    var projectionMatrix =
      twgl.m4.perspective(this.fieldOfViewRadians, aspect, 1, 2000);

    var cameraPosition = [0, 0, 200];
    var up = [0, 1, 0];
    var target = [0, 0, 0];

    // Compute the camera's matrix using look at.
    var cameraMatrix = twgl.m4.lookAt(cameraPosition, target, up);

    // Make a view matrix from the camera matrix.
    var viewMatrix = twgl.m4.inverse(cameraMatrix);

    var viewProjectionMatrix = twgl.m4.multiply(projectionMatrix, viewMatrix);

    this.rotX = Math.max(this.rollStopTime - Date.now(), 0) * this.rotXVel + this.rotXTarget;
    this.rotY = Math.max(this.rollStopTime - Date.now(), 0) * this.rotYVel + this.rotYTarget;
    var matrix = viewProjectionMatrix;
    matrix = twgl.m4.rotateY(matrix, this.rotY);
    matrix = twgl.m4.rotateX(matrix, this.rotX);

    // Set the matrix.
    this.gl.uniformMatrix4fv(matrixLocation, false, matrix);

    // Tell the shader to use texture unit 0 for u_texture
    this.gl.uniform1i(textureLocation, 0);

    // Draw the geometry.
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6 * 6);

  }

  roll(targetIdx, duration, force) {
    this.rotXTarget = faceCoords[targetIdx].x + Math.random() * .5 - .25
    this.rotYTarget = faceCoords[targetIdx].y + Math.random() * .5 - .25
    this.rollStopTime = Date.now() + duration;

    this.rotXVel = Math.random() * force + force;
    this.rotYVel = -.02;
    // Math.random() * -.01 - .01;
  }

  isDoneRolling(now = Date.now()) {
    const timePad = 200;
    return now >= this.rollStopTime + timePad;
  }

  shouldBeResolved(now = Date.now()) {
    const timePad = 200;
    return now >= this.rollStopTime - timePad;
  }
}

function radToDeg(r) {
  return r * 180 / Math.PI;
}

function degToRad(d) {
  return d * Math.PI / 180;
}

function generateFace(ctx, faceColor, textColor, text) {
  let backImg = imgs[faceColor];
  const { width, height } = ctx.canvas;
  if (backImg) {
    ctx.drawImage(backImg, 0, 0, width, height);
  } else {
    ctx.fillStyle = faceColor;
    ctx.fillRect(0, 0, width, height);

  }

  let img = imgs[text];
  if (img) {
    ctx.drawImage(img, 0, 0, width, height);
  } else {
    ctx.font = `${width * 0.7}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = textColor;
    ctx.fillText(text, width / 2, height / 2);
  }

}

// Fill the buffer with the values that define a cube.
function setGeometry(gl) {
  var positions = new Float32Array(
    [
      -1, -1, -1,
      -1, 1, -1,
      1, -1, -1,
      -1, 1, -1,
      1, 1, -1,
      1, -1, -1,

      -1, -1, 1,
      1, -1, 1,
      -1, 1, 1,
      -1, 1, 1,
      1, -1, 1,
      1, 1, 1,

      -1, 1, -1,
      -1, 1, 1,
      1, 1, -1,
      -1, 1, 1,
      1, 1, 1,
      1, 1, -1,

      -1, -1, -1,
      1, -1, -1,
      -1, -1, 1,
      -1, -1, 1,
      1, -1, -1,
      1, -1, 1,

      -1, -1, -1,
      -1, -1, 1,
      -1, 1, -1,
      -1, -1, 1,
      -1, 1, 1,
      -1, 1, -1,

      1, -1, -1,
      1, 1, -1,
      1, -1, 1,
      1, -1, 1,
      1, 1, -1,
      1, 1, 1,

    ]);
  gl.bufferData(gl.ARRAY_BUFFER, positions.map(x => x * 1), gl.STATIC_DRAW);
}
