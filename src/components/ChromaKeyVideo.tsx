import { useEffect, useRef, type CSSProperties, type HTMLAttributes } from 'react';
type RGB = [number, number, number];

export interface ChromaKeyVideoProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    src: string;

    /**
     * Color to key out. Hex (#00ff00) or [r,g,b]. Defaults to pure green.
     */
    keyColor?: string | RGB;

    /**
     * Distance from keyColor at which pixels become fully transparent (0-255).
     */
    threshold?: number;

    /**
     * Soft-edge width above threshold for partial transparency (0-255).
     */
    smoothness?: number;

    /**
     * Subtract spill of the key color from surviving pixels (0-1).
     */
    spillSuppression?: number;

    /**
     * Pixels to crop from each edge of the video before keying. Hides decoder
     * padding / macroblock artifacts that some browsers expose on video→texture
     * uploads. Default 2.
     */
    edgeInset?: number;

    /**
     * Shrinks the matte inward by sampling neighboring pixels and taking the
     * minimum alpha. Removes key-color fringes around the subject. 0-1.
     */
    choke?: number;

    /**
     * Softens matte edges by averaging alpha over a 3x3 neighborhood. Makes
     * hair and fine detail look natural instead of hard-cut. 0-1.
     */
    feather?: number;

    width?: number | string;
    height?: number | string;
    style?: CSSProperties;
}

/**
 * Takes a color in hex format (#00ff00) or as an [r,g,b] array and returns it as an [r,g,b] array.
 * @param color the color to parse, either as a hex string or an RGB array
 * @returns the parsed color as an [r,g,b] array with values from 0 to 255
 */
function parseColor(color: string | RGB): RGB {
    if (Array.isArray(color))
        return color;

    let hex = color.trim().replace(/^#/, '');
    if (hex.length === 3)
        hex = hex.split('').map((digit) => digit + digit).join('');

    const intValue = parseInt(hex, 16);
    return [(intValue >> 16) & 255, (intValue >> 8) & 255, intValue & 255];
}

const VERTEX_SHADER_SOURCE = `
    attribute vec2 a_vertexPosition;
    varying vec2 v_textureCoord;

    void main() {
        v_textureCoord = vec2((a_vertexPosition.x + 1.0) * 0.5, 1.0 - (a_vertexPosition.y + 1.0) * 0.5);
        gl_Position = vec4(a_vertexPosition, 0.0, 1.0);
    }
`;

const FRAGMENT_SHADER_SOURCE = `
    precision mediump float;
    varying vec2 v_textureCoord;
    uniform sampler2D u_videoTexture;
    uniform vec3 u_keyColor;
    uniform float u_clipBlack;
    uniform float u_clipWhite;
    uniform float u_spillSuppression;
    uniform vec2 u_textureInset;
    uniform vec2 u_texelSize;
    uniform float u_choke;
    uniform float u_feather;

    // BT.601 RGB -> chrominance (Cb, Cr). Used for saturated keys (green/blue)
    // so shadows on the subject aren't matched as "close to dark green".
    vec2 rgbToChroma(vec3 rgb) {
        float luma = dot(rgb, vec3(0.299, 0.587, 0.114));
        return vec2((rgb.b - luma) * 0.564, (rgb.r - luma) * 0.713);
    }

    // Hybrid metric: chroma-distance for saturated keys, RGB-distance for
    // near-neutral keys (chroma-distance is useless when the key has no
    // chroma signature, e.g. gray). Blended by key vibrance.
    float keyDistance(vec3 rgb, vec2 keyChroma, float keyVibrance) {
        float rgbDist = distance(rgb, u_keyColor);
        // Scale chroma into roughly RGB-distance range so threshold semantics
        // stay consistent across key types.
        float chromaDist = distance(rgbToChroma(rgb), keyChroma) * 2.0;
        return mix(rgbDist, chromaDist, keyVibrance);
    }

    float matteAlpha(vec3 rgb, vec2 keyChroma, float keyVibrance) {
        return smoothstep(u_clipBlack, u_clipWhite, keyDistance(rgb, keyChroma, keyVibrance));
    }

    void main() {
        vec2 insetCoord = u_textureInset + v_textureCoord * (1.0 - 2.0 * u_textureInset);
        vec2 keyChroma = rgbToChroma(u_keyColor);
        float keyVibrance = max(max(u_keyColor.r, u_keyColor.g), u_keyColor.b)
                          - min(min(u_keyColor.r, u_keyColor.g), u_keyColor.b);
        vec4 centerSample = texture2D(u_videoTexture, insetCoord);
        float alpha = matteAlpha(centerSample.rgb, keyChroma, keyVibrance);

        // 3x3 neighborhood lets us erode (choke) the matte to kill the key-color
        // halo and average alpha (feather) to soften hair/edges. Coherent
        // uniform branch, so GPUs skip the taps when both are zero.
        if (u_choke > 0.0 || u_feather > 0.0) {
            vec2 dx = vec2(u_texelSize.x, 0.0);
            vec2 dy = vec2(0.0, u_texelSize.y);
            float aN  = matteAlpha(texture2D(u_videoTexture, insetCoord - dy).rgb,       keyChroma, keyVibrance);
            float aS  = matteAlpha(texture2D(u_videoTexture, insetCoord + dy).rgb,       keyChroma, keyVibrance);
            float aE  = matteAlpha(texture2D(u_videoTexture, insetCoord + dx).rgb,       keyChroma, keyVibrance);
            float aW  = matteAlpha(texture2D(u_videoTexture, insetCoord - dx).rgb,       keyChroma, keyVibrance);
            float aNE = matteAlpha(texture2D(u_videoTexture, insetCoord + dx - dy).rgb,  keyChroma, keyVibrance);
            float aNW = matteAlpha(texture2D(u_videoTexture, insetCoord - dx - dy).rgb,  keyChroma, keyVibrance);
            float aSE = matteAlpha(texture2D(u_videoTexture, insetCoord + dx + dy).rgb,  keyChroma, keyVibrance);
            float aSW = matteAlpha(texture2D(u_videoTexture, insetCoord - dx + dy).rgb,  keyChroma, keyVibrance);

            float choked = min(min(min(aN, aS), min(aE, aW)), alpha);
            alpha = mix(alpha, choked, u_choke);

            float blurred = (alpha * 4.0
                + (aN + aS + aE + aW) * 2.0
                + aNE + aNW + aSE + aSW) / 16.0;
            alpha = mix(alpha, blurred, u_feather);
        }

        // Desaturate the key channel where it exceeds the other two, killing
        // colored light bouncing off the screen onto the subject.
        vec3 rgb = centerSample.rgb;
        float redBlueAvg = (rgb.r + rgb.b) * 0.5;
        if (rgb.g > redBlueAvg) {
            rgb.g = mix(rgb.g, redBlueAvg, u_spillSuppression);
        }

        gl_FragColor = vec4(rgb, alpha * centerSample.a);
    }
`;

/**
 * Creates a shader of the given type (vertex or fragment) with the provided source code.
 * @param glContext the WebGL context to use for shader creation
 * @param type the type of shader to create (glContext.VERTEX_SHADER or glContext.FRAGMENT_SHADER)
 * @param source the GLSL source code for the shader
 * @returns the created WebGLShader, or null if creation or compilation failed
 */
function createShader(glContext: WebGLRenderingContext, type: number, source: string) {
    const shader = glContext.createShader(type);
    if (!shader) return null;
    glContext.shaderSource(shader, source);
    glContext.compileShader(shader);
    if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
        glContext.deleteShader(shader);
        return null;
    }
    return shader;
}

/**
 * Tries to create a WebGL program with the provided vertex and fragment shaders.
 * @param glContext the WebGL context to use for program creation
 * @returns the created WebGLProgram, or null if creation failed
 */
function createProgram(glContext: WebGLRenderingContext) {
    const vertexShader = createShader(glContext, glContext.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const fragmentShader = createShader(glContext, glContext.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
    if (!vertexShader || !fragmentShader) return null;
    const program = glContext.createProgram();
    if (!program) return null;
    glContext.attachShader(program, vertexShader);
    glContext.attachShader(program, fragmentShader);
    glContext.linkProgram(program);
    if (!glContext.getProgramParameter(program, glContext.LINK_STATUS)) {
        glContext.deleteProgram(program);
        return null;
    }
    return program;
}

/**
 * A React component that renders a video with chroma keying (green screen) applied. It uses WebGL for efficient real-time processing, and falls back to canvas 2D if WebGL is not available.
 * The component takes various props to configure the chroma keying effect, such as the key color, threshold, smoothness, spill suppression, and edge inset.
 */
export function ChromaKeyVideo({ src, keyColor = '#00ff00', threshold = 80, smoothness = 40, spillSuppression = 0.5, edgeInset = 2, choke = 0, feather = 0, width, height, style, ...otherProperties }: ChromaKeyVideoProps) {
    const containerReference = useRef<HTMLDivElement>(null);
    const canvasReference = useRef<HTMLCanvasElement>(null);

    const parametersReference = useRef({
        keyColor,
        threshold,
        smoothness,
        spillSuppression,
        edgeInset,
        choke,
        feather,
    });

    parametersReference.current = {
        keyColor,
        threshold,
        smoothness,
        spillSuppression,
        edgeInset,
        choke,
        feather,
    };

    useEffect(() => {
        const container = containerReference.current;
        const canvas = canvasReference.current;
        if (!container || !canvas) return;

        const video = document.createElement('video');

        video.src = src;
        video.crossOrigin = 'anonymous';
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.autoplay = true;

        let animationFrameId = 0;
        let stopped = false;

        const resize = () => {
            const devicePixelRatio = window.devicePixelRatio || 1;
            const { width: cssWidth, height: cssHeight } = container.getBoundingClientRect();
            const pixelWidth = Math.max(1, Math.round(cssWidth * devicePixelRatio));
            const pixelHeight = Math.max(1, Math.round(cssHeight * devicePixelRatio));
            if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
            if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
        };

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(container);
        resize();

        const glContext = (
            canvas.getContext('webgl', { premultipliedAlpha: false, antialias: true }) ||
                canvas.getContext('experimental-webgl', {
                    premultipliedAlpha: false,
                }
            )
        ) as WebGLRenderingContext | null;

        let render: (() => void) | null = null;
        let cleanup: () => void = () => {};

        /**
         * Initializes WebGL resources and sets up the rendering loop if WebGL is available. If WebGL initialization fails, 
         * it falls back to a canvas 2D implementation for chroma keying.
         */
        if (glContext) {
            const program = createProgram(glContext);

            if (program) {
                const vertexBuffer = glContext.createBuffer();
                glContext.bindBuffer(glContext.ARRAY_BUFFER, vertexBuffer);
                glContext.bufferData(
                    glContext.ARRAY_BUFFER,
                    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
                    glContext.STATIC_DRAW,
                );

                const texture = glContext.createTexture();
                glContext.bindTexture(glContext.TEXTURE_2D, texture);
                glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_S, glContext.CLAMP_TO_EDGE);
                glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_T, glContext.CLAMP_TO_EDGE);
                glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.LINEAR);
                glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, glContext.LINEAR);

                const attribPosition = glContext.getAttribLocation(program, 'a_vertexPosition');
                const uniformKey = glContext.getUniformLocation(program, 'u_keyColor');
                const uniformClipBlack = glContext.getUniformLocation(program, 'u_clipBlack');
                const uniformClipWhite = glContext.getUniformLocation(program, 'u_clipWhite');
                const uniformSpill = glContext.getUniformLocation(program, 'u_spillSuppression');
                const uniformInset = glContext.getUniformLocation(program, 'u_textureInset');
                const uniformTexelSize = glContext.getUniformLocation(program, 'u_texelSize');
                const uniformChoke = glContext.getUniformLocation(program, 'u_choke');
                const uniformFeather = glContext.getUniformLocation(program, 'u_feather');

                glContext.useProgram(program);
                glContext.enableVertexAttribArray(attribPosition);
                glContext.vertexAttribPointer(attribPosition, 2, glContext.FLOAT, false, 0, 0);
                glContext.enable(glContext.BLEND);
                glContext.blendFunc(glContext.SRC_ALPHA, glContext.ONE_MINUS_SRC_ALPHA);

                render = () => {
                    if (stopped) return;
                    animationFrameId = requestAnimationFrame(render!);
                    if (video.readyState < 2 || !video.videoWidth) return;
                    
                    const {
                        keyColor: currentKeyColor,
                        threshold: currentThreshold,
                        smoothness: currentSmoothness,
                        spillSuppression: currentSpillSuppression,
                        edgeInset: currentEdgeInset,
                        choke: currentChoke,
                        feather: currentFeather,
                    } = parametersReference.current;

                    const [keyRed, keyGreen, keyBlue] = parseColor(currentKeyColor);

                    glContext.bindTexture(glContext.TEXTURE_2D, texture);
                    glContext.texImage2D(
                        glContext.TEXTURE_2D,
                        0,
                        glContext.RGBA,
                        glContext.RGBA,
                        glContext.UNSIGNED_BYTE,
                        video,
                    );

                    // 441.6729 = sqrt(3)*255, the max possible RGB Euclidean
                    // distance in shader (0..1) space. Keeps threshold prop
                    // semantics consistent with the original RGB metric.
                    const clipBlack = currentThreshold / 441.6729;
                    const clipWhite = clipBlack + Math.max(currentSmoothness / 441.6729, 0.0001);

                    glContext.uniform3f(uniformKey, keyRed / 255, keyGreen / 255, keyBlue / 255);
                    glContext.uniform1f(uniformClipBlack, clipBlack);
                    glContext.uniform1f(uniformClipWhite, clipWhite);
                    glContext.uniform1f(uniformSpill, currentSpillSuppression);
                    glContext.uniform1f(uniformChoke, currentChoke);
                    glContext.uniform1f(uniformFeather, currentFeather);

                    glContext.uniform2f(
                        uniformInset,
                        currentEdgeInset / video.videoWidth,
                        currentEdgeInset / video.videoHeight,
                    );
                    glContext.uniform2f(
                        uniformTexelSize,
                        1 / video.videoWidth,
                        1 / video.videoHeight,
                    );

                    glContext.viewport(0, 0, canvas.width, canvas.height);
                    glContext.clearColor(0, 0, 0, 0);
                    glContext.clear(glContext.COLOR_BUFFER_BIT);
                    glContext.drawArrays(glContext.TRIANGLE_STRIP, 0, 4);
                };

                cleanup = () => {
                    glContext.deleteBuffer(vertexBuffer);
                    glContext.deleteTexture(texture);
                    glContext.deleteProgram(program);
                };
            }
        }

        /**
         * If WebGL initialization failed, sets up a rendering loop using canvas 2D context to perform chroma keying. 
         * This is less efficient than the WebGL version, but ensures compatibility with environments where WebGL is not 
         * available or fails to initialize.
         */
        if (!render) {
            const canvasContext = canvas.getContext('2d', { willReadFrequently: true });
            const workCanvas = document.createElement('canvas');
            const workContext = workCanvas.getContext('2d', { willReadFrequently: true });
            if (!canvasContext || !workContext) return;

            render = () => {
                if (stopped) return;
                animationFrameId = requestAnimationFrame(render!);
                if (video.readyState < 2 || !video.videoWidth) return;
                if (workCanvas.width !== video.videoWidth) workCanvas.width = video.videoWidth;
                if (workCanvas.height !== video.videoHeight) workCanvas.height = video.videoHeight;

                const {
                    keyColor: currentKeyColor,
                    threshold: currentThreshold,
                    smoothness: currentSmoothness,
                    spillSuppression: currentSpillSuppression,
                    edgeInset: currentEdgeInset,
                } = parametersReference.current;
                
                const [keyRed, keyGreen, keyBlue] = parseColor(currentKeyColor);

                const sourceX = Math.min(currentEdgeInset, video.videoWidth / 2);
                const sourceY = Math.min(currentEdgeInset, video.videoHeight / 2);
                workContext.clearRect(0, 0, workCanvas.width, workCanvas.height);
                workContext.drawImage(
                    video,
                    sourceX,
                    sourceY,
                    video.videoWidth - sourceX * 2,
                    video.videoHeight - sourceY * 2,
                    0,
                    0,
                    workCanvas.width,
                    workCanvas.height,
                );

                const frame = workContext.getImageData(0, 0, workCanvas.width, workCanvas.height);
                const pixels = frame.data;
                const softness = Math.max(1, currentSmoothness);

                for (let pixelIndex = 0; pixelIndex < pixels.length; pixelIndex += 4) {
                    const red = pixels[pixelIndex];
                    const green = pixels[pixelIndex + 1];
                    const blue = pixels[pixelIndex + 2];
                    const deltaRed = red - keyRed;
                    const deltaGreen = green - keyGreen;
                    const deltaBlue = blue - keyBlue;
                    const distance = Math.sqrt(
                        deltaRed * deltaRed + deltaGreen * deltaGreen + deltaBlue * deltaBlue,
                    );

                    if (distance < currentThreshold) {
                        pixels[pixelIndex + 3] = 0;
                    } else if (distance < currentThreshold + softness) {
                        pixels[pixelIndex + 3] = Math.round(((distance - currentThreshold) / softness) * 255);
                    }
                    
                    if (currentSpillSuppression > 0) {
                        const averageRedBlue = (red + blue) * 0.5;
                        if (green > averageRedBlue) {
                            pixels[pixelIndex + 1] = Math.round(
                                green - (green - averageRedBlue) * currentSpillSuppression,
                            );
                        }
                    }
                }

                workContext.putImageData(frame, 0, 0);
                canvasContext.clearRect(0, 0, canvas.width, canvas.height);
                canvasContext.drawImage(workCanvas, 0, 0, canvas.width, canvas.height);
            };
        }

        const start = () => {
            void video.play().catch(() => { });
            animationFrameId = requestAnimationFrame(render);
        };

        if (video.readyState >= 2) start();
        else video.addEventListener('loadeddata', start, { once: true });

        /**
         * Cleanup function to stop the video, cancel animation frames, disconnect observers, and release resources when the 
         * component unmounts or the source changes.
         */
        return () => {
            stopped = true;
            cancelAnimationFrame(animationFrameId);
            resizeObserver.disconnect();
            video.pause();
            video.removeAttribute('src');
            video.load();
            cleanup();
        };
    }, [src]);

    return (
        <div ref={containerReference} style={{ width, height, display: 'inline-block', ...style }} {...otherProperties}>
            <canvas ref={canvasReference} style={{ width: '100%', height: '100%', display: 'block' }} />
        </div>
    );
}

export default ChromaKeyVideo;
