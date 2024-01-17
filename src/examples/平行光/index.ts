  
import {initCanvas,initWebgl,initShader} from '../../utils'
import {mat3, mat4} from 'gl-matrix'
import Img from '../../images/close-icon.png'




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
    varying vec4 v_color;
    // 表面法向量
    attribute vec4 a_normal;
    // 平行光颜色
    uniform vec3 u_LightColor;
    // 环境光颜色
    uniform vec3 u_AmbientLight;
    //归一化的世界坐标
    uniform vec3 u_LightDirection;


    uniform mat4 u_normalMatrix;



    void main(){
        // vec3 normal = normalize(a_normal.xyz);
        vec3 normal = normalize(vec3(u_normalMatrix * a_normal));
        vec3 LightDirection = normalize(u_LightDirection.xyz);
        // 计算光线方向和法向量的点积
        float nDotL = max(dot(LightDirection,normal),0.0);

        // 计算漫反射光的颜色
        vec3 diffuse = u_LightColor * a_color.rgb * nDotL;
        // 计算环境光颜色
        vec3 ambient = u_AmbientLight * a_color.rgb;

        gl_Position = proj * a_position;
        v_color = vec4(diffuse+ambient,1.0);
    }
    `;
  const fragmentString = `
  precision mediump float;

  varying vec4 v_color;
    void main(){
      gl_FragColor =  v_color;
    }
    `; // 片元着色器

  
export default function() {
  const canvas_element = initCanvas();
  const webgl = initWebgl(canvas_element);
  const program = initShader(webgl,vertexString,fragmentString)!;
  webgl.viewport(0, 0, canvas_element.clientWidth, canvas_element.clientHeight);


  let ModelMatrixx =mat4.create();
  let ModelMatrixxy = mat4.create();
  let ModelMatrix =mat4.create();
  let ViewMatrix =mat4.create();
  const projMat4 = mat4.create(); // 初始化一个4*4的矩阵
  let mvMatrix =mat4.create();
  let mvpMatrix =mat4.create();


  let resistance:number = 0.1;
  let mouseDownX:number;
  let mouseDownY:number;
  let offsetX = 0;
  let offsetY = 0;

  let rotateX:number = 0;
  let rotateY:number = 0;

  let imgElement:HTMLImageElement;


  let moveState = false;


          //Float32Array 类型数组代表的是平JS内置的标准对象，为 32 位的浮点数型数组，其内容初始化为 0。一旦建立起来，你可以使用这个对象的方法对其元素进行操作，或者使用标准数组索引语法 (使用方括号)。https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Float32Array
  let pointPosition = new Float32Array([
    // 前-左-上
    -1,1,1,1,     1,1,0,1,
    // 前-左-下
    -1,-1,1,1,    1,1,0,1,
    // 前-右-上
    1,1,1,1,      1,1,0,1,
    
    // 前-右-下 
    1,-1,1,1,     1,1,0,1, 
    // 前-右-上
    1,1,1,1,      1,1,0,1,
    // 前-左-下
    -1,-1,1,1,    1,1,0,1,


    // 后-左-上
    1,1,-1,1,     1,1,0,1,
    // 后-左-下
    1,-1,-1,1,    1,1,0,1, 
    // 后-右-上
    -1,1,-1,1,    1,1,0,1,    
    // 后-右-下
    -1,-1,-1,1,   1,1,0,1,      
    // 后-右-上
    -1,1,-1,1,    1,1,0,1,    
    // 后-左-下
    1,-1,-1,1,    1,1,0,1,    


    // 左-左-上
    -1,-1,-1,1,   1,1,0,1,    
    // 左-左-下
    -1,-1,1,1,    1,1,0,1,    
    // 左-右-上
    -1,1,-1,1,    1,1,0,1,    
    // 左-右-下
    -1,1,1,1,     1,1,0,1,        
    // 左-右-上
    -1,1,-1,1,    1,1,0,1,        
    // 左-左-下
    -1,-1,1,1,    1,1,0,1,    


    // 右-左-上
    1,-1,1,1,     1,1,0,1,    
    // 右-左-下
    1,-1,-1,1,    1,1,0,1,    
    // 右-右-上
    1,1,1,1,      1,1,0,1,    
    // 右-右-下
    1,1,-1,1,     1,1,0,1,    
    // 右-右-上
    1,1,1,1,      1,1,0,1,        
    // 右-左-下
    1,-1,-1,1,    1,1,0,1,    



    /**看单面 视图上方向需要改为x轴 */

    // 上-左-上
    -1,1,-1,1,    1,0,0,1,    
    // 上-左-下
    -1,1,1,1,     1,0,0,1,    
    // 上-右-上
    1,1,-1,1,     1,0,0,1,    
    // 上-右-下
    1,1,1,1,      1,0,0,1,     
    // 上-右-上
    1,1,-1,1,     1,0,0,1,      
    // 上-左-下
    -1,1,1,1,     1,0,0,1,   



    // 下-左-上
    1,-1,-1,1,   1,1,0,1,    
    // 下-左-下
    1,-1,1,1,  1,1,0,1,    
    // 下-右-上
    -1,-1,-1,1,    1,1,0,1,    
    // 下-右-下
    -1,-1,1,1,   1,1,0,1,     
    // 下-右-上
    -1,-1,-1,1,    1,1,0,1,       
    // 下-左-下
    1,-1,1,1,  1,1,0,1,    


            
  ]);

  /**法向量 */
  let normals = new Float32Array([
    /**前面 */
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,  
    0.0, 0.0, 1.0, 
    0.0, 0.0, 1.0, 

    /**后面 */

    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,  
    0.0, 0.0, -1.0, 
    0.0, 0.0, -1.0, 

    /**左 */
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,

    /**右 */
    1.0,0.0,0.0,
    1.0,0.0,0.0,
    1.0,0.0,0.0,
    1.0,0.0,0.0,
    1.0,0.0,0.0,
    1.0,0.0,0.0,


    /**上 */
    0.0,1.0,0.0,
    0.0,1.0,0.0,
    0.0,1.0,0.0,
    0.0,1.0,0.0,
    0.0,1.0,0.0,
    0.0,1.0,0.0,


    /**下 */
    0.0,-1.0,0.0,
    0.0,-1.0,0.0,
    0.0,-1.0,0.0,
    0.0,-1.0,0.0,
    0.0,-1.0,0.0,
    0.0,-1.0,0.0,

]);


  function mouseDown(e:MouseEvent) {
    moveState = true;

    mouseDownX = e.clientX;
    mouseDownY = e.clientY;
  }
  function mouseMove(e:MouseEvent) {
      if (!moveState) {
          return
      }else{
          offsetX = (e.clientX - mouseDownX)*resistance;
          offsetY = (e.clientY - mouseDownY)*resistance;
      }
      initBuffer();
      draw();
  }


  function initEvent() {
    document.onmousedown = mouseDown;
    document.onmousemove = mouseMove;
    document.onmouseup = function() {
      moveState = false;
    }
    
}


  function initBuffer() {

    let aPosition = webgl.getAttribLocation(program, "a_position");
    let aColor = webgl.getAttribLocation(program, "a_color");
    let trangleBuffer =  webgl.createBuffer();
    webgl.bindBuffer(webgl.ARRAY_BUFFER,trangleBuffer);
    webgl.bufferData(webgl.ARRAY_BUFFER,pointPosition,webgl.STATIC_DRAW);
    webgl.enableVertexAttribArray(aPosition);
    webgl.vertexAttribPointer(aPosition,4, webgl.FLOAT, false, 8*4, 0);
    webgl.enableVertexAttribArray(aColor);
    webgl.vertexAttribPointer(aColor,4, webgl.FLOAT, false, 8*4, 4*4);
    mat4.identity(projMat4); 
    let uniforproj = webgl.getUniformLocation(program, "proj");
    mat4.perspective(projMat4,60 * Math.PI / 180,canvas_element.clientWidth/canvas_element.clientHeight,1,1000)
    mat4.identity(ModelMatrix);

    rotateX = rotateX + offsetX * Math.PI / 180;
    rotateY = rotateY + offsetY * Math.PI / 180;

    mat4.identity(ModelMatrixx);
    mat4.rotate(ModelMatrixx,ModelMatrixx,rotateY,[1,0,0]);

    let ModelMatrixy =mat4.create();
    mat4.identity(ModelMatrixy);
    mat4.rotate(ModelMatrixy,ModelMatrixy,rotateX,[0,1,0]);

    mat4.identity(ModelMatrixxy);
    mat4.multiply(ModelMatrixxy,ModelMatrixx,ModelMatrixy);

    mat4.identity(ViewMatrix);
    mat4.lookAt(ViewMatrix, [5, 5, 5], [0, 0, 0], [0, 1, 0]);

    mat4.identity(mvMatrix);

    mat4.multiply(mvMatrix,ViewMatrix,ModelMatrixxy)

    mat4.identity(mvpMatrix);

    mat4.multiply(mvpMatrix,projMat4,mvMatrix)

    webgl.uniformMatrix4fv(uniforproj, false, mvpMatrix);


    /**设置光源 */
    let u_LightColor = webgl.getUniformLocation(program,"u_LightColor");
    webgl.uniform3f(u_LightColor,1.0,1.0,1.0);

    // 设置光方向
    let u_LightDirection = webgl.getUniformLocation(program, 'u_LightDirection');
    webgl.uniform3fv(u_LightDirection, [0.0, 0.0, 2.0]);

    let aNormal = webgl.getAttribLocation(program, "a_normal");
    let normalBuffer =  webgl.createBuffer();
    webgl.bindBuffer(webgl.ARRAY_BUFFER,normalBuffer);
    webgl.bufferData(webgl.ARRAY_BUFFER,normals,webgl.STATIC_DRAW);
    webgl.enableVertexAttribArray(aNormal);
    webgl.vertexAttribPointer(aNormal,3, webgl.FLOAT, false, 3*4, 0);

    let u_AmbientLight = webgl.getUniformLocation(program, 'u_AmbientLight');
    webgl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);

    let u_normalMatrix = webgl.getUniformLocation(program, 'u_normalMatrix');
    webgl.uniform3f(u_normalMatrix, 0.2, 0.2, 0.2);

    let normalMatrix = mat4.create();
    mat4.identity(normalMatrix);
    mat4.invert(normalMatrix,ModelMatrixxy)
    mat4.transpose(normalMatrix,normalMatrix)
    webgl.uniformMatrix4fv(u_normalMatrix,false,normalMatrix)

  }

  function draw() {
      webgl.clearColor(0, 0, 0, 1);
      webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
      webgl.enable(webgl.DEPTH_TEST);
      webgl.enable(webgl.CULL_FACE);
      webgl.cullFace(webgl.BACK);
      webgl.drawArrays(webgl.TRIANGLES, 0, 36);
  }


  
  initEvent();
  initBuffer();
  draw();


  


}