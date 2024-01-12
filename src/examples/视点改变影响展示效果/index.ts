  
import {initCanvas,initWebgl,initShader} from '../../utils'
import {mat4} from 'gl-matrix'







  /**
   * GLSL代码
   * 声明一个顶点着色器
   * vec4：四维向量 ，具有xyzw四个分量，分量是浮点数
   * mat4: 4*4矩阵
   * **/
  const vertexString = `
    attribute vec4 a_position;
    uniform mat4 proj;
    attribute vec4 a_color;
    varying vec4 color;
    void main(){
        gl_Position =proj * a_position;
        color = a_color;
    }
    `;
  const fragmentString = `
    precision mediump float;
    varying vec4 color;
    void main(){
        gl_FragColor = color;
    }
    `; // 片元着色器

  
export default function() {
  const canvas_element = initCanvas();
  const webgl = initWebgl(canvas_element);
  const program = initShader(webgl,vertexString,fragmentString);

  let viewX = 0;

  let viewY = 0;


  function initBuffer() {
    if(!program) {
      return 
    }

    const temp = -50.0

    const temp2 = -50.0

    //Float32Array 类型数组代表的是平JS内置的标准对象，为 32 位的浮点数型数组，其内容初始化为 0。一旦建立起来，你可以使用这个对象的方法对其元素进行操作，或者使用标准数组索引语法 (使用方括号)。https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Float32Array
    let pointPosition = new Float32Array([
      /**绿色三角形 前 */
      -100.0, -100.0, temp,  1.0,   0.4,1.0,0.4,1.0,
      100.0,  -100.0, temp,  1.0,   0.4,1.0,0.4,1.0,
      0.0,    20.0,   temp,  1.0,   0.4,1.0,0.4,1.0,


      /**黄色三角形 后 */
      -100.0,  0.0,    temp2,  1.0,   1.0,1.0,0.4,1.0,
      0.0,     -120.0, temp2,  1.0,   1.0,1.0,0.4,1.0,
      100.0,   0.0,    temp2,  1.0,   1.0,1.0,0.4,1.0

    ]);
  
  /**投影矩阵 */
  const ProjMatrix = mat4.create(); // 初始化一个4*4的矩阵

    mat4.ortho(
      ProjMatrix,
      -250,
      250,
      -250,
      250,
      0.0,
      250.0
    )

    /**视图矩阵 */
    const ViewMatrix = mat4.create();
    mat4.identity(ViewMatrix);
    mat4.lookAt(ViewMatrix,[viewX,viewY,1.0],[0,0,-1],[0,1,0]);

    /**模型矩阵 */
    const ModelMatrix = mat4.create();
    mat4.identity(ModelMatrix);


    /**mvp矩阵 */
    let mvMatrix = mat4.create();
    mat4.identity(mvMatrix);
    mat4.multiply(mvMatrix,ViewMatrix,ModelMatrix);


    let mvpMatrix = mat4.create();
    mat4.identity(mvpMatrix);


    mat4.multiply(mvpMatrix,ProjMatrix,mvMatrix)


    // getAttribLocation() 方法返回给定WebGLProgram对象中某属性的下标指向位置
    // 第一个参数为WebGLProgram，第二个参数为需要获取下标指向位置的GLSL变量名
    let aPosition = webgl.getAttribLocation(program, "a_position");


    let triangleBuffer = webgl.createBuffer();
    webgl.bindBuffer(webgl.ARRAY_BUFFER, triangleBuffer);
    webgl.bufferData(webgl.ARRAY_BUFFER, pointPosition, webgl.STATIC_DRAW);
    webgl.enableVertexAttribArray(aPosition);
    webgl.vertexAttribPointer(aPosition, 4, webgl.FLOAT, false, 8 * 4, 0);




    let aColor = webgl.getAttribLocation(program, "a_color");
    webgl.enableVertexAttribArray(aColor);
    webgl.vertexAttribPointer(aColor, 4, webgl.FLOAT, false, 8 * 4, 4*4);



    let uniforproj = webgl.getUniformLocation(program, "proj");
    webgl.uniformMatrix4fv(uniforproj, false, mvpMatrix);
  }

  function draw() {
        // clearColor ()方法指定在清除颜色缓冲区时使用的颜色值。接收的4个参数分别表示 r,g,b,a。取值均在0和1之间。
        webgl.clearColor(1.0, 1.0, 1.0, 1.0);
        // clear() 方法使用预设值来清空缓冲。预设值可以使用 clearColor() 、 clearDepth() 或 clearStencil() 设置。裁剪、抖动处理和缓冲写入遮罩会影响 clear() 方法。参数为一个用于指定需要清除的缓冲区的 GLbitfield (en-US) 。可能的值有：gl.COLOR_BUFFER_BIT(颜色缓冲区)；gl.DEPTH_BUFFER_BIT (深度缓冲区)       gl.STENCIL_BUFFER_BIT(模板缓冲区)  没有返回值
        webgl.clear(webgl.COLOR_BUFFER_BIT);
        // webgl.enable(webgl.DEPTH_TEST);

        // drawArrays() 方法用于从向量数组中绘制图元。接收3个参数
        // 第一个参数为指定绘制图元的方式，可能值如下：
        // gl.POINTS: 绘制一系列点。
        // gl.LINE_STRIP: 绘制一个线条。即，绘制一系列线段，上一点连接下一点。
        // gl.LINE_LOOP: 绘制一个线圈。即，绘制一系列线段，上一点连接下一点，并且最后一点与第一个点相连。
        // gl.LINES: 绘制一系列单独线段。每两个点作为端点，线段之间不连接。
        // gl.TRIANGLE_STRIP：绘制一个三角带。
        // gl.TRIANGLE_FAN：绘制一个三角扇。
        // gl.TRIANGLES: 绘制一系列三角形。每三个点作为顶点。
        // 第二个参数为指定从哪个点开始绘制。
        // 第三个参数为指定绘制需要使用到多少个点。
        webgl.drawArrays(webgl.TRIANGLES, 0, 6);
  }

  

  document.addEventListener('keyup',function(e) {

    console.log(e.key)
    switch (e.key) {
      case 'ArrowUp':
        viewY+=1;
        break;
      case 'ArrowDown':
        viewY-=1;
        break;
      case 'ArrowRight':
        viewX+=1;
        break;
      case 'ArrowLeft':
        viewX-=1;
        break;

      default:
        break;
    }

    
    initBuffer();
    draw();
  })


  initBuffer();
  draw();
}