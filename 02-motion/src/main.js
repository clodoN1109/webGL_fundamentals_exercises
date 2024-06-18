"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.canvas = exports.motionDemonstration = exports.animationStatus = exports.animationID = exports.interval_ID_UpdateBoundingBox_List = exports.interval_ID_UpdateParametersDisplay_List = void 0;
const utils = __importStar(require("./utils.js"));
const config_js_1 = require("./config.js");
const Shapes = __importStar(require("./shapes.js"));
const Colors = __importStar(require("./colors.js"));
const Controls = __importStar(require("./controls.js"));
const Objects = __importStar(require("./objects.js"));
//---------------------------------------------------------------------------------
// Initializing variables and caches
Controls.initialize();
exports.interval_ID_UpdateParametersDisplay_List = [];
exports.interval_ID_UpdateBoundingBox_List = [];
exports.animationID = NaN;
exports.animationStatus = ['play'];
//---------------------------------------------------------------------------------
function motionDemonstration(width, height, canvas) {
    let webGL2 = canvas.getContext('webgl2');
    //---------------------------------------------------------------------------------
    // Loading GLSL source code and creating a webGL program
    const vertexShaderSourceCode = utils.stringfyGLSL('../src/vertexShader');
    const fragmentShaderSourceCode = utils.stringfyGLSL('../src/fragmentShader');
    const webGL2TriangleProgram = utils.createProgram(webGL2, vertexShaderSourceCode, fragmentShaderSourceCode);
    //---------------------------------------------------------------------------------
    // Getting references to program attributes/variables 
    const vertexPositionAttributeLocation = webGL2.getAttribLocation(webGL2TriangleProgram, 'vertexPosition');
    const shapeSizeUniform = webGL2.getUniformLocation(webGL2TriangleProgram, 'shapeSize');
    const shapeLocationUniform = webGL2.getUniformLocation(webGL2TriangleProgram, 'shapeLocation');
    const canvasSizeUniform = webGL2.getUniformLocation(webGL2TriangleProgram, 'canvasSize');
    const vertexColorAttributeLocation = webGL2.getAttribLocation(webGL2TriangleProgram, 'vertexColor');
    //---------------------------------------------------------------------------------
    // Creating buffers
    // Vertex/position buffers
    const triangleGeometryBuffer = utils.createStaticVertexBuffer(webGL2, Shapes.triangleVertices);
    const rgbColorBuffer = utils.createStaticVertexBuffer(webGL2, Colors.rgbTriangleColors);
    const fireyColorBuffer = utils.createStaticVertexBuffer(webGL2, Colors.fireyTriangleColors);
    // Color buffers
    const squareGeometryBuffer = utils.createStaticVertexBuffer(webGL2, Shapes.squareVertices);
    const indigoGradientSquareColorsBuffer = utils.createStaticVertexBuffer(webGL2, Colors.indigoGradientSquareColors);
    const graySquareColorsBuffer = utils.createStaticVertexBuffer(webGL2, Colors.graySquareColors);
    // Vertex/position-color interleaved buffer
    const circleInterleaveBuffer = utils.createStaticVertexBuffer(webGL2, Shapes.circleVertices);
    //---------------------------------------------------------------------------------
    // Creating VAOs (Vertex Attribute Objects)
    const fireyTriangleVertexAttributeObject = utils.createTwoBufferVertexAttributeObject(webGL2, triangleGeometryBuffer, fireyColorBuffer, vertexPositionAttributeLocation, vertexColorAttributeLocation);
    const rgbTriangleVertexAttributeObject = utils.createTwoBufferVertexAttributeObject(webGL2, triangleGeometryBuffer, rgbColorBuffer, vertexPositionAttributeLocation, vertexColorAttributeLocation);
    const indigoSquareVertexAttributeObject = utils.createTwoBufferVertexAttributeObject(webGL2, squareGeometryBuffer, indigoGradientSquareColorsBuffer, vertexPositionAttributeLocation, vertexColorAttributeLocation);
    const graySquareVertexAttributeObject = utils.createTwoBufferVertexAttributeObject(webGL2, squareGeometryBuffer, graySquareColorsBuffer, vertexPositionAttributeLocation, vertexColorAttributeLocation);
    const circleVertexAttributeObject = utils.createInterleaveBufferVertexAttributeObject(webGL2, circleInterleaveBuffer, vertexPositionAttributeLocation, vertexColorAttributeLocation);
    const VAOList = [
        { vao: rgbTriangleVertexAttributeObject, numVertices: 3, type: 'RGB Triangle' },
        { vao: fireyTriangleVertexAttributeObject, numVertices: 3, type: 'Firey Triangle' },
        { vao: indigoSquareVertexAttributeObject, numVertices: 6, type: 'Indigo Square' },
        { vao: graySquareVertexAttributeObject, numVertices: 6, type: 'Gray Square' },
        { vao: circleVertexAttributeObject, numVertices: config_js_1.config.CIRCLE_SEGMENT_COUNT * 3, type: 'Spectral Circle' },
    ];
    let x = rgbTriangleVertexAttributeObject;
    //---------------------------------------------------------------------------------
    let shapes = [];
    let timetoNextSpawn = config_js_1.config.SPAWN_TIME;
    let lastFrameTime = performance.now();
    let frame = function () {
        const thisFrameTime = performance.now();
        // Time interval in seconds
        let dt = (thisFrameTime - lastFrameTime) / 1000;
        if (exports.animationStatus[0] === 'paused') {
            dt = 0;
        }
        timetoNextSpawn -= dt;
        // The loop makes the spawn time more independent from the browser's framerate. A feature to be further analyzed.
        while (timetoNextSpawn < 0) {
            timetoNextSpawn += config_js_1.config.SPAWN_TIME;
            let [position, velocity, size, timeRemaining, vao, numVertices, force, type] = utils.generateNewShapeParameters(VAOList);
            let new_id = utils.getRandomIntegerInRange(1, 10000);
            if (shapes.length < config_js_1.config.MAX_SHAPE_COUNT) {
                shapes.push(new Objects.MovingShape(position, velocity, size, timeRemaining, vao, numVertices, force, new_id, type));
            }
        }
        // Imposing object count and lifespan limits
        utils.updateObjectExplorer(shapes);
        shapes = shapes.filter((shape) => shape.isAlive());
        lastFrameTime = thisFrameTime;
        shapes.forEach(shape => {
            shape.update(dt);
        });
        canvas.width = width;
        canvas.height = height;
        webGL2.clearColor(0.2, 0.2, 0.1, 0);
        webGL2.clear(webGL2.COLOR_BUFFER_BIT | webGL2.DEPTH_BUFFER_BIT);
        webGL2.viewport(0, 0, canvas.width, canvas.height);
        webGL2.useProgram(webGL2TriangleProgram);
        //---------------------------------------------------------------------------------
        shapes.forEach(shape => {
            webGL2.bindVertexArray(shape.vao);
            webGL2.uniform2f(canvasSizeUniform, canvas.width, canvas.height);
            webGL2.uniform1f(shapeSizeUniform, shape.size);
            webGL2.uniform2f(shapeLocationUniform, shape.position[0], shape.position[1]);
            webGL2.drawArrays(webGL2.TRIANGLES, 0, shape.numVertices);
        });
        //---------------------------------------------------------------------------------
        exports.animationID = requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
}
exports.motionDemonstration = motionDemonstration;
exports.canvas = document.getElementById('demo-canvas');
try {
    motionDemonstration(window.innerWidth, window.innerHeight, exports.canvas);
}
catch (e) {
    utils.showError(`Uncaught exception: ${e}`);
}