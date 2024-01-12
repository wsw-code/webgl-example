  
import {initCanvas,initWebgl,initShader} from '../../utils'



  /**
   * GLSL代码
   * 声明一个顶点着色器
   * vec4：四维向量 ，具有xyzw四个分量，分量是浮点数
   * mat4: 4*4矩阵
   * **/
  const vertexString = `
  attribute vec2 a_position;
  attribute vec4 a_color;

  varying vec4 v_color;

  void main(){
      v_color = a_color;
      gl_Position = vec4(a_position, 0.0, 1.0);
      // gl_PointSize = 3.0;
  }
    `;
  const fragmentString = `
   precision mediump float;

    uniform vec4 u_color;
    
    varying vec4 v_color;

    void main (){
        // 将三角形输出的最终颜色固定为玫红色
        // 这里的四个分量分别代表红（r）、绿（g）、蓝（b）和透明度（alpha）
        // 颜色数值取归一化值。最终绘制的其实就是 [255, 0, 127. 255]
        gl_FragColor = v_color;
    }
    `; // 片元着色器

  
export default function() {
  const canvas_element = initCanvas();
  const webgl = initWebgl(canvas_element);
  const program = initShader(webgl,vertexString,fragmentString);


  function initBuffer() {


        if(!program) {
          return 
        }

        //Float32Array 类型数组代表的是平JS内置的标准对象，为 32 位的浮点数型数组，其内容初始化为 0。一旦建立起来，你可以使用这个对象的方法对其元素进行操作，或者使用标准数组索引语法 (使用方括号)。https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Float32Array
        let pointPosition = new Float32Array([
          0, 0,
          0.7, 0,
          0, 0.5,
          0.7, 0.5
        ]);


        const colors = new Uint8Array([
          255, 0, 0, 255,
          0, 255, 0, 255,
          0, 0, 255, 255,
          255, 127, 0, 255
        ]);

        const indices = [
          0, 1, 2,
          2, 1, 3
        ];


        /**
         * 开启背面剔除
         */
        webgl.enable(webgl.CULL_FACE);


        let vertexBuffer =  webgl.createBuffer();
        webgl.bindBuffer(webgl.ARRAY_BUFFER,vertexBuffer);
        webgl.bufferData(webgl.ARRAY_BUFFER,pointPosition,webgl.STATIC_DRAW);

        let colorBuffer =  webgl.createBuffer();
        webgl.bindBuffer(webgl.ARRAY_BUFFER, colorBuffer);
        webgl.bufferData(webgl.ARRAY_BUFFER, colors, webgl.STATIC_DRAW);

        const indexBuffer = webgl.createBuffer();
        webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), webgl.STATIC_DRAW);




        let positionAttributeLocation  = webgl.getAttribLocation(program, "a_position");
        webgl.enableVertexAttribArray(positionAttributeLocation );
        webgl.bindBuffer(webgl.ARRAY_BUFFER, vertexBuffer);
        webgl.vertexAttribPointer(positionAttributeLocation ,2, webgl.FLOAT, false, 0, 0);


        let aColor = webgl.getAttribLocation(program, "a_color");
        webgl.enableVertexAttribArray(aColor);
        webgl.bindBuffer(webgl.ARRAY_BUFFER, colorBuffer);
        webgl.vertexAttribPointer(aColor,4, webgl.UNSIGNED_BYTE, true, 0, 0);


  



      // let uColor = webgl.getUniformLocation(program, "u_color");

      // webgl.uniform4fv(uColor,[Math.random(),Math.random(),Math.random(),1.0])
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
        webgl.drawElements(webgl.TRIANGLES, 6, webgl.UNSIGNED_BYTE, 0);
  }


  initBuffer();
  draw();
}