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
            body = Bodies.circle(x, y, 87, {
              angle,
              render: {
                sprite: {
                  texture: svgToDataUrl(shapes.circle, color),
                  xScale: 1,
                  yScale: 1,
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
            }
            break;
          case "halfCircle":
            if (halfCircleVertices) {
              body = Bodies.fromVertices(x, y, [halfCircleVertices], {
                angle,
                render: { fillStyle: color },
              });
            }
            break;
          case "petal":
            if (petalVertices) {
              body = Bodies.fromVertices(x, y, [petalVertices], {
                angle,
                render: { fillStyle: color },
              });
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
    const ground = Bodies.rectangle(
      width / 2,
      height + wallThickness / 2,
      width + wallThickness * 2,
      wallThickness,
      {
        isStatic: true,
        render: { visible: false },
      }
    );
    const leftWall = Bodies.rectangle(
      -wallThickness / 2,
      height / 2,
      wallThickness,
      height + wallThickness * 2,
      {
        isStatic: true,
        render: { visible: false },
      }
    );
    const rightWall = Bodies.rectangle(
      width + wallThickness / 2,
      height / 2,
      wallThickness,
      height + wallThickness * 2,
      {
        isStatic: true,
        render: { visible: false },
      }
    );

    bodies.push(ground, leftWall, rightWall);

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
    mouse.element.removeEventListener("wheel", (mouse as any).mousewheel);

    // run the renderer
    Render.run(this.render);

    // create runner
    this.runner = Runner.create();
    Runner.run(this.runner, this.engine);

    // Add ceiling after delay so objects can fall in first
    setTimeout(() => {
      if (!this.engine) return;
      const ceiling = Bodies.rectangle(
        width / 2,
        -wallThickness / 2,
        width + wallThickness * 2,
        wallThickness,
        {
          isStatic: true,
          render: { visible: false },
        }
      );
      Composite.add(this.engine.world, ceiling);
    }, 1500);

    // Debug UI
    if (
      this.options.debug ||
      new URLSearchParams(window.location.search).has("debug")
    ) {
      this.createDebugUI();
    }

    return true;
  }

  destroy(): void {
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
