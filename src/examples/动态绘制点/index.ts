  
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

  // precision mediump float 指定变量精度和范围
  const fragmentString = `
    precision mediump float;
    uniform vec4 u_FragColor;

    void main(){
        gl_FragColor = u_FragColor;
    }
    `; // 片元着色器

  
export default function() {
  const canvas_element = initCanvas();
  const webgl = initWebgl(canvas_element);
  const program = initShader(webgl,vertexString,fragmentString);
  const projMat4 = mat4.create(); // 初始化一个4*4的矩阵
  let pointPosition:number[] = [];
  let colorList:number[][] = [];
  let aPosition:number;
  let aColor:WebGLUniformLocation;
  function initBuffer() {
        mat4.ortho(
          projMat4,
          0,
          500,
          500,
          0,
          -1.0,
          1.0
        )
        
        if(!program) return 
       
        // getAttribLocation() 方法返回给定WebGLProgram对象中某属性的下标指向位置
        // 第一个参数为WebGLProgram，第二个参数为需要获取下标指向位置的GLSL变量名
        aPosition = webgl.getAttribLocation(program, "a_position");
        aColor = webgl.getUniformLocation(program, "u_FragColor") as WebGLUniformLocation

        console.log('aColor = ',aColor);

        console.log('aPosition = ' , aPosition)

        // vertexAttrib4fv（）方法可以为顶点 attibute 变量赋值。
        // 第一个参数为指定了待修改顶点 attribute 变量的存储位置。第二个参数为用于设置顶点 attibute 变量的向量值。
        // webgl.vertexAttrib4fv(aPosition, pointPosition);

        // getUniformLocation（）方法用于获取指定WebGLProgram对象中uniform变量的位置。
        // 第一个参数为要获取uniform变量的WebGLProgram对象，第二个参数为要获取位置的uniform变量的名称。
        let uniforproj = webgl.getUniformLocation(program, "proj");

        console.log("uniforproj",uniforproj)

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

        for (let index = 0; index < pointPosition.length/4; index++) {
          const element = colorList[index];
          console.log('element',element,index);
          webgl.uniform4f(aColor, element[0],element[1],element[2],element[3]);
          webgl.vertexAttrib4fv(aPosition, [pointPosition[4*index+0],pointPosition[4*index+1],pointPosition[4*index+2],pointPosition[4*index+3]]);
          webgl.drawArrays(webgl.POINTS, 0, 1);
        }
  }
  canvas_element.addEventListener('click',function(e){
    const targetX = e.clientX - canvas_element.getBoundingClientRect().x;
    const targetY = e.clientY - canvas_element.getBoundingClientRect().y;
    pointPosition.push(targetX);
    pointPosition.push(targetY)
    pointPosition.push(0)
    pointPosition.push(1);
    const gapX = targetX - canvas_element.clientWidth/2;
    const gapY = targetY - canvas_element.clientHeight/2; 


    /**第四象限 */
    if(gapX>0 && gapY>0) {
      colorList.push([1.0,0.0,0.0,1.0])
    }


    /**第三象限 */
    if(gapX<0 && gapY>0) {
      colorList.push([0.0,1.0,0.0,1.0])
    }


   /**第一象限 */
   if(gapX>0 && gapY<0) {
    colorList.push([0.0,0.0,1.0,1.0])
   }


   /**第二象限 */
   if(gapX<0 && gapY<0) {
    colorList.push([1.0,1.0,0.0,1.0])
   }
    
    draw();
  })

  initBuffer();
  draw();
}