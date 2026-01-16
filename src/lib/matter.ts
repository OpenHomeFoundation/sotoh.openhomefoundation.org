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

// Game shape hierarchy (smallest to largest) - 11 levels
// Shapes evolve: corner → petal → petal → circle → circle → halfCircle → halfCircle → halfPipe → halfPipe → circle → circle
const GAME_SHAPES = [
  { type: "corner", color: "#59B2FF", size: 0.4 }, // 1. light blue corner (tiny)
  { type: "corner", color: "#D655EC", size: 0.55 }, // 2. pink corner
  { type: "petal", color: "#FF6B6B", size: 0.6 }, // 3. red petal
  { type: "circle", color: "#FFD351", size: 0.65 }, // 4. yellow circle (small)
  { type: "circle", color: "#8B26FF", size: 0.85 }, // 5. purple circle
  { type: "halfCircle", color: "#4ECDC4", size: 1.1 }, // 6. teal halfCircle (bigger)
  { type: "halfCircle", color: "#FF8C42", size: 1.3 }, // 7. orange halfCircle
  { type: "halfPipe", color: "#18BCFF", size: 1.3 }, // 8. cyan halfPipe (bigger)
  { type: "halfPipe", color: "#95E85A", size: 1.5 }, // 9. green halfPipe
  { type: "circle", color: "#FFFFFF", size: 1.7 }, // 10. white circle (huge)
  { type: "circle", color: "#FFD351", size: 2.0 }, // 11. yellow circle (final)
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
  private gameOver: boolean = false;
  private clickCount: number = 0;
  private pendingShape: Matter.Body | null = null;
  private pendingShapeIndex: number = 0;
  private mouseX: number = 0;
  private canDrop: boolean = true;
  private isSliding: boolean = false;
  private mouseMoveHandler: ((e: MouseEvent) => void) | null = null;
  private dropHandler: ((e: MouseEvent) => void) | null = null;
  private gameCheckInterval: ReturnType<typeof setInterval> | null = null;

  constructor(options: MatterSceneOptions = {}) {
    this.options = {
      containerId: "matter-container",
      gravity: 2,
      ...options,
    };
  }

  init(): boolean {
    this.container = document.getElementById(this.options.containerId!);
    if (!this.container) return false;

    const isMobile = window.innerWidth < 768;
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

    // Calculate scale factor for initial footer shapes
    const baseWidth = 1200;
    const scale = Math.min(1, Math.max(0.5, width / baseWidth));

    // Get vertices for each shape type
    const halfPipeVertices = getSvgVertices(shapes.halfPipe);
    const halfCircleVertices = getSvgVertices(shapes.halfCircle);
    const petalVertices = getSvgVertices(shapes.petal);
    const cornerVertices = getSvgVertices(shapes.corner);

    // Color definitions
    const pink = "#D655EC";
    const purple = "#8B26FF";
    const yellow = "#FFD351";

    // Helper to get random values
    const randomBetween = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    // Define shapes for the footer
    const lightBlue = "#59B2FF";
    const teal = "#4ECDC4";
    const shapeList: {
      type: "circle" | "halfPipe" | "halfCircle" | "petal" | "corner";
      color: string;
    }[] = [
      { type: "corner", color: pink },
      { type: "corner", color: purple },
      { type: "corner", color: lightBlue },
      { type: "corner", color: yellow },
      { type: "halfPipe", color: purple },
      { type: "halfPipe", color: purple },
      { type: "halfPipe", color: yellow },
      { type: "circle", color: pink },
      { type: "circle", color: purple },
      { type: "petal", color: yellow },
      { type: "petal", color: yellow },
      { type: "petal", color: purple },
      { type: "petal", color: pink },
      { type: "halfCircle", color: pink },
      { type: "halfCircle", color: teal },
    ];

    for (const { type, color } of shapeList) {
      const x = randomBetween(100, width - 100);
      const y = randomBetween(-600, -100);
      const angle = randomBetween(0, Math.PI * 2);
      // Random size variation (0.7x to 1.3x)
      const sizeVariation = randomBetween(0.7, 1.3);
      const shapeScale = scale * sizeVariation;

      let body: Matter.Body | null = null;

      switch (type) {
        case "circle":
          body = Bodies.circle(x, y, 87 * shapeScale, {
            angle,
            render: {
              sprite: {
                texture: svgToDataUrl(shapes.circle, color),
                xScale: shapeScale,
                yScale: shapeScale,
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
            if (body) {
              Matter.Body.scale(body, shapeScale, shapeScale);
            }
          }
          break;
        case "halfCircle":
          if (halfCircleVertices) {
            body = Bodies.fromVertices(x, y, [halfCircleVertices], {
              angle,
              render: { fillStyle: color },
            });
            if (body) {
              Matter.Body.scale(body, shapeScale, shapeScale);
            }
          }
          break;
        case "petal":
          if (petalVertices) {
            body = Bodies.fromVertices(x, y, [petalVertices], {
              angle,
              render: { fillStyle: color },
            });
            if (body) {
              Matter.Body.scale(body, shapeScale, shapeScale);
            }
          }
          break;
        case "corner":
          if (cornerVertices) {
            body = Bodies.fromVertices(x, y, [cornerVertices], {
              angle,
              render: { fillStyle: color },
            });
            if (body) {
              Matter.Body.scale(body, shapeScale, shapeScale);
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
    Events.on(mouseConstraint, "mousedown", () => {
      if (this.gameMode) return;

      // Check if clicking on a body (not walls)
      const body = mouseConstraint.body;
      if (body && !body.isStatic) {
        this.clickCount++;
        if (this.clickCount >= 10) {
          this.startGameMode();
        }
      }
    });

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

    // Enable gyro control on mobile devices (delay on mobile to let shapes fall first)
    if (isMobile) {
      setTimeout(() => this.initGyroControl(), 2000);
    } else {
      this.initGyroControl();
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
    this.gameOver = false;

    // Disable gyro control and reset gravity when game starts
    this.disableGyro();
    this.engine.gravity.x = 0;
    this.engine.gravity.y = 2;

    // Remove mouse constraint (no more dragging)
    const world = this.engine.world;
    const constraints = Composite.allConstraints(world);
    constraints.forEach((constraint) => {
      if ((constraint as Matter.Constraint).label === "Mouse Constraint") {
        Composite.remove(world, constraint);
      }
    });

    // Open the floor so shapes fall out
    if (this.walls.ground) {
      Composite.remove(this.engine.world, this.walls.ground);
      this.walls.ground = null;
    }

    // Wait for shapes to fall out, then set up the game
    setTimeout(() => this.setupGameArea(), 1500);
  }

  private setupGameArea(): void {
    if (!this.engine || !this.render || !this.container) return;

    // Remove any remaining non-static bodies
    const bodies = Composite.allBodies(this.engine.world);
    const toRemove = bodies.filter((body) => !body.isStatic);
    Composite.remove(this.engine.world, toRemove);

    // Set game gravity
    this.engine.gravity.y = 1.5;

    // Add game-mode class to container (for CSS styling, especially mobile)
    this.container.classList.add("game-mode");

    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // Mobile: Create dedicated 500px game area below the footer content
      const gameArea = document.createElement("div");
      gameArea.id = "game-area";
      gameArea.style.width = "100%";
      gameArea.style.height = "500px";
      gameArea.style.position = "relative";
      this.container.appendChild(gameArea);

      // Move canvas to game area
      this.render.canvas.style.position = "absolute";
      this.render.canvas.style.top = "0";
      this.render.canvas.style.left = "50%";
      this.render.canvas.style.transform = "translateX(-50%)";
      gameArea.appendChild(this.render.canvas);

      // Update canvas size to 500px height
      const width = Math.min(gameArea.clientWidth, 1200);
      this.render.canvas.width = width;
      this.render.canvas.height = 500;
      this.render.options.width = width;
      this.render.options.height = 500;

      // Scroll down to show the game area
      gameArea.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // Rebuild all walls for game mode
    this.updateSize();

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
    this.container.addEventListener(
      "touchstart",
      (e: TouchEvent) => {
        if (!this.render) return;
        const touch = e.touches[0];
        const rect = this.render.canvas.getBoundingClientRect();
        this.mouseX = touch.clientX - rect.left;
        this.updatePendingShapePosition();
      },
      { passive: true }
    );

    this.container.addEventListener(
      "touchmove",
      (e: TouchEvent) => {
        if (!this.render) return;
        const touch = e.touches[0];
        const rect = this.render.canvas.getBoundingClientRect();
        this.mouseX = touch.clientX - rect.left;
        this.updatePendingShapePosition();
      },
      { passive: true }
    );

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

    // Create first pending shape with slide-in animation
    this.pendingShapeIndex = Math.floor(Math.random() * 3); // Start with small shapes only
    this.createPendingShape(true);
  }

  private createPendingShape(slideIn: boolean = false): void {
    if (!this.engine || !this.render || !this.container) return;

    const shapeConfig = GAME_SHAPES[this.pendingShapeIndex];
    const width = this.render.canvas.width;
    const scale = Math.min(1, Math.max(0.7, width / 1200)) * shapeConfig.size * 1.5;
    const x = this.mouseX || width / 2;
    const startY = slideIn ? -100 : 30;
    const targetY = 30;
    const angle = Math.random() * Math.PI * 2;

    // Get vertices for shape types
    const halfPipeVertices = getSvgVertices(shapes.halfPipe);
    const halfCircleVertices = getSvgVertices(shapes.halfCircle);
    const petalVertices = getSvgVertices(shapes.petal);
    const cornerVertices = getSvgVertices(shapes.corner);

    let body: Matter.Body | null = null;

    switch (shapeConfig.type) {
      case "circle":
        body = Bodies.circle(x, startY, 87 * scale, {
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
          body = Bodies.fromVertices(x, startY, [halfPipeVertices], {
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
          body = Bodies.fromVertices(x, startY, [halfCircleVertices], {
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
          body = Bodies.fromVertices(x, startY, [petalVertices], {
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
      case "corner":
        if (cornerVertices) {
          body = Bodies.fromVertices(x, startY, [cornerVertices], {
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

      // Animate slide-in if requested
      if (slideIn) {
        this.isSliding = true;
        const animateSlideIn = () => {
          if (!this.pendingShape) {
            this.isSliding = false;
            return;
          }
          const currentY = this.pendingShape.position.y;
          if (currentY < targetY) {
            Body.setPosition(this.pendingShape, {
              x: this.pendingShape.position.x,
              y: currentY + 5,
            });
            requestAnimationFrame(animateSlideIn);
          } else {
            Body.setPosition(this.pendingShape, {
              x: this.pendingShape.position.x,
              y: targetY,
            });
            this.isSliding = false;
          }
        };
        requestAnimationFrame(animateSlideIn);
      }
    }
  }

  private updatePendingShapePosition(): void {
    if (!this.pendingShape || !this.render) return;

    const padding = 60;
    const clampedX = Math.max(
      padding,
      Math.min(this.render.canvas.width - padding, this.mouseX)
    );
    // During slide-in animation, only update x position
    const y = this.isSliding ? this.pendingShape.position.y : 30;
    Body.setPosition(this.pendingShape, { x: clampedX, y });
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
      this.pendingShapeIndex = Math.floor(Math.random() * 3);
      this.createPendingShape();
    }, 250);
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
    const scale = Math.min(1, Math.max(0.7, width / 1200)) * shapeConfig.size * 1.5;

    const halfPipeVertices = getSvgVertices(shapes.halfPipe);
    const halfCircleVertices = getSvgVertices(shapes.halfCircle);
    const petalVertices = getSvgVertices(shapes.petal);
    const cornerVertices = getSvgVertices(shapes.corner);

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
      case "corner":
        if (cornerVertices) {
          body = Bodies.fromVertices(x, y, [cornerVertices], {
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
    const isMobile = window.innerWidth < 768;
    const gameArea = document.getElementById("game-area");
    const width = Math.min(gameArea?.clientWidth || this.container.clientWidth, maxWidth);
    // Use fixed 500px height only in game mode on mobile, otherwise container height
    const height = this.gameMode && isMobile ? 500 : this.container.clientHeight;
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

    // Remove game mode event listeners, class, and game area
    if (this.container) {
      this.container.classList.remove("game-mode");
      const gameArea = document.getElementById("game-area");
      if (gameArea) {
        gameArea.remove();
      }
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
    this.gameOver = false;
    this.clickCount = 0;
    this.pendingShape = null;

    // Clear game check interval
    if (this.gameCheckInterval) {
      clearInterval(this.gameCheckInterval);
      this.gameCheckInterval = null;
    }
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
