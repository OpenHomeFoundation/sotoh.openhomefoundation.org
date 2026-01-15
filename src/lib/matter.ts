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
  Events,
  Body,
} = Matter;

// Game shape hierarchy (smallest to largest) - 10 levels
// Shapes evolve: petal → petal → circle → circle → halfCircle → halfCircle → halfPipe → halfPipe → circle → circle
const GAME_SHAPES = [
  { type: "petal", color: "#D655EC", size: 0.5 }, // 1. pink petal (tiny)
  { type: "petal", color: "#FF6B6B", size: 0.7 }, // 2. red petal
  { type: "circle", color: "#FFD351", size: 0.65 }, // 3. yellow circle (small)
  { type: "circle", color: "#8B26FF", size: 0.85 }, // 4. purple circle
  { type: "halfCircle", color: "#4ECDC4", size: 1.1 }, // 5. teal halfCircle (bigger)
  { type: "halfCircle", color: "#FF8C42", size: 1.3 }, // 6. orange halfCircle
  { type: "halfPipe", color: "#18BCFF", size: 1.3 }, // 7. cyan halfPipe (bigger)
  { type: "halfPipe", color: "#95E85A", size: 1.5 }, // 8. green halfPipe
  { type: "circle", color: "#FFFFFF", size: 1.7 }, // 9. white circle (huge)
  { type: "circle", color: "#FFD700", size: 2.0 }, // 10. gold circle (final)
] as const;

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

  // Game mode state
  private gameMode: boolean = false;
  private clickCount: number = 0;
  private pendingShape: Matter.Body | null = null;
  private pendingShapeIndex: number = 0;
  private mouseX: number = 0;
  private canDrop: boolean = true;
  private mouseMoveHandler: ((e: MouseEvent) => void) | null = null;
  private dropHandler: ((e: MouseEvent) => void) | null = null;

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

    const maxWidth = 1200;
    const width = Math.min(this.container.clientWidth, maxWidth);
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

    // Color definitions
    const pink = "#D655EC";
    const purple = "#8B26FF";
    const yellow = "#FFD351";

    // Helper to get random values
    const randomBetween = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    // Define specific shapes:
    // 3 purple pipes, 1 yellow pipe, 1 pink circle, 1 purple circle,
    // 3 yellow petals, 1 purple petal, 1 pink petal, 2 pink semicircles
    const shapeList: {
      type: "circle" | "halfPipe" | "halfCircle" | "petal";
      color: string;
    }[] = [
      { type: "halfPipe", color: purple },
      { type: "halfPipe", color: purple },
      { type: "halfPipe", color: purple },
      { type: "halfPipe", color: yellow },
      { type: "circle", color: pink },
      { type: "circle", color: purple },
      { type: "petal", color: yellow },
      { type: "petal", color: yellow },
      { type: "petal", color: yellow },
      { type: "petal", color: purple },
      { type: "petal", color: pink },
      { type: "halfCircle", color: pink },
      { type: "halfCircle", color: pink },
    ];

    for (const { type, color } of shapeList) {
      const x = randomBetween(100, width - 100);
      const y = randomBetween(-600, -100);
      const angle = randomBetween(0, Math.PI * 2);

      let body: Matter.Body | null = null;

      switch (type) {
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

    // Create bounds (invisible walls on all sides)
    const wallThickness = 300;
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

    // Release dragged object when mouse leaves canvas
    this.render.canvas.addEventListener("mouseleave", () => {
      mouse.button = -1;
    });

    // Track clicks on shapes for game mode activation
    Events.on(
      mouseConstraint,
      "mousedown",
      (event: Matter.IEventCollision<Matter.MouseConstraint>) => {
        if (this.gameMode) return;

        // Check if clicking on a body (not walls)
        const body = event.source.body;
        if (body && !body.isStatic) {
          this.clickCount++;
          if (this.clickCount >= 10) {
            this.startGameMode();
          }
        }
      }
    );

    // Allow page scrolling over the canvas
    // @ts-expect-error - mousewheel exists on Mouse but not in types
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

    // Style canvas to be centered with max-width
    this.render.canvas.style.position = "absolute";
    this.render.canvas.style.top = "0";
    this.render.canvas.style.left = "50%";
    this.render.canvas.style.transform = "translateX(-50%)";
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
    const isDebug =
      this.options.debug ||
      new URLSearchParams(window.location.search).has("debug");
    if (isDebug) {
      this.createDebugUI();
    }

    // Enable gyro control on mobile devices
    this.initGyroControl();

    // Start game mode immediately if debug is set
    if (isDebug) {
      setTimeout(() => this.startGameMode(), 100);
    }

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

  private startGameMode(): void {
    if (!this.engine || !this.render || !this.container) return;

    this.gameMode = true;

    // Set game gravity
    this.engine.gravity.y = 1.5;

    // Remove all non-static bodies (clear the shapes)
    const bodies = Composite.allBodies(this.engine.world);
    const toRemove = bodies.filter((body) => !body.isStatic);
    Composite.remove(this.engine.world, toRemove);

    // Remove mouse constraint (no more dragging)
    const constraints = Composite.allConstraints(this.engine.world);
    constraints.forEach((constraint) => {
      if ((constraint as Matter.Constraint).label === "Mouse Constraint") {
        Composite.remove(this.engine.world, constraint);
      }
    });

    // Set up collision detection for merging
    Events.on(
      this.engine,
      "collisionStart",
      this.handleGameCollision.bind(this)
    );

    // Set up mouse tracking for pending shape on the whole container
    this.mouseMoveHandler = (e: MouseEvent) => {
      if (!this.render) return;
      const rect = this.render.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.updatePendingShapePosition();
    };
    this.container.addEventListener("mousemove", this.mouseMoveHandler);

    // Set up click to drop on the whole container
    this.dropHandler = (e: MouseEvent) => {
      // Don't interfere with interactive elements
      const target = e.target as HTMLElement;
      if (
        target.closest('a, button, input, select, textarea, [role="button"]')
      ) {
        return;
      }

      if (this.canDrop && this.pendingShape) {
        this.dropShape();
      }
    };
    this.container.addEventListener("mousedown", this.dropHandler);

    // Touch support for mobile
    this.container.addEventListener("touchstart", (e: TouchEvent) => {
      if (!this.render) return;
      const touch = e.touches[0];
      const rect = this.render.canvas.getBoundingClientRect();
      this.mouseX = touch.clientX - rect.left;
      this.updatePendingShapePosition();
    }, { passive: true });

    this.container.addEventListener("touchmove", (e: TouchEvent) => {
      if (!this.render) return;
      const touch = e.touches[0];
      const rect = this.render.canvas.getBoundingClientRect();
      this.mouseX = touch.clientX - rect.left;
      this.updatePendingShapePosition();
    }, { passive: true });

    this.container.addEventListener("touchend", (e: TouchEvent) => {
      // Don't interfere with interactive elements
      const target = e.target as HTMLElement;
      if (
        target.closest('a, button, input, select, textarea, [role="button"]')
      ) {
        return;
      }

      if (this.canDrop && this.pendingShape) {
        this.dropShape();
      }
    });

    // Create first pending shape
    this.pendingShapeIndex = Math.floor(Math.random() * 2); // Start with small shapes only
    this.createPendingShape();
  }

  private createPendingShape(): void {
    if (!this.engine || !this.render || !this.container) return;

    const shapeConfig = GAME_SHAPES[this.pendingShapeIndex];
    const width = this.render.canvas.width;
    const scale = Math.min(1, Math.max(0.5, width / 1200)) * shapeConfig.size;
    const x = this.mouseX || width / 2;
    const y = 0;
    const angle = Math.random() * Math.PI * 2;

    // Get vertices for shape types
    const halfPipeVertices = getSvgVertices(shapes.halfPipe);
    const halfCircleVertices = getSvgVertices(shapes.halfCircle);
    const petalVertices = getSvgVertices(shapes.petal);

    let body: Matter.Body | null = null;

    switch (shapeConfig.type) {
      case "circle":
        body = Bodies.circle(x, y, 87 * scale, {
          isStatic: true,
          angle,
          render: {
            sprite: {
              texture: svgToDataUrl(shapes.circle, shapeConfig.color),
              xScale: scale,
              yScale: scale,
            },
          },
          label: `game-shape-${this.pendingShapeIndex}`,
        });
        break;
      case "halfPipe":
        if (halfPipeVertices) {
          body = Bodies.fromVertices(x, y, [halfPipeVertices], {
            isStatic: true,
            angle,
            render: { fillStyle: shapeConfig.color },
            label: `game-shape-${this.pendingShapeIndex}`,
          });
          if (body && scale !== 1) {
            Body.scale(body, scale, scale);
          }
        }
        break;
      case "halfCircle":
        if (halfCircleVertices) {
          body = Bodies.fromVertices(x, y, [halfCircleVertices], {
            isStatic: true,
            angle,
            render: { fillStyle: shapeConfig.color },
            label: `game-shape-${this.pendingShapeIndex}`,
          });
          if (body && scale !== 1) {
            Body.scale(body, scale, scale);
          }
        }
        break;
      case "petal":
        if (petalVertices) {
          body = Bodies.fromVertices(x, y, [petalVertices], {
            isStatic: true,
            angle,
            render: { fillStyle: shapeConfig.color },
            label: `game-shape-${this.pendingShapeIndex}`,
          });
          if (body && scale !== 1) {
            Body.scale(body, scale, scale);
          }
        }
        break;
    }

    if (body) {
      this.pendingShape = body;
      Composite.add(this.engine.world, body);
    }
  }

  private updatePendingShapePosition(): void {
    if (!this.pendingShape || !this.render) return;

    const padding = 60;
    const clampedX = Math.max(
      padding,
      Math.min(this.render.canvas.width - padding, this.mouseX)
    );
    Body.setPosition(this.pendingShape, { x: clampedX, y: 30 });
  }

  private dropShape(): void {
    if (!this.pendingShape || !this.engine || !this.render) return;

    this.canDrop = false;

    // Store position, angle and shape info before removing
    const x = this.pendingShape.position.x;
    const y = this.pendingShape.position.y;
    const angle = this.pendingShape.angle;
    const shapeIndex = this.pendingShapeIndex;

    // Remove the static pending shape
    Composite.remove(this.engine.world, this.pendingShape);
    this.pendingShape = null;

    // Create a new dynamic body at the same position and angle
    this.createDynamicShape(shapeIndex, x, y, angle);

    // Wait a moment before allowing next drop
    setTimeout(() => {
      this.canDrop = true;
      // Pick next shape (only small shapes to start)
      this.pendingShapeIndex = Math.floor(Math.random() * 2);
      this.createPendingShape();
    }, 500);
  }

  private createDynamicShape(
    shapeIndex: number,
    x: number,
    y: number,
    angle: number = 0
  ): void {
    if (!this.engine || !this.render) return;

    const shapeConfig = GAME_SHAPES[shapeIndex];
    const width = this.render.canvas.width;
    const scale = Math.min(1, Math.max(0.5, width / 1200)) * shapeConfig.size;

    const halfPipeVertices = getSvgVertices(shapes.halfPipe);
    const halfCircleVertices = getSvgVertices(shapes.halfCircle);
    const petalVertices = getSvgVertices(shapes.petal);

    // Low friction for easier rolling
    const physicsOptions = {
      friction: 0.05,
      frictionAir: 0.01,
      restitution: 0.2,
    };

    let body: Matter.Body | null = null;

    switch (shapeConfig.type) {
      case "circle":
        body = Bodies.circle(x, y, 87 * scale, {
          angle,
          ...physicsOptions,
          render: {
            sprite: {
              texture: svgToDataUrl(shapes.circle, shapeConfig.color),
              xScale: scale,
              yScale: scale,
            },
          },
          label: `game-shape-${shapeIndex}`,
        });
        break;
      case "halfPipe":
        if (halfPipeVertices) {
          body = Bodies.fromVertices(x, y, [halfPipeVertices], {
            angle,
            ...physicsOptions,
            render: { fillStyle: shapeConfig.color },
            label: `game-shape-${shapeIndex}`,
          });
          if (body && scale !== 1) {
            Body.scale(body, scale, scale);
          }
        }
        break;
      case "halfCircle":
        if (halfCircleVertices) {
          body = Bodies.fromVertices(x, y, [halfCircleVertices], {
            angle,
            ...physicsOptions,
            render: { fillStyle: shapeConfig.color },
            label: `game-shape-${shapeIndex}`,
          });
          if (body && scale !== 1) {
            Body.scale(body, scale, scale);
          }
        }
        break;
      case "petal":
        if (petalVertices) {
          body = Bodies.fromVertices(x, y, [petalVertices], {
            angle,
            ...physicsOptions,
            render: { fillStyle: shapeConfig.color },
            label: `game-shape-${shapeIndex}`,
          });
          if (body && scale !== 1) {
            Body.scale(body, scale, scale);
          }
        }
        break;
    }

    if (body) {
      Composite.add(this.engine.world, body);
    }
  }

  private handleGameCollision(
    event: Matter.IEventCollision<Matter.Engine>
  ): void {
    if (!this.engine) return;

    const pairs = event.pairs;

    for (const pair of pairs) {
      const bodyA = pair.bodyA;
      const bodyB = pair.bodyB;

      // Skip if either is static (walls or pending shape)
      if (bodyA.isStatic || bodyB.isStatic) continue;

      // Check if same shape type
      const labelA = bodyA.label;
      const labelB = bodyB.label;

      if (labelA.startsWith("game-shape-") && labelA === labelB) {
        const shapeIndex = parseInt(labelA.replace("game-shape-", ""), 10);

        // Don't merge if already at max size
        if (shapeIndex >= GAME_SHAPES.length - 1) continue;

        // Remove both shapes
        Composite.remove(this.engine.world, [bodyA, bodyB]);

        // Create merged shape at midpoint
        const midX = (bodyA.position.x + bodyB.position.x) / 2;
        const midY = (bodyA.position.y + bodyB.position.y) / 2;
        this.createMergedShape(shapeIndex + 1, midX, midY);

        // Only handle one merge per frame to avoid issues
        break;
      }
    }
  }

  private createMergedShape(shapeIndex: number, x: number, y: number): void {
    // Reuse createDynamicShape with a random angle for merged shapes
    const angle = Math.random() * Math.PI * 2;
    this.createDynamicShape(shapeIndex, x, y, angle);
  }

  private updateSize(): void {
    if (!this.container || !this.render || !this.engine) return;

    const maxWidth = 1200;
    const width = Math.min(this.container.clientWidth, maxWidth);
    const height = this.container.clientHeight;
    const wallThickness = 300;

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

    // Remove game mode event listeners
    if (this.container) {
      if (this.mouseMoveHandler) {
        this.container.removeEventListener("mousemove", this.mouseMoveHandler);
        this.mouseMoveHandler = null;
      }
      if (this.dropHandler) {
        this.container.removeEventListener("mousedown", this.dropHandler);
        this.dropHandler = null;
      }
    }

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
    this.walls = {
      ground: null,
      leftWall: null,
      rightWall: null,
      ceiling: null,
    };
    // Reset game mode state
    this.gameMode = false;
    this.clickCount = 0;
    this.pendingShape = null;
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
