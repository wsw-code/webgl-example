  
import {initCanvas,initWebgl,initShader} from '../../utils'
import {mat4} from 'gl-matrix'
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
    attribute vec2 a_uv;
    varying vec2 v_uv;
    void main(){
        v_uv = a_uv;
        gl_Position = proj * a_position;
        v_color = a_color;
    }
    `;
  const fragmentString = `
  precision mediump float;
  uniform sampler2D texture0;
  varying vec2 v_uv;
  varying vec4 v_color;
    void main(){
      gl_FragColor = texture2D(texture0,v_uv) * v_color;
    }
    `; // 片元着色器

  
export default function() {
  const canvas_element = initCanvas();
  const webgl = initWebgl(canvas_element);
  const program = initShader(webgl,vertexString,fragmentString)!;
  webgl.viewport(0, 0, canvas_element.clientWidth, canvas_element.clientHeight);

  let mouseDownX:number;
  let mouseDownY:number;
  let offsetX = 0;
  let offsetY = 0;

  let imgElement:HTMLImageElement;


  let moveState = false


  function mouseDown(e) {
    moveState = true;

    mouseDownX = e.clientX;
    mouseDownY = e.clientY;
  }
  function mouseMove(e) {
      if (!moveState) {
          return
      }else{
          offsetX = e.clientX - mouseDownX;
          offsetY = e.clientY - mouseDownY;
      }
      initBuffer();
      draw();
  }


  function initEvent() {
    document.onmousedown = mouseDown;
    document.onmousemove = mouseMove;

    
}


  function handleLoadedTexture(texture:WebGLTexture,image:TexImageSource ) {


    webgl.bindTexture(webgl.TEXTURE_2D, texture);
    webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, image);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.NEAREST);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.NEAREST);
    // ，REPEAT 模式对纹理图片的尺寸有要求，宽度和高度必须为 2 的整数次幂，如 32x32 或 1024x256 的图片 
    // logo 图片为200 x 288 不符合，使用REPEAT会不展示图片
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.CLAMP_TO_EDGE);
    //因为异步原因所以要加在这里
    // webgl.uniform1i(WebGLUniformLocation, 0);
   
  }

  function initBuffer(img?:HTMLImageElement) {

    imgElement = img || imgElement;

    let uniformTexture1 = webgl.getUniformLocation(program, "texture0") as  WebGLUniformLocation;
        
    const texture0 = webgl.createTexture() as WebGLTexture;
  
    webgl.activeTexture(webgl.TEXTURE0);
    webgl.bindTexture(webgl.TEXTURE_2D, texture0);
    webgl.uniform1i(uniformTexture1, 0);
    handleLoadedTexture(texture0,imgElement)


        //Float32Array 类型数组代表的是平JS内置的标准对象，为 32 位的浮点数型数组，其内容初始化为 0。一旦建立起来，你可以使用这个对象的方法对其元素进行操作，或者使用标准数组索引语法 (使用方括号)。https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Float32Array
        let pointPosition = new Float32Array([




        // 前-左-上
        -1,1,1,1,   1,1,0,1,    0,1,
        // 前-左-下
        -1,-1,1,1,  1,1,0,1,    0,0,
        // 前-右-上
        1,1,1,1,    1,1,0,1,    1,1,
        // 前-右-下
        1,-1,1,1,   1,1,0,1,    1,0,   
        // 前-左-下
        -1,-1,1,1,  1,1,0,1,    0,0,
        // 前-右-上
        1,1,1,1,    1,1,0,1,    1,1,





        // 后-左-上
        -1,1,-1,1,   1,1,0,1,    0,1,
        // 后-左-下
        -1,-1,-1,1,  1,1,0,1,    0,0,
        // 后-右-上
        1,1,-1,1,    1,1,0,1,    1,1,
        // 后-右-下
        1,-1,-1,1,   1,1,0,1,    1,0,    
        // 后-左-下
        -1,-1,-1,1,  1,1,0,1,    0,0,
        // 后-右-上
        1,1,-1,1,    1,1,0,1,    1,1,


        // 左-左-上
        -1,-1,1,1,   1,1,0,1,    0,1,
        // 左-左-下
        -1,-1,-1,1,  1,1,0,1,    0,0,
        // 左-右-上
        -1,1,1,1,    1,1,0,1,    1,1,
        // 左-右-下
        -1,1,-1,1,   1,1,0,1,    1,0,      
        // 左-左-下
        -1,-1,-1,1,  1,1,0,1,    0,0,
        // 左-右-上
        -1,1,1,1,    1,1,0,1,    1,1,



        // 右-左-上
        1,-1,1,1,   1,1,0,1,    0,1,
        // 右-左-下
        1,-1,-1,1,  1,1,0,1,    0,0,
        // 右-右-上
        1,1,1,1,    1,1,0,1,    1,1,
        // 右-右-下
        1,1,-1,1,   1,1,0,1,    1,0,      
        // 右-左-下
        1,-1,-1,1,  1,1,0,1,    0,0,
        // 右-右-上
        1,1,1,1,    1,1,0,1,    1,1,




        /**看单面 视图上方向需要改为x轴 */

        // 上-左-上
        -1,1,-1,1,   1,0,0,1,    0,1,
        // 上-左-下
        -1,1,1,1,  1,0,0,1,    0,0,
        // 上-右-上
        1,1,-1,1,    1,0,0,1,    1,1,
        // 上-右-下
        1,1,1,1,   1,0,0,1,       1,0,   
        // 上-左-下
        -1,1,1,1,  1,0,0,1,    0,0,
        // 上-右-上
        1,1,-1,1,    1,0,0,1,    1,1,


        // 下-左-上
        -1,-1,-1,1,   1,1,0,1,    0,1,
        // 下-左-下
        -1,-1,1,1,  1,1,0,1,    0,0,
        // 下-右-上
        1,-1,-1,1,    1,1,0,1,    1,1,
        // 下-右-下
        1,-1,1,1,   1,1,0,1,   1,0,  
        // 下-左-下
        -1,-1,1,1,  1,1,0,1,    0,0,
        // 下-右-上
        1,-1,-1,1,    1,1,0,1,    1,1,

                
        ]);


        let aPosition = webgl.getAttribLocation(program, "a_position");
        let aColor = webgl.getAttribLocation(program, "a_color");

        let trangleBuffer =  webgl.createBuffer();
        webgl.bindBuffer(webgl.ARRAY_BUFFER,trangleBuffer);
        webgl.bufferData(webgl.ARRAY_BUFFER,pointPosition,webgl.STATIC_DRAW);



        webgl.enableVertexAttribArray(aPosition);
        webgl.vertexAttribPointer(aPosition,4, webgl.FLOAT, false, 10*4, 0);

        webgl.enableVertexAttribArray(aColor);
        webgl.vertexAttribPointer(aColor,4, webgl.FLOAT, false, 10*4, 4*4);


        const projMat4 = mat4.create(); // 初始化一个4*4的矩阵
        mat4.identity(projMat4); 
        let uniforproj = webgl.getUniformLocation(program, "proj");
        mat4.perspective(projMat4,30 * Math.PI / 180,canvas_element.clientWidth/canvas_element.clientHeight,1,1000)


        const uvAttributeLocation = webgl.getAttribLocation(program, 'a_uv');
   
        webgl.enableVertexAttribArray(uvAttributeLocation);

        webgl.vertexAttribPointer(uvAttributeLocation, 2, webgl.FLOAT, false, 10*4, 4*8);


        let ModelMatrix =mat4.create();
        mat4.identity(ModelMatrix);



        let ModelMatrixx =mat4.create();
        mat4.identity(ModelMatrixx);
        mat4.rotate(ModelMatrixx,ModelMatrixx,offsetX * Math.PI / 180,[1,0,0]);

        let ModelMatrixy =mat4.create();
        mat4.identity(ModelMatrixy);
        mat4.rotate(ModelMatrixy,ModelMatrixy,offsetY * Math.PI / 180,[0,1,0]);


        let ModelMatrixxy = mat4.create();
        mat4.identity(ModelMatrixxy);
        mat4.multiply(ModelMatrixxy,ModelMatrixx,ModelMatrixy);



        let ViewMatrix =mat4.create();
        mat4.identity(ViewMatrix);
        mat4.lookAt(ViewMatrix, [5, 5, 5], [0, 0, 0], [0, 1, 0]);


        let mvpMatrix =mat4.create();
        mat4.identity(mvpMatrix);

        mat4.multiply(mvpMatrix,projMat4,ViewMatrix)

        webgl.uniformMatrix4fv(uniforproj, false, mvpMatrix);
        
  }

  function draw() {
      webgl.clearColor(0, 0, 0, 1);
      webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
      webgl.enable(webgl.DEPTH_TEST);
      
      webgl.drawArrays(webgl.TRIANGLES, 0, 30);
  }



  function initTexture(imageFile:string) {

    return new Promise<HTMLImageElement>(function(resolve){
      const image = new Image();
      image.src = imageFile;
      image.onload = () => {
        resolve(image)
      }
    })
  }
  
  initTexture(Img)
  .then((res)=>{
    initEvent();
    initBuffer(res);
    draw();
  })


  


}