/*
* THESHOVEL & SHARKPOOL MAINTAIN THIS SO I DONT GIVE A SHITTT BUG REPORTS GO TO SHARKPOOL BTW!!
* Created by SharkPool & TheShovel.
* Do not remove this comment
*/
(function (Scratch) {
    'use strict';
    if (!Scratch.extensions.unsandboxed) {
        throw new Error('This canvasEffects must run unsandboxed');
    }

    const canvas = Scratch.renderer.canvas;
    const vm = Scratch.vm;

    const updateStyle = () => {
        const filter = `blur(${blur}px) contrast(${contrast / 100}) saturate(${saturation}%) hue-rotate(${color}deg) brightness(${brightness}%) invert(${invert}%) grayscale(${grayscale}%) sepia(${sepia}%) opacity(${opacity}%)`;
        if (canvas.style.filter !== filter) {
            canvas.style.filter = filter;
        }
        const imageRendering = resizeMode === 'pixelated' ? 'pixelated' : '';
        if (canvas.style.imageRendering !== imageRendering) {
            canvas.style.imageRendering = imageRendering;
        }
    };

    new MutationObserver(updateStyle).observe(canvas, {
        attributeFilter: ['style'],
        attributes: true,
    });

    let blur = 0;
    let contrast = 100;
    let saturation = 100;
    let color = 0;
    let brightness = 100;
    let invert = 0;
    let grayscale = 0;
    let sepia = 0;
    let opacity = 100;
    let resizeMode = 'default';
    let glitchTimer = null;
    let isGlitchActive = false;

    class CanvasEffects {
        getInfo() {
            return {
                id: 'theshovelcanvaseffectsv2',
                name: 'Canvas Effects V2',
                blocks: [{
                        opcode: 'seteffect',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set canvas [EFFECT] to [NUMBER]',
                        arguments: {
                            EFFECT: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'EFFECTMENU',
                            },
                            NUMBER: {
                                type: Scratch.ArgumentType.NUMBER,
                            },
                        },
                    }, {
                        opcode: 'changeeffect',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'change canvas [EFFECT] by [NUMBER]',
                        arguments: {
                            EFFECT: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'EFFECTMENU',
                            },
                            NUMBER: {
                                type: Scratch.ArgumentType.NUMBER,
                            },
                        }
                    }, {
                        opcode: 'geteffect',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get canvas [EFFECT]',
                        arguments: {
                            EFFECT: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'EFFECTGETMENU',
                            },
                        },
                    }, {
                    opcode: 'cleareffects',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'clear canvas effects',
                    }, {
                        opcode: 'renderscale',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set canvas render size to width:[X] height:[Y]',
                        arguments: {
                            X: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 100,
                            },
                            Y: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 100,
                            },
                        },
                    }, {
                        opcode: 'setrendermode',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set canvas resize rendering mode [EFFECT]',
                        arguments: {
                            EFFECT: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'RENDERMODE',
                            },
                        },
                    }, {
                        opcode: 'glitch',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'start canvas glitch',
                    }, {
                        opcode: 'stopglitch',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'stop canvas glitch',
                    }
                ],
                menus: {
                    EFFECTMENU: {
                        acceptReporters: true,
                        items: ['blur', 'contrast', 'saturation', 'brightness', 'invert', 'grayscale', 'sepia', 'opacity'],
                    },
                    RENDERMODE: {
                        acceptReporters: true,
                        items: ['pixelated', 'default'],
                    },
                    EFFECTGETMENU: {
                        acceptReporters: true,
                        items: ['blur', 'contrast', 'saturation', 'brightness', 'invert', 'grayscale', 'sepia', 'opacity', 'resize rendering mode'],
                    },
                }
            };
        }

        geteffect({ EFFECT }) {
            switch (EFFECT) {
                case 'blur':
                    return blur;
                case 'contrast':
                    return contrast;
                case 'saturation':
                    return saturation;
                case 'brightness':
                    return brightness;
                case 'invert':
                    return invert;
                case 'grayscale':
                    return grayscale;
                case 'sepia':
                    return sepia;
                case 'opacity':
                    return opacity;
                case 'resize rendering mode':
                    return resizeMode;
                default:
                    return;
            }
        }

        seteffect({ EFFECT, NUMBER }) {
            switch (EFFECT) {
                case 'blur':
                    blur = NUMBER;
                    break;
                case 'contrast':
                    contrast = NUMBER;
                    break;
                case 'saturation':
                    saturation = NUMBER;
                    break;
                case 'brightness':
                    brightness = NUMBER;
                    break;
                case 'invert':
                    invert = NUMBER;
                    break;
                case 'grayscale':
                    grayscale = NUMBER;
                    break;
                case 'sepia':
                    sepia = NUMBER;
                    break;
                case 'opacity':
                    opacity = NUMBER;
                    break;
                default:
                    return;
            }
            updateStyle();
        }

        changeeffect({ EFFECT, NUMBER }) {
                switch (EFFECT) {
                    case 'blur':
                        blur += NUMBER;
                        break;
                    case 'contrast':
                        contrast += NUMBER;
                        break;
                    case 'saturation':
                        saturation += NUMBER;
                        break;
                    case 'brightness':
                        brightness += NUMBER;
                        break;
                    case 'invert':
                        invert += NUMBER;
                        break;
                    case 'grayscale':
                        grayscale += NUMBER;
                        break;
                    case 'sepia':
                        sepia += NUMBER;
                        break;
                    case 'opacity':
                        opacity += NUMBER;
                        break;
                    default:
                        break;
                }
                updateStyle();
            }

            cleareffects() {
                blur = 0;
                contrast = 100;
                saturation = 100;
                color = 0;
                brightness = 100;
                invert = 0;
                grayscale = 0;
                sepia = 0;
                opacity = 100;
                resizeMode = 'default';
                updateStyle();
            }

            setrendermode({ EFFECT }) {
                resizeMode = EFFECT;
                updateStyle();
            }

            renderscale({ X, Y }) {
                vm.renderer.resize(X, Y);
            }

            glitch() {
                if (!isGlitchActive) {
                    isGlitchActive = true;
                    this.glitchRandomize();
                }
            }

            stopglitch() {
                if (isGlitchActive) {
                    isGlitchActive = false;
                    clearTimeout(glitchTimer);
                    glitchTimer = null;
                }
            }

            glitchRandomize() {
                if (!isGlitchActive) {
                    return;
                }
                contrast = Math.max(Math.floor(Math.random() * 101) + 100, 100);
                saturation = Math.floor(Math.random() * 251);
                const width = Math.floor(Math.random() * (100 - 50 + 1)) + 50;
                const height = Math.floor(Math.random() * (100 - 5 + 1)) + 5;
                Scratch.vm.renderer.resize(width, height);
                updateStyle();
                glitchTimer = setTimeout(() => {
                    this.glitchRandomize();
                }, 50);
            }
        }
    Scratch.extensions.register(new CanvasEffects());
})(Scratch);