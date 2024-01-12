  
import {initCanvas,initWebgl,initShader} from '../../utils'
import {mat4} from 'gl-matrix'
import imageUrl from '../../images/point64.png'
import imageUrl2 from '../../images/point16.png'

import imageUrl3 from '../../images/山水.png'
import imageUrl4 from '../../images/fog.png'



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
        gl_Position =proj * a_position;
        gl_PointSize = 64.0;
        inUV = outUV;
    }
    `;

    // uniform sampler2D texture;
  const fragmentString = `
  precision mediump float;
  uniform sampler2D texture1;
  uniform sampler2D texture2;
  uniform float anim;
  varying vec2 inUV;
    void main(){
    
        vec4 color1 = texture2D(texture1,inUV);
        vec4 color2 = texture2D(texture2,vec2(inUV.x+anim,inUV.y));
        gl_FragColor = color1+color2;
    }
    `; // 片元着色器

  
export default function() {
  const canvas_element = initCanvas();
  const webgl = initWebgl(canvas_element);
  const program = initShader(webgl,vertexString,fragmentString);

  const projMat4 = mat4.create(); // 初始化一个4*4的矩阵

  let uniformTexture1:WebGLUniformLocation;
  let uniformTexture2:WebGLUniformLocation;
  let texture1:WebGLTexture;
  let texture2:WebGLTexture;
  let uniformAnim:WebGLUniformLocation;
  let count:number  = 0;

  function tick() {
    requestAnimationFrame(tick)
    draw();
  };

  function initBuffer() {


        if(!program) {
          return 
        }
      uniformAnim = webgl.getUniformLocation(program, "anim") as  WebGLUniformLocation
      
      //Float32Array 类型数组代表的是平JS内置的标准对象，为 32 位的浮点数型数组，其内容初始化为 0。一旦建立起来，你可以使用这个对象的方法对其元素进行操作，或者使用标准数组索引语法 (使用方括号)。https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Float32Array
      let pointPosition = new Float32Array([
        0, 0, 0, 1, 0, 0,
        0, 500, 0, 1, 0, 1,
        500, 0, 0, 1, 1, 0,

        500, 0, 0, 1, 1, 0,
        0, 500, 0, 1, 0, 1,
        500, 500, 0, 1, 1, 1,
    ]);





  
      uniformTexture1 = webgl.getUniformLocation(program, "texture1") as  WebGLUniformLocation;
      uniformTexture2 = webgl.getUniformLocation(program, "texture2") as  WebGLUniformLocation;
      webgl.enable(webgl.BLEND);
      webgl.blendFunc(webgl.SRC_ALPHA , webgl.ONE_MINUS_SRC_ALPHA);


      texture1 = webgl.createTexture() as WebGLTexture;
      texture2 = webgl.createTexture() as WebGLTexture;

      Promise.all([initTexture(imageUrl3,texture1),initTexture(imageUrl4,texture2)])
      .then((res)=>{
        res.map((el:any)=>{
          handleLoadedTexture.apply(null,el)
        })
        tick();
      })

      
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
        
        let trangleBuffer =  webgl.createBuffer();
        webgl.bindBuffer(webgl.ARRAY_BUFFER,trangleBuffer);
        webgl.bufferData(webgl.ARRAY_BUFFER,pointPosition,webgl.STATIC_DRAW);


        
        let aPosition = webgl.getAttribLocation(program, "a_position");
        webgl.enableVertexAttribArray(aPosition);
        webgl.vertexAttribPointer(aPosition,4, webgl.FLOAT, false, 6*4, 0);


        let outUV = webgl.getAttribLocation(program, "outUV");
        webgl.enableVertexAttribArray(outUV);
        webgl.vertexAttribPointer(outUV,2, webgl.FLOAT, false, 6*4, 4*4);





        // getUniformLocation（）方法用于获取指定WebGLProgram对象中uniform变量的位置。
        // 第一个参数为要获取uniform变量的WebGLProgram对象，第二个参数为要获取位置的uniform变量的名称。
        let uniforproj = webgl.getUniformLocation(program, "proj");

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
        webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
        webgl.enable(webgl.DEPTH_TEST);

        
          count += 0.01;
        webgl.uniform1f(uniformAnim, count);

        webgl.activeTexture(webgl.TEXTURE1);
        webgl.bindTexture(webgl.TEXTURE_2D, texture1);
        webgl.uniform1i(uniformTexture1, 1);

        webgl.activeTexture(webgl.TEXTURE2);
        webgl.bindTexture(webgl.TEXTURE_2D, texture2);
        webgl.uniform1i(uniformTexture2, 2);




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


  function initTexture(imageFile:string,texture:WebGLTexture) {

    return new Promise(function(resolve,reject){
      const image = new Image();
      image.src = imageFile;
      image.onload = () => {
        resolve([texture,image])
        // handleLoadedTexture(textureHandle,image,WebGLUniformLocation)
      }
      
    })


  }

  function handleLoadedTexture(texture:WebGLTexture,image:TexImageSource ) {
    webgl.bindTexture(webgl.TEXTURE_2D, texture);
    webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, image);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.REPEAT);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.REPEAT);
  }


  initBuffer();
  
}