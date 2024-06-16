import * as Config from "./config.js";
import * as Main from "./main.js";
// Utils
export function showError(errorText) {
    console.log(errorText);
    // $("#error-box").empty();
    const errorBoxDiv = document.getElementById('error-box');
    if (errorBoxDiv === null) {
        return;
    }
    const errorElement = document.getElementById('error-description');
    errorElement.innerHTML = errorText;
}
export function getRandomInRange(min, max) {
    return Math.random() * (max - min) + min;
}
export function getRandomIntegerInRange(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}
export function createStaticVertexBuffer(webGL2, data) {
    const buffer = webGL2.createBuffer();
    webGL2.bindBuffer(webGL2.ARRAY_BUFFER, buffer);
    webGL2.bufferData(webGL2.ARRAY_BUFFER, data, webGL2.STATIC_DRAW);
    webGL2.bindBuffer(webGL2.ARRAY_BUFFER, null);
    return buffer;
}
export function stringfyGLSL(filename) {
    var request = new XMLHttpRequest();
    request.open('GET', filename + '.glsl', false);
    request.send(null);
    return request.responseText;
}
export function createTwoBufferVertexAttribureObject(webGL2, positionBuffer, colorBuffer, positionAttributeLocation, colorAttributeLocation) {
    const vertexAttributeObject = webGL2.createVertexArray();
    webGL2.bindVertexArray(vertexAttributeObject);
    // Enabling vertex shader attributes
    webGL2.enableVertexAttribArray(positionAttributeLocation);
    webGL2.enableVertexAttribArray(colorAttributeLocation);
    // Binding the positionBuffer to the vertex shader vertexPosition attribute. 
    webGL2.bindBuffer(webGL2.ARRAY_BUFFER, positionBuffer);
    webGL2.vertexAttribPointer(positionAttributeLocation, 2, webGL2.FLOAT, false, 0, 0);
    // Binding the colorBuffer to the vertexColor vertex shader attribute. 
    webGL2.bindBuffer(webGL2.ARRAY_BUFFER, colorBuffer);
    webGL2.vertexAttribPointer(colorAttributeLocation, 3, webGL2.UNSIGNED_BYTE, true, 0, 0);
    // Releasing the just prepared vertexAttributeObject 
    webGL2.bindVertexArray(null);
    return vertexAttributeObject;
}
export function createInterleaveBufferVertexAttribureObject(webGL2, interleaveBuffer, positionAttributeLocation, colorAttributeLocation) {
    const vertexAttributeObject = webGL2.createVertexArray();
    webGL2.bindVertexArray(vertexAttributeObject);
    webGL2.enableVertexAttribArray(positionAttributeLocation);
    webGL2.enableVertexAttribArray(colorAttributeLocation);
    webGL2.bindBuffer(webGL2.ARRAY_BUFFER, interleaveBuffer);
    webGL2.vertexAttribPointer(positionAttributeLocation, 2, webGL2.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
    webGL2.vertexAttribPointer(colorAttributeLocation, 3, webGL2.UNSIGNED_BYTE, true, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
    webGL2.bindVertexArray(null);
    return vertexAttributeObject;
}
export function createProgram(webGL2, vertexShaderSourceCode, fragmentShaderSourceCode) {
    // Loading GLSL (OpenGL Shading Language) scripts
    const vertexShader = webGL2.createShader(webGL2.VERTEX_SHADER);
    webGL2.shaderSource(vertexShader, vertexShaderSourceCode);
    webGL2.compileShader(vertexShader);
    const fragmentShader = webGL2.createShader(webGL2.FRAGMENT_SHADER);
    webGL2.shaderSource(fragmentShader, fragmentShaderSourceCode);
    webGL2.compileShader(fragmentShader);
    let program = webGL2.createProgram();
    webGL2.attachShader(program, vertexShader);
    webGL2.attachShader(program, fragmentShader);
    webGL2.linkProgram(program);
    return program;
}
export function generateNewShapeParameters(VAOList) {
    const movementAngle = getRandomInRange(0, 2 * Math.PI);
    const movementSpeed = getRandomInRange(Config.config.MIN_SHAPE_SPEED, Config.config.MAX_SHAPE_SPEED);
    const forceAngle = getRandomInRange(0, 2 * Math.PI);
    const forceSpeed = getRandomInRange(Config.config.MIN_SHAPE_FORCE, Config.config.MAX_SHAPE_FORCE);
    const position = [Config.config.OFFSET_X, Config.config.OFFSET_Y];
    const velocity = [
        Math.sin(movementAngle) * movementSpeed,
        Math.cos(movementAngle) * movementSpeed
    ];
    const force = [
        Math.sin(forceAngle) * forceSpeed,
        Math.cos(forceAngle) * forceSpeed
    ];
    const size = Config.config.SCALE * getRandomInRange(Config.config.MIN_SHAPE_SIZE, Config.config.MAX_SHAPE_SIZE);
    const timeRemaining = getRandomInRange(Config.config.MIN_SHAPE_TIME, Config.config.MAX_SHAPE_TIME);
    const attributeObjectIndex = Math.floor(getRandomInRange(0, VAOList.length));
    const geometry = VAOList[attributeObjectIndex];
    return [position, velocity, size, timeRemaining, geometry.vao, geometry.numVertices, force];
}
export function updateObjectExplorer(shapes) {
    shapes.forEach(shape => {
        if (document.getElementById(String(shape.id)) != undefined) {
            if (!shape.isAlive()) {
                $(`#${shape.id}`).remove();
            }
        }
        else {
            let _ = document.createElement('li');
            _.innerHTML = String(`ID ${shape.id}`);
            // difX and difY are corrections due to the justification and alignment of the demo-canvas within the canvas-container.
            let difX = (parseFloat($('#canvas-container').css('width')) - Config.config.CANVAS_WIDTH) / 2;
            let difY = (parseFloat($('#canvas-container').css('height')) - Config.config.CANVAS_HEIGHT) / 2;
            _.addEventListener('click', () => {
                Main.interval_ID_UpdateParametersDisplay_List.forEach(intervalID => {
                    clearInterval(intervalID);
                });
                let intervalID = setInterval(() => {
                    $('#object-id').html(String(shape.id));
                    $('#object-size').html(String(shape.size.toFixed(2)));
                    $('#object-vertices').html(String(shape.numVertices));
                    $('#object-position').html(String(shape.position[0].toFixed(4)) + ', ' + String(shape.position[1].toFixed(4)));
                    $('#object-speed').html(String([shape.velocity[0].toFixed(4), shape.velocity[1].toFixed(4)]));
                    $('#object-force').html(String([shape.force[0].toFixed(4), shape.force[1].toFixed(4)]));
                    $('#object-time-remaining').html(String(shape.timeRemaining.toFixed(2)));
                    $('#object-vao').html(String(shape.vao));
                    $('#object-alive').html(String(shape.isAlive()));
                    // Update bounding box size and location
                    $('#bounding-box-selected').css('width', String(shape.size) + 'px');
                    $('#bounding-box-selected').css('height', String(shape.size) + 'px');
                    $('#bounding-box-selected').css('bottom', String(((shape.position[1] + 1) / 2) * Config.config.CANVAS_HEIGHT - shape.size / 2 + difY) + 'px');
                    $('#bounding-box-selected').css('left', String(((shape.position[0] + 1) / 2) * Config.config.CANVAS_WIDTH - shape.size / 2 + difX) + 'px');
                }, 10);
                Main.interval_ID_UpdateParametersDisplay_List.push(intervalID);
            });
            // Bind bounding box to each element's mouse over event
            _.addEventListener('mouseenter', () => {
                Main.interval_ID_UpdateBoundingBox_List.forEach(intervalID => {
                    clearInterval(intervalID);
                });
                let intervalID = setInterval(() => {
                    // Update bounding box size and location
                    $('#bounding-box-mouseover').css('width', String(shape.size) + 'px');
                    $('#bounding-box-mouseover').css('height', String(shape.size) + 'px');
                    $('#bounding-box-mouseover').css('bottom', String(((shape.position[1] + 1) / 2) * Config.config.CANVAS_HEIGHT - shape.size / 2 + difY) + 'px');
                    $('#bounding-box-mouseover').css('left', String(((shape.position[0] + 1) / 2) * Config.config.CANVAS_WIDTH - shape.size / 2 + difX) + 'px');
                }, 0);
                Main.interval_ID_UpdateBoundingBox_List.push(intervalID);
            });
            _.id = String(shape.id);
            $('#objects-list').append(_);
            $(`#${shape.id}`).addClass('objects-list-item');
        }
    });
}
