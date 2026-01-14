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

// Convert SVG string to data URL for sprite rendering
function svgToDataUrl(svgString: string): string {
  const encoded = encodeURIComponent(svgString);
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

function initMatter() {
  const container = document.getElementById("matter-container");
  if (!container) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  // create an engine with increased gravity
  const engine = Engine.create({
    gravity: { x: 0, y: 2 },
  });

  // create a renderer with transparent background
  const render = Render.create({
    element: container,
    engine: engine,
    options: {
      width: width,
      height: height,
      wireframes: false,
      background: "transparent",
    },
  });

  // Create bodies
  const bodies: Matter.Body[] = [];

  // halfPipe SVG dimensions: 140x70
  const spriteUrl = svgToDataUrl(shapes.halfPipe);
  const svgVertices = getSvgVertices(shapes.halfPipe);

  // Add halfPipe shapes starting above the container (they'll fall in)
  if (svgVertices) {
    const halfPipe1 = Bodies.fromVertices(200, -100, [svgVertices], {
      render: {
        sprite: {
          texture: spriteUrl,
          xScale: 1,
          yScale: 1,
        },
      },
    });
    const halfPipe2 = Bodies.fromVertices(400, -200, [svgVertices], {
      render: {
        sprite: {
          texture: spriteUrl,
          xScale: 1,
          yScale: 1,
        },
      },
    });
    bodies.push(halfPipe1, halfPipe2);
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

  // Add ceiling after delay so objects can fall in first
  setTimeout(() => {
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
    Composite.add(engine.world, ceiling);
  }, 1500);

  // add all bodies to the world
  Composite.add(engine.world, bodies);

  // Add mouse control for dragging
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.6,
      render: {
        visible: false,
      },
    },
  });
  Composite.add(engine.world, mouseConstraint);

  // Keep mouse in sync with rendering
  render.mouse = mouse;

  // run the renderer
  Render.run(render);

  // create runner
  const runner = Runner.create();
  Runner.run(runner, engine);
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMatter);
} else {
  initMatter();
}
