

export function initCanvas(width:number=500,height:number=500,id="myCanvas"){
  const element = document.createElement("canvas") as HTMLCanvasElement;
  const container = document.getElementById("app");
  element.id = "myCanvas";
  element.width = width;
  element.height = height;
  container?.appendChild(element);
  return element
}

export function initWebgl(canvasElement:HTMLCanvasElement) {
  let webglDiv = canvasElement;
  let webgl = webglDiv.getContext("webgl");
  return webgl as WebGLRenderingContext 
}

// shder初始化函数
export function initShader(webgl:WebGLRenderingContext,vertexString:string,fragmentString:string) {
  // createShader() 用于创建一个 WebGLShader 着色器对象，该对象可以使用 shaderSource()和 compileShader() 方法配置着色器代码。
  // 参数为gl.VERTEX_SHADER 或 gl.FRAGMENT_SHADER两者中的一个。
  let vsshader = webgl.createShader(webgl.VERTEX_SHADER) as WebGLShader 
  let fssagder = webgl.createShader(webgl.FRAGMENT_SHADER) as WebGLShader

  // 用于将我们创建的 WebGLShader着色器对象和GLSL程序中定义的着色器相关联。
  // 第一个参数为webglShader对象，第二个参数为GLSL中定义的着色器
  webgl.shaderSource(vsshader, vertexString);
  webgl.shaderSource(fssagder, fragmentString);

  // 编译WebGLShader着色器，使其成为为二进制数据，然后就可以被WebGLProgram对象所使用。
  // 参数为一个片元着色器或顶点着色器
  webgl.compileShader(vsshader);
  webgl.compileShader(fssagder);

  if (!webgl.getShaderParameter(vsshader, webgl.COMPILE_STATUS)) {
      var err = webgl.getShaderInfoLog(vsshader);
      alert(err);
      return;
  }
  if (!webgl.getShaderParameter(fssagder, webgl.COMPILE_STATUS)) {
      var err = webgl.getShaderInfoLog(fssagder);
      alert(err);
      return;
  }

  // 创建一个webglProgram对象，该对象由两个编译过后的 WebGLShader 组成 - 顶点着色器和片段着色器（均由 GLSL 语言所写）
  let program = webgl.createProgram() as WebGLProgram 
    // attachShader() 方法负责往 WebGLProgram 添加一个片段或者顶点着色器。
    // 第一个参数为webglProgram对象，第二个参数为片段或者顶点的 WebGLShader
    webgl.attachShader(program, vsshader);
    webgl.attachShader(program, fssagder);

    // linkProgram()方法链接给定的WebGLProgram，从而完成为程序的片元和顶点着色器准备 GPU 代码的过程。参数为一个用于链接的WebGLProgram对象
    webgl.linkProgram(program);

    // useProgram() 方法将定义好的WebGLProgram 对象添加到当前的渲染状态中。
    webgl.useProgram(program);

    return program;

}