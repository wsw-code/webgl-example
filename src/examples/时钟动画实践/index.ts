  
import {initCanvas,initWebgl,initShader} from '../../utils'
import {mat4, vec2} from 'gl-matrix'
import IconImg from '../../images/close-icon.png'



let posArr:number[] = [];

let mapCache = new Map();

let modelView = mat4.create();

const indices = [
  0, 1, 2,
  2, 1, 3,
];

/**放大系数 */
const biggerFact = 2;

const secondIndices = [
  0, 1, 2,
  2, 1, 3,
  3, 1, 4
];

const indexBufferSource =  new Uint8Array(indices);
const secondIndexBufferSource =  new Uint8Array(secondIndices);



const r = 0.75
const r2 = 0.8
for (let index = 0; index < 360; index++) {
  const x = Number((r * Math.cos(index*Math.PI/180)).toFixed(3));
  const y =  Number((r * Math.sin(index*Math.PI/180)).toFixed(3));
  const _pos = [x,y];

  const x2 = Number((r2 * Math.cos(index*Math.PI/180)).toFixed(3));
  const y2 =  Number((r2 * Math.sin(index*Math.PI/180)).toFixed(3));
  const _pos2 = [x2,y2];


  posArr.push(..._pos);
  posArr.push(..._pos2);
}


posArr.push(...[r,0.0])
posArr.push(...[r2,0.0])

const circleFloatArray = new Float32Array(posArr);


/**圆环 */
function initCircle(webgl: WebGLRenderingContext,program:WebGLProgram) {




  mat4.identity(modelView);

  // 矩形形
  let pointPosition: Float32Array | null = circleFloatArray; 




  // getAttribLocation() 方法返回给定WebGLProgram对象中某属性的下标指向位置
  // 第一个参数为WebGLProgram，第二个参数为需要获取下标指向位置的GLSL变量名
  let aPosition = webgl.getAttribLocation(program, "a_position");
  webgl.bufferData(webgl.ARRAY_BUFFER,pointPosition,webgl.STATIC_DRAW);
  webgl.enableVertexAttribArray(aPosition);
  webgl.vertexAttribPointer(aPosition,2, webgl.FLOAT, false, 0, 0);
  let uniformMatrix = webgl.getUniformLocation(program, "proj");
  webgl.uniformMatrix4fv(uniformMatrix, false, modelView);
  let aColor = webgl.getUniformLocation(program, "u_FragColor") as WebGLUniformLocation
  webgl.uniform4fv(aColor,[0.0,0.0,0.0,1.0])
  webgl.drawArrays(webgl.TRIANGLE_STRIP,0,360*2+2);
  pointPosition = null;
}



  /**时针 */
  function initHoursBuffer(webgl: WebGLRenderingContext,program:WebGLProgram) {

    const date = new Date();
    const _hours = date.getHours()%12;
    const _minutes = date.getMinutes();
    const _per = _minutes/60;
     
    const radianPerSecond = 360/12*Math.PI/180;
    const _perRadain = _per<1?radianPerSecond*_per:0
    const h = 0.03;
    mat4.identity(modelView);
    mat4.rotateZ(modelView,modelView,Math.PI/2-(radianPerSecond*_hours+_perRadain))
    mat4.translate(modelView,modelView,[-h/2,-h/2,0]);

    // 矩形形
    let pointPosition: Float32Array | null = new Float32Array([
      0.0, 0.0, 0.0, 1.0,
      0.3, 0.005, 0.0, 1.0,
      0.0,0.03, 0.0, 1.0,
      0.3, 0.025, 0.0, 1.0,
    ]); 




    // getAttribLocation() 方法返回给定WebGLProgram对象中某属性的下标指向位置
    // 第一个参数为WebGLProgram，第二个参数为需要获取下标指向位置的GLSL变量名
    let aPosition = webgl.getAttribLocation(program, "a_position");

    // let positionBuffer =  webgl.createBuffer();
    // webgl.bindBuffer(webgl.ARRAY_BUFFER,positionBuffer);
    webgl.bufferData(webgl.ARRAY_BUFFER,pointPosition,webgl.STATIC_DRAW);
    webgl.enableVertexAttribArray(aPosition);
    webgl.vertexAttribPointer(aPosition,4, webgl.FLOAT, false, 0, 0);



    // let aColor = webgl.getAttribLocation(program, "outColor");

    let aColor = webgl.getUniformLocation(program, "u_FragColor") as WebGLUniformLocation
  
    webgl.uniform4fv(aColor,[0.0,0.0,0.0,0.7])
    webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, indexBufferSource, webgl.STATIC_DRAW);

    let uniformMatrix = webgl.getUniformLocation(program, "proj");
    webgl.uniformMatrix4fv(uniformMatrix, false, modelView);

    webgl.drawElements(webgl.TRIANGLES,6,webgl.UNSIGNED_BYTE,0);

    pointPosition = null
  }


  /**分针 */
  function initMinuteBuffer(webgl: WebGLRenderingContext,program:WebGLProgram) {

    const date = new Date();
    const _minutes = date.getMinutes();
    const _seconds = date.getSeconds();
    const radianPerMinutes = 360/60*Math.PI/180;
    const _per = _seconds/60;
    const _perRadain = _per<1?radianPerMinutes*_per:0

    const h = 0.03
    mat4.identity(modelView);
    mat4.rotateZ(modelView,modelView,Math.PI/2-(radianPerMinutes*_minutes+_perRadain))
    mat4.translate(modelView,modelView,[-h/2,-h/2,0]);

    // 矩形形
    let pointPosition: Float32Array | null  = new Float32Array([
      0.0, 0.0, 0.0, 1.0,
      0.5, 0.005, 0.0, 1.0,
      0.0,0.03, 0.0, 1.0,
      0.5, 0.025, 0.0, 1.0,
    ]); 

    // getAttribLocation() 方法返回给定WebGLProgram对象中某属性的下标指向位置
    // 第一个参数为WebGLProgram，第二个参数为需要获取下标指向位置的GLSL变量名
    let aPosition = webgl.getAttribLocation(program, "a_position");

    // let positionBuffer =  webgl.createBuffer();
    // webgl.bindBuffer(webgl.ARRAY_BUFFER,positionBuffer);
    webgl.bufferData(webgl.ARRAY_BUFFER,pointPosition,webgl.STATIC_DRAW);
    webgl.enableVertexAttribArray(aPosition);
    webgl.vertexAttribPointer(aPosition,4, webgl.FLOAT, false, 0, 0);



    // let aColor = webgl.getAttribLocation(program, "outColor");

    let aColor = webgl.getUniformLocation(program, "u_FragColor")!
  
    webgl.uniform4fv(aColor,[0.0,0.0,0.0,0.7])
    
    // const indexBuffer = webgl.createBuffer();
    // webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, indexBufferSource, webgl.STATIC_DRAW);

    let uniformMatrix = webgl.getUniformLocation(program, "proj");
    webgl.uniformMatrix4fv(uniformMatrix, false, modelView);

    webgl.drawElements(webgl.TRIANGLES,6,webgl.UNSIGNED_BYTE,0);

    pointPosition = null;
  }


  /**秒针 */
  function initSecondBuffer(webgl: WebGLRenderingContext,program:WebGLProgram) {

    let date = new Date();
    let _seconds = date.getSeconds();
    // let _seconds = 0;
    let radianPerSecond = 360/60*Math.PI/180;

    let w = 0.65;
    let w2 = 0.05;
    let h = 0.02

    mat4.identity(modelView);
    mat4.rotateZ(modelView,modelView,Math.PI/2-radianPerSecond*_seconds);
    mat4.translate(modelView,modelView,[-h/2,-h/2,0]);

    
    // 矩形形
    let pointPosition: Float32Array | null = new Float32Array([
      0.0, 0.0, 
      w, 0.0,
      0.0,h, 
      w, h, 
      w+w2, h/2,
    ]); 

    let aPosition = webgl.getAttribLocation(program, "a_position");
    // let positionBuffer =  webgl.createBuffer();
    // webgl.bindBuffer(webgl.ARRAY_BUFFER,positionBuffer);
    webgl.bufferData(webgl.ARRAY_BUFFER,pointPosition,webgl.STATIC_DRAW);
    webgl.enableVertexAttribArray(aPosition);
    webgl.vertexAttribPointer(aPosition,2, webgl.FLOAT, false, 0, 0);

    let aColor = webgl.getUniformLocation(program, "u_FragColor") as WebGLUniformLocation
    webgl.uniform4fv(aColor,[1.0,0.0,0.0,1.0])

    // const indexBuffer = webgl.createBuffer();
    // webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, secondIndexBufferSource, webgl.STATIC_DRAW);
    let uniformMatrix = webgl.getUniformLocation(program, "proj");
    webgl.uniformMatrix4fv(uniformMatrix, false, modelView);
    webgl.drawElements(webgl.TRIANGLES,9,webgl.UNSIGNED_BYTE,0);
    pointPosition = null;
  }

  /**刻度数字 */
  function initText(webgl: WebGLRenderingContext,program:WebGLProgram,img:HTMLImageElement | HTMLCanvasElement,index:number,texture:WebGLTexture) {

    

    function handleLoadedTexture(texture:WebGLTexture,image:TexImageSource ) {


      webgl.bindTexture(webgl.TEXTURE_2D, texture);
      webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, image);
      webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
      webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);
      // ，REPEAT 模式对纹理图片的尺寸有要求，宽度和高度必须为 2 的整数次幂，如 32x32 或 1024x256 的图片 
      // logo 图片为200 x 288 不符合，使用REPEAT会不展示图片
      webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE);
      webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.CLAMP_TO_EDGE);
      //因为异步原因所以要加在这里
      // webgl.uniform1i(WebGLUniformLocation, 0);
     
    }
    
    let uniformTexture1 = webgl.getUniformLocation(program, `texture1`)!;

    webgl.pixelStorei(webgl.UNPACK_FLIP_Y_WEBGL, true);

    handleLoadedTexture(texture,img);

    

    webgl.activeTexture(webgl.TEXTURE1);
    webgl.bindTexture(webgl.TEXTURE_2D, texture);
    webgl.uniform1i(uniformTexture1, 1);



    let w = 0.128/2;
 
    let h = w*2;

    const perRadain = 360/12*Math.PI/180;


    const curRadain = perRadain*(index+1);


    const _x = 0.6*Math.cos(Math.PI/2-curRadain);
    const _y = 0.6*Math.sin(Math.PI/2-curRadain);




    const wIndex = img.width/(img.height/2)

    w = wIndex*w


    let modelView = mat4.create();
    mat4.identity(modelView);

    mat4.translate(modelView,modelView,[_x-w/2,_y-h/2,0])


    // 矩形形
    let pointPosition = new Float32Array([
      0.0, 0.0, 0.0, 1.0,  0,0,
      w, 0.0, 0.0, 1.0,    1,0,
      0.0,h, 0.0, 1.0,     0,1, 
      w,h, 0.0, 1.0,       1,1
    ]); 



    
    // let positionBuffer =  webgl.createBuffer();
    // webgl.bindBuffer(webgl.ARRAY_BUFFER,positionBuffer);
    webgl.bufferData(webgl.ARRAY_BUFFER,pointPosition,webgl.STATIC_DRAW);


    // const indexBuffer = webgl.createBuffer();
    // webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, indexBufferSource, webgl.STATIC_DRAW);


    let uniformMatrix = webgl.getUniformLocation(program, "proj");
    webgl.uniformMatrix4fv(uniformMatrix, false, modelView);
    


    let aPosition = webgl.getAttribLocation(program, "a_position");
    webgl.enableVertexAttribArray(aPosition);
    webgl.vertexAttribPointer(aPosition,4, webgl.FLOAT, false, 6*4, 0);

    
    let outUV = webgl.getAttribLocation(program, "outUV");
    webgl.enableVertexAttribArray(outUV);
    webgl.vertexAttribPointer(outUV,2, webgl.FLOAT, false, 6*4, 4*4);

    let aColor = webgl.getUniformLocation(program, "u_FragColor") as WebGLUniformLocation
    webgl.uniform4fv(aColor,[0.0,0.0,0.0,0.0])


    let uniforFlag= webgl.getUniformLocation(program, "flag");

    webgl.uniform1i(uniforFlag, 1);

    webgl.drawElements(webgl.TRIANGLES,6,webgl.UNSIGNED_BYTE,0);


    webgl.uniform1i(uniforFlag, 0);
  }

  /**渲染刻度 */
  function initScale(webgl: WebGLRenderingContext,program:WebGLProgram) {
    let w = 0.04;
    let h = 0.02;

    // 矩形形
    let pointPosition: Float32Array | null  = new Float32Array([
      0.0, 0.0,
      w, 0.0,
      0.0,h, 
      w,h,
    ]); 
    let aPosition = webgl.getAttribLocation(program, "a_position");
    // let positionBuffer =  webgl.createBuffer();
    // webgl.bindBuffer(webgl.ARRAY_BUFFER,positionBuffer);
    webgl.bufferData(webgl.ARRAY_BUFFER,pointPosition,webgl.STATIC_DRAW);
    webgl.enableVertexAttribArray(aPosition);
    webgl.vertexAttribPointer(aPosition,2, webgl.FLOAT, false, 0, 0);
    let aColor = webgl.getUniformLocation(program, "u_FragColor")!
    webgl.uniform4fv(aColor,[0.0,0.0,0.0,1.0])
    let uniformMatrix = webgl.getUniformLocation(program, "proj");
    for (let index = 0; index < 60; index++) {
      const perRadain = index*360/60*Math.PI/180;
      const isLarge = index%5 === 0;
      mat4.identity(modelView);
      mat4.rotateZ(modelView,modelView,Math.PI/2-perRadain);
      
      if(isLarge) {
        mat4.translate(modelView,modelView,[r-biggerFact*w/2,-h*biggerFact/2,0]);
        mat4.scale(modelView,modelView,[biggerFact,biggerFact,1])
      } else {
        mat4.translate(modelView,modelView,[r-w/2,-h/2,0]);
      }
      webgl.uniformMatrix4fv(uniformMatrix, false, modelView);
      webgl.drawArrays(webgl.TRIANGLE_STRIP,0,4);
    }

    pointPosition = null;

  }

 
  /**
   * GLSL代码
   * 声明一个顶点着色器
   * vec4：四维向量 ，具有xyzw四个分量，分量是浮点数
   * mat4: 4*4矩阵
   * **/
  const vertexString = `
    attribute vec4 a_position;
    uniform mat4 proj;
    attribute vec2 outUV;
    varying vec2 inUV;
    void main(){
        inUV = outUV;
        gl_Position = proj * a_position;
        gl_PointSize = 10.0;
    }
    `;
  const fragmentString = `
    precision mediump float;
    uniform sampler2D texture1;
    varying vec2 inUV;
    uniform vec4 u_FragColor;
    uniform int flag;
    void main(){
      if(flag == 1) {
        vec4 color1 = texture2D(texture1,inUV);
        gl_FragColor =   color1 + u_FragColor;
      } else {
        gl_FragColor = u_FragColor;
      }

    }
    `; // 片元着色器

  
 function render(img:HTMLImageElement[] | HTMLCanvasElement[]) {
  const canvas_element = initCanvas();
  const webgl = initWebgl(canvas_element);
  const program = initShader(webgl,vertexString,fragmentString)!;

  let positionBuffer =  webgl.createBuffer();
  webgl.bindBuffer(webgl.ARRAY_BUFFER,positionBuffer);


  const indexBuffer = webgl.createBuffer();
  webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, indexBuffer);


  let texture1 = webgl.createTexture()!;

  function draw() {

    webgl.clearColor(1.0, 1.0, 1.0, 1.0);
    // clear() 方法使用预设值来清空缓冲。预设值可以使用 clearColor() 、 clearDepth() 或 clearStencil() 设置。裁剪、抖动处理和缓冲写入遮罩会影响 clear() 方法。参数为一个用于指定需要清除的缓冲区的 GLbitfield (en-US) 。可能的值有：gl.COLOR_BUFFER_BIT(颜色缓冲区)；gl.DEPTH_BUFFER_BIT (深度缓冲区)       gl.STENCIL_BUFFER_BIT(模板缓冲区)  没有返回值
    webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT | webgl.STENCIL_BUFFER_BIT);
    // webgl.enable(webgl.DEPTH_TEST);
    webgl.enable(webgl.BLEND);
    webgl.blendFunc(webgl.SRC_ALPHA , webgl.ONE_MINUS_SRC_ALPHA);

    initCircle(webgl,program);
    initSecondBuffer(webgl,program);
    initMinuteBuffer(webgl,program);
    initHoursBuffer(webgl,program);
    initScale(webgl,program);

    for (let index = 0; index < img.length; index++) {
      const element = img[index];
      initText(webgl,program,element,index,texture1)
    }
    
  }

  function tick() {
    requestAnimationFrame(tick);
    draw()
  }

  tick();

}




export default function () {
  const numTexture  = Array.from({length:12}).map((_,index)=>index+1).map(el=>renderText(el))
  render(numTexture)

}

function renderText(num:number) {
  const text = num+''
  const size = 32;
  const accuracy = 1;
  const canvas = document.createElement("canvas");
  // canvas.width = size/2*text.length*accuracy;
  
  canvas.style.border = "1px solid #ddd"
	const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = "#000"; 	// This determines the text colour, it can take a hex value or rgba value (e.g. rgba(255,0,0,0.5))
  /**为了测量正确宽度 */
  ctx.font = `${size*accuracy}px monospace`
  const _w = ctx.measureText(text).width;

  canvas.width = _w*accuracy;
  canvas.height = size*accuracy;
  ctx.textAlign = "center";	// This determines the alignment of text, e.g. left, center, right
  ctx.textBaseline = "middle";	// This determines the baseline of the text, e.g. top, middle, bottom
  /**定义字体大小 */
  ctx.font = `${size*accuracy}px monospace`
  console.log(canvas.width/2, canvas.height/2)

  ctx.fillText(text, canvas.width/2, canvas.height/2);
  return canvas
}

