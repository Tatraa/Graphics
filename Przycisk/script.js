const vertexShaderTxt = `
    precision mediump float;

    attribute vec2 vertPosition;
    attribute vec3 vertColor;

    varying vec3 fragColor;

    void main()
    {
        fragColor = vertColor;
        gl_Position = vec4(vertPosition, 0.0, 1.0);
    }
`

const fragmentShaderTxt = `
    precision mediump float;

    varying vec3 fragColor;

    void main()
    {
        gl_FragColor = vec4(fragColor, 1.0);
    }
`

const Triangle = function () {
    const canvas = document.getElementById("main-canvas");
    // console.log(canvas);
    const gl = canvas.getContext("webgl");

    if (!gl) {
        alert('no webgl');
    }

    gl.clearColor(0.5, 0.5, 0.9, 1.0);   // R,G,B, opacity
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderTxt);
    gl.shaderSource(fragmentShader, fragmentShaderTxt);

    gl.compileShader(vertexShader);
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(vertexShader));
    }
    gl.compileShader(fragmentShader);

    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    gl.detachShader(program, vertexShader); //https://www.khronos.org/opengl/wiki/Shader_Compilation#Before_linking
    gl.detachShader(program, fragmentShader);
 
    gl.validateProgram(program);

    let triangleVert = [
        // X, Y         RGB
        0.0, 0.5,       1.0, 0.0, 0.0,
        -0.5, -0.5,     0.0, 1.0, 0.0,
        0.5, -0.5,      0.0, 0.0, 1.0
    ]
    const triangleVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVert), gl.STATIC_DRAW); // since everything in JS is 64 bit floating point we need to convert to 32 bits

    const posAttrLocation = gl.getAttribLocation(program, 'vertPosition');
    const colorAttrLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        posAttrLocation,
        2,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        0,
    );

    gl.vertexAttribPointer(
        colorAttrLocation,    // attribute location
        3,// number of elements per attribute
        gl.FLOAT,// type of elements
        gl.FALSE,// if data is normalized
        5 * Float32Array.BYTES_PER_ELEMENT,// Size of individual vertex
        2 * Float32Array.BYTES_PER_ELEMENT,// offset from the beginnning  of a single vertex to this attribute
    );

    gl.enableVertexAttribArray(posAttrLocation);
    gl.enableVertexAttribArray(colorAttrLocation);

    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3)


    const changeColorButton = document.createElement("button");
    changeColorButton.textContent = "Zmień kolor";
    document.body.appendChild(changeColorButton);

    changeColorButton.addEventListener("click", function () {
        const newColor = [
            Math.random(),
            Math.random(),
            Math.random()
        ];

        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
        gl.bufferSubData(gl.ARRAY_BUFFER, 2 * Float32Array.BYTES_PER_ELEMENT, new Float32Array(newColor), 0);

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    });
};

const triangle = new Triangle();

