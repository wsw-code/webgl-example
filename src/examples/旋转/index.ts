  
import {initCanvas,initWebgl,initShader} from '../../utils'
import {mat4} from 'gl-matrix'




// const myOrtho = function (a:any, b, c, d, e, f, g) {
//   if (!g) {
//       g = mat4.create()
//   }
//   var h = b - a;
//   var i = d - c;
//   var j = f - e;
//   g[0] = 2 / h;
//   g[1] = 0;
//   g[2] = 0;
//   g[3] = 0;
//   g[4] = 0;
//   g[5] = 2 / i;
//   g[6] = 0;
//   g[7] = 0;
//   g[8] = 0;
//   g[9] = 0;
//   g[10] = -2 / j;
//   g[11] = 0;
//   g[12] = -(a + b) / h;
//   g[13] = -(d + c) / i;
//   g[14] = -(f + e) / j;
//   g[15] = 1;
//   return g
// }



  /**
   * GLSL代码
   * 声明一个顶点着色器
   * vec4：四维向量 ，具有xyzw四个分量，分量是浮点数
   * mat4: 4*4矩阵
   * **/
  const vertexString = `
    attribute vec4 a_position;
    uniform mat4 proj;
    void main(){
        gl_Position =proj * a_position;
        gl_PointSize = 20.0;
    }
    `;
  const fragmentString = `
    void main(){
        gl_FragColor = vec4(0,0,1.0,1.0);
    }
    `; // 片元着色器

  
export default function() {
  const canvas_element = initCanvas();
  const webgl = initWebgl(canvas_element);
  const program = initShader(webgl,vertexString,fragmentString);

  const projMat4 = mat4.create(); // 初始化一个4*4的矩阵

  function initBuffer() {


        if(!program) {
          return 
        }
    
        // 三角形
        // let pointPosition = new Float32Array([
        //   250.0, 100.0, 0.0, 1.0,
        //   150.0, 300.0, 0.0, 1.0,
        //   350.0, 300.0, 0.0, 1.0,
        // ]);

        // 矩形形
        let pointPosition = new Float32Array([
          100.0, 100.0, 0.0, 1.0,
          200.0, 100.0, 0.0, 1.0,
          100.0, 200.0, 0.0, 1.0,
          200.0, 200.0, 0.0, 1.0,
        ]); 

        mat4.ortho(
          projMat4,
          0,
          500,
          500,
          0,
          -1.0,
          1.0
        )




        // getAttribLocation() 方法返回给定WebGLProgram对象中某属性的下标指向位置
        // 第一个参数为WebGLProgram，第二个参数为需要获取下标指向位置的GLSL变量名
        let aPosition = webgl.getAttribLocation(program, "a_position");

        let trangleBuffer =  webgl.createBuffer();
        webgl.bindBuffer(webgl.ARRAY_BUFFER,trangleBuffer);
        webgl.bufferData(webgl.ARRAY_BUFFER,pointPosition,webgl.STATIC_DRAW);
        webgl.enableVertexAttribArray(aPosition);
        webgl.vertexAttribPointer(aPosition,3, webgl.FLOAT, false, 4*4, 0);
       



        // getUniformLocation（）方法用于获取指定WebGLProgram对象中uniform变量的位置。
        // 第一个参数为要获取uniform变量的WebGLProgram对象，第二个参数为要获取位置的uniform变量的名称。
        let uniforproj = webgl.getUniformLocation(program, "proj");


        const angel =20*Math.PI/180
          
        let ModelMatrixx = mat4.create();
        mat4.identity(ModelMatrixx);
        mat4.rotate(ModelMatrixx, ModelMatrixx, angel,[0, 0, 1]);
        mat4.multiply(projMat4,projMat4,ModelMatrixx);






        // uniformMatrix4fv（）用于设置一个4*4的矩阵类型的uniform变量值。接收4个参数
        // 第一个参数为 要设置值的uniform变量的地址
        // 第二个参数为 是否将矩阵转置，默认false
        // 第三个参数为  要设置的值，应该是一个4*4的矩阵
        // 第四个参数为 矩阵在数组中的偏移量，默认为0
        webgl.uniformMatrix4fv(uniforproj, false, projMat4);
  }

  function draw() {
        // clearColor ()方法指定在清除颜色缓冲区时使用的颜色值。接收的4个参数分别表示 r,g,b,a。取值均在0和1之间。
        webgl.clearColor(0.0, 0.0, 0.0, 1.0);
        // clear() 方法使用预设值来清空缓冲。预设值可以使用 clearColor() 、 clearDepth() 或 clearStencil() 设置。裁剪、抖动处理和缓冲写入遮罩会影响 clear() 方法。参数为一个用于指定需要清除的缓冲区的 GLbitfield (en-US) 。可能的值有：gl.COLOR_BUFFER_BIT(颜色缓冲区)；gl.DEPTH_BUFFER_BIT (深度缓冲区)       gl.STENCIL_BUFFER_BIT(模板缓冲区)  没有返回值
        webgl.clear(webgl.COLOR_BUFFER_BIT);

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
        webgl.drawArrays(webgl.TRIANGLE_STRIP, 0, 4);
  }


  initBuffer();
  draw();
}