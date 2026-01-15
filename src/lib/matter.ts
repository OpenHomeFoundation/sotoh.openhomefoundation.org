import "pathseg";
import { shapes } from "./shapes";
import Matter from "matter-js";

const {
  Engine,
  Render,
  Runner,
  Bodies,
  Composite,
  Mouse,
  MouseConstraint,
  Svg,
} = Matter;

// Color palette for shapes
const colors = ["#D655EC", "#8B26FF", "#FFD351"];

// Get random color from palette
function getRandomColor(): string {
  return colors[Math.floor(Math.random() * colors.length)];
}

// Replace fill color in SVG string
function recolorSvg(svgString: string, color: string): string {
  return svgString.replace(/fill="#[A-Fa-f0-9]{6}"/, `fill="${color}"`);
}

// Convert SVG string to data URL for sprite rendering
function svgToDataUrl(svgString: string, color?: string): string {
  const svg = color ? recolorSvg(svgString, color) : svgString;
  const encoded = encodeURIComponent(svg);
  return `data:image/svg+xml,${encoded}`;
}

// Parse SVG path to get exact vertices
function getSvgVertices(svgString: string, sampleLength: number = 15) {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
  const path = svgDoc.querySelector("path");
  if (!path) return null;
  return Svg.pathToVertices(path, sampleLength);
}

export interface MatterSceneOptions {
  containerId?: string;
  gravity?: number;
  debug?: boolean;
}

export class MatterScene {
  private container: HTMLElement | null = null;
  private engine: Matter.Engine | null = null;
  private render: Matter.Render | null = null;
  private runner: Matter.Runner | null = null;
  private options: MatterSceneOptions;
  private walls: {
    ground: Matter.Body | null;
    leftWall: Matter.Body | null;
    rightWall: Matter.Body | null;
    ceiling: Matter.Body | null;
  } = { ground: null, leftWall: null, rightWall: null, ceiling: null };
  private resizeHandler: (() => void) | null = null;
  private resizeTimeout: ReturnType<typeof setTimeout> | null = null;
  private gyroHandler: ((event: DeviceOrientationEvent) => void) | null = null;
  private gyroEnabled: boolean = false;

  constructor(options: MatterSceneOptions = {}) {
    this.options = {
      containerId: "matter-container",
      gravity: 2,
      debug: false,
      ...options,
    };
  }

  init(): boolean {
    this.container = document.getElementById(this.options.containerId!);
    if (!this.container) return false;

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    // create an engine
    this.engine = Engine.create({
      gravity: { x: 0, y: this.options.gravity! },
    });

    // create a renderer with transparent background
    this.render = Render.create({
      element: this.container,
      engine: this.engine,
      options: {
        width: width,
        height: height,
        wireframes: false,
        background: "transparent",
      },
    });

    // Create bodies
    const bodies: Matter.Body[] = [];

    // Calculate scale factor for mobile (scale down below 768px)
    const baseWidth = 1200;
    const scale = Math.min(1, Math.max(0.5, width / baseWidth));

    // Get vertices for each shape type
    const halfPipeVertices = getSvgVertices(shapes.halfPipe);
    const halfCircleVertices = getSvgVertices(shapes.halfCircle);
    const petalVertices = getSvgVertices(shapes.petal);

    // Helper to get random values
    const randomBetween = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    // Create 5 of each shape type
    const shapeTypes = ["circle", "halfPipe", "halfCircle", "petal"] as const;

    for (const shapeType of shapeTypes) {
      for (let i = 0; i < 5; i++) {
        const color = getRandomColor();
        const x = randomBetween(100, width - 100);
        const y = randomBetween(-600, -100);
        const angle = randomBetween(0, Math.PI * 2);

        let body: Matter.Body | null = null;

        switch (shapeType) {
          case "circle":
            body = Bodies.circle(x, y, 87 * scale, {
              angle,
              render: {
                sprite: {
                  texture: svgToDataUrl(shapes.circle, color),
                  xScale: scale,
                  yScale: scale,
                },
              },
            });
            break;
          case "halfPipe":
            if (halfPipeVertices) {
              body = Bodies.fromVertices(x, y, [halfPipeVertices], {
                angle,
                render: { fillStyle: color },
              });
              if (body && scale !== 1) {
                Matter.Body.scale(body, scale, scale);
              }
            }
            break;
          case "halfCircle":
            if (halfCircleVertices) {
              body = Bodies.fromVertices(x, y, [halfCircleVertices], {
                angle,
                render: { fillStyle: color },
              });
              if (body && scale !== 1) {
                Matter.Body.scale(body, scale, scale);
              }
            }
            break;
          case "petal":
            if (petalVertices) {
              body = Bodies.fromVertices(x, y, [petalVertices], {
                angle,
                render: { fillStyle: color },
              });
              if (body && scale !== 1) {
                Matter.Body.scale(body, scale, scale);
              }
            }
            break;
        }

        if (body) {
          bodies.push(body);
        }
      }
    }

    // Create bounds (invisible walls on all sides)
    const wallThickness = 100;
    this.walls.ground = Bodies.rectangle(
      width / 2,
      height + wallThickness / 2,
      width + wallThickness * 2,
      wallThickness,
      {
        isStatic: true,
        render: { visible: false },
      }
    );
    this.walls.leftWall = Bodies.rectangle(
      -wallThickness / 2,
      height / 2,
      wallThickness,
      height + wallThickness * 2,
      {
        isStatic: true,
        render: { visible: false },
      }
    );
    this.walls.rightWall = Bodies.rectangle(
      width + wallThickness / 2,
      height / 2,
      wallThickness,
      height + wallThickness * 2,
      {
        isStatic: true,
        render: { visible: false },
      }
    );

    bodies.push(this.walls.ground, this.walls.leftWall, this.walls.rightWall);

    // add all bodies to the world
    Composite.add(this.engine.world, bodies);

    // Add mouse control for dragging
    const mouse = Mouse.create(this.render.canvas);
    const mouseConstraint = MouseConstraint.create(this.engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.6,
        render: {
          visible: false,
        },
      },
    });
    Composite.add(this.engine.world, mouseConstraint);

    // Keep mouse in sync with rendering
    this.render.mouse = mouse;

    // Allow page scrolling over the canvas
    mouse.element.removeEventListener("wheel", mouse.mousewheel);

    // run the renderer
    Render.run(this.render);

    // create runner
    this.runner = Runner.create();
    Runner.run(this.runner, this.engine);

    // Add ceiling after delay so objects can fall in first
    setTimeout(() => {
      if (!this.engine) return;
      const currentWidth = this.container?.clientWidth || width;
      this.walls.ceiling = Bodies.rectangle(
        currentWidth / 2,
        -wallThickness / 2,
        currentWidth + wallThickness * 2,
        wallThickness,
        {
          isStatic: true,
          render: { visible: false },
        }
      );
      Composite.add(this.engine.world, this.walls.ceiling);
    }, 1500);

    // Style canvas to cover container absolutely
    this.render.canvas.style.position = "absolute";
    this.render.canvas.style.top = "0";
    this.render.canvas.style.left = "0";
    this.render.canvas.style.width = "100%";
    this.render.canvas.style.height = "100%";
    this.render.canvas.style.pointerEvents = "auto";

    // Set up debounced resize handler
    this.resizeHandler = () => {
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
      }
      this.resizeTimeout = setTimeout(() => this.updateSize(), 100);
    };
    window.addEventListener("resize", this.resizeHandler);

    // Debug UI
    if (
      this.options.debug ||
      new URLSearchParams(window.location.search).has("debug")
    ) {
      this.createDebugUI();
    }

    // Enable gyro control on mobile devices
    this.initGyroControl();

    return true;
  }

  private initGyroControl(): void {
    // Gyro requires secure context (HTTPS)
    if (!window.isSecureContext) return;

    // Check for touch support (mobile device)
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (!hasTouch) return;

    // iOS 13+ requires permission request
    const requestPermission = (
      DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<string>;
      }
    ).requestPermission;

    if (typeof requestPermission === "function") {
      // iOS - need to request permission on user interaction
      const requestGyroPermission = async () => {
        try {
          const permission = await requestPermission();
          if (permission === "granted") {
            this.enableGyro();
          }
        } catch (e) {
          // Permission denied or error
        }
      };
      document.addEventListener("touchstart", requestGyroPermission, {
        once: true,
      });
    } else {
      // Android and other devices - enable directly
      this.enableGyro();
    }
  }

  private enableGyro(): void {
    if (this.gyroEnabled || !this.engine) return;

    this.gyroHandler = (event: DeviceOrientationEvent) => {
      if (!this.engine) return;

      const beta = event.beta;
      const gamma = event.gamma;

      // Skip if no valid data
      if (beta === null || gamma === null) return;

      // Convert device orientation to gravity
      // beta: 0 = flat, 90 = vertical facing user, -90 = vertical facing away
      // gamma: 0 = flat, 90 = tilted right, -90 = tilted left
      const gravityY = Math.sin((beta * Math.PI) / 180) * this.options.gravity!;
      const gravityX =
        Math.sin((gamma * Math.PI) / 180) * this.options.gravity!;

      this.engine.gravity.x = gravityX;
      this.engine.gravity.y = gravityY;
    };

    window.addEventListener("deviceorientation", this.gyroHandler);
    this.gyroEnabled = true;
  }

  private disableGyro(): void {
    if (this.gyroHandler) {
      window.removeEventListener("deviceorientation", this.gyroHandler);
      this.gyroHandler = null;
    }
    this.gyroEnabled = false;
  }

  private updateSize(): void {
    if (!this.container || !this.render || !this.engine) return;

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    const wallThickness = 100;

    // Update canvas size
    this.render.canvas.width = width;
    this.render.canvas.height = height;
    this.render.options.width = width;
    this.render.options.height = height;

    // Remove old walls
    const oldWalls = [
      this.walls.ground,
      this.walls.leftWall,
      this.walls.rightWall,
      this.walls.ceiling,
    ].filter((w): w is Matter.Body => w !== null);

    if (oldWalls.length > 0) {
      Composite.remove(this.engine.world, oldWalls);
    }

    // Create new walls with correct dimensions
    this.walls.ground = Bodies.rectangle(
      width / 2,
      height + wallThickness / 2,
      width + wallThickness * 2,
      wallThickness,
      { isStatic: true, render: { visible: false } }
    );
    this.walls.leftWall = Bodies.rectangle(
      -wallThickness / 2,
      height / 2,
      wallThickness,
      height + wallThickness * 2,
      { isStatic: true, render: { visible: false } }
    );
    this.walls.rightWall = Bodies.rectangle(
      width + wallThickness / 2,
      height / 2,
      wallThickness,
      height + wallThickness * 2,
      { isStatic: true, render: { visible: false } }
    );
    this.walls.ceiling = Bodies.rectangle(
      width / 2,
      -wallThickness / 2,
      width + wallThickness * 2,
      wallThickness,
      { isStatic: true, render: { visible: false } }
    );

    Composite.add(this.engine.world, [
      this.walls.ground,
      this.walls.leftWall,
      this.walls.rightWall,
      this.walls.ceiling,
    ]);
  }

  destroy(): void {
    // Disable gyro control
    this.disableGyro();

    // Remove resize listener and clear timeout
    if (this.resizeHandler) {
      window.removeEventListener("resize", this.resizeHandler);
      this.resizeHandler = null;
    }
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = null;
    }
    if (this.render) {
      Render.stop(this.render);
      this.render.canvas.remove();
      this.render = null;
    }
    if (this.runner) {
      Runner.stop(this.runner);
      this.runner = null;
    }
    if (this.engine) {
      Engine.clear(this.engine);
      this.engine = null;
    }
    // Reset walls references
    this.walls = { ground: null, leftWall: null, rightWall: null, ceiling: null };
    const debugPanel = document.getElementById("matter-debug");
    if (debugPanel) {
      debugPanel.remove();
    }
  }

  private createDebugUI(): void {
    if (!this.render || !this.engine) return;

    const render = this.render;
    const engine = this.engine;

    const panel = document.createElement("div");
    panel.id = "matter-debug";
    panel.innerHTML = `
      <style>
        #matter-debug {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 15px;
          border-radius: 8px;
          font-family: monospace;
          font-size: 12px;
          z-index: 9999;
          min-width: 200px;
        }
        #matter-debug h4 {
          margin: 0 0 10px 0;
          color: #8B26FF;
        }
        #matter-debug label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 8px 0;
          cursor: pointer;
        }
        #matter-debug input[type="checkbox"] {
          cursor: pointer;
        }
        #matter-debug input[type="range"] {
          width: 100%;
          cursor: pointer;
        }
        #matter-debug .slider-group {
          margin: 10px 0;
        }
        #matter-debug .slider-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
        }
        #matter-debug button {
          width: 100%;
          padding: 8px;
          margin-top: 10px;
          background: #8B26FF;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        #matter-debug button:hover {
          background: #7020d9;
        }
      </style>
      <h4>Matter.js Debug</h4>
      <label>
        <input type="checkbox" id="debug-wireframes"> Wireframes
      </label>
      <label>
        <input type="checkbox" id="debug-bounds"> Show Bounds
      </label>
      <label>
        <input type="checkbox" id="debug-collisions"> Show Collisions
      </label>
      <div class="slider-group">
        <div class="slider-label">
          <span>Gravity</span>
          <span id="gravity-value">2</span>
        </div>
        <input type="range" id="debug-gravity" min="0" max="5" step="0.1" value="2">
      </div>
      <button id="debug-reset">Reset Scene</button>
    `;

    document.body.appendChild(panel);

    // Wireframes toggle
    const wireframesCheckbox = document.getElementById(
      "debug-wireframes"
    ) as HTMLInputElement;
    wireframesCheckbox.addEventListener("change", () => {
      render.options.wireframes = wireframesCheckbox.checked;
    });

    // Show bounds toggle
    const boundsCheckbox = document.getElementById(
      "debug-bounds"
    ) as HTMLInputElement;
    boundsCheckbox.addEventListener("change", () => {
      render.options.showBounds = boundsCheckbox.checked;
    });

    // Show collisions toggle
    const collisionsCheckbox = document.getElementById(
      "debug-collisions"
    ) as HTMLInputElement;
    collisionsCheckbox.addEventListener("change", () => {
      render.options.showCollisions = collisionsCheckbox.checked;
    });

    // Gravity slider
    const gravitySlider = document.getElementById(
      "debug-gravity"
    ) as HTMLInputElement;
    const gravityValue = document.getElementById("gravity-value")!;
    gravitySlider.addEventListener("input", () => {
      const value = parseFloat(gravitySlider.value);
      engine.gravity.y = value;
      gravityValue.textContent = value.toFixed(1);
    });

    // Reset button
    const resetButton = document.getElementById("debug-reset")!;
    resetButton.addEventListener("click", () => {
      window.location.reload();
    });
  }
}

// Convenience function for simple initialization
export function initMatter(options?: MatterSceneOptions): MatterScene | null {
  const scene = new MatterScene(options);
  if (scene.init()) {
    return scene;
  }
  return null;
}
