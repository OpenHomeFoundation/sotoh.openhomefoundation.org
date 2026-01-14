// Brand icons with animations
// Each icon has unique IDs for animation targeting

export const BRAND_ICONS = {
  building: {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 450" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" style="background-color:transparent">
<defs><linearGradient id="building-gradient" x1="0" y1="0" x2="450" y2="450" spreadMethod="pad" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="var(--gradient-start, #18bcf2)"/><stop offset="50%" stop-color="var(--gradient-mid, #7788ef)"/><stop offset="100%" stop-color="var(--gradient-end, #d655ec)"/></linearGradient></defs>
<g transform="translate(-63 -63)" mask="url(#building-mask)">
  <g transform="translate(288 288)">
    <rect width="450" height="450" rx="0" ry="0" transform="translate(-225 -225)" fill="url(#building-gradient)" stroke-width="0"/>
  </g>
  <mask id="building-mask" mask-type="alpha" x="-150%" y="-150%" height="400%" width="400%">
    <g transform="translate(63 63)" clip-path="url(#building-clip-main)">
      <g clip-path="url(#building-clip-1)">
        <g id="building-anim-1" transform="translate(225,225)">
          <g transform="translate(0,0)">
            <g transform="matrix(0.5 0 0 0.5 -112.5 -112.5)">
              <ellipse rx="225" ry="225" fill="#f00" stroke-width="0"/>
            </g>
          </g>
        </g>
        <g id="building-anim-2" transform="translate(225,225)">
          <g transform="translate(0,0)">
            <g id="building-fade-1" transform="matrix(0.5 0 0 0.5 113 113)" opacity="0">
              <ellipse rx="225" ry="225" fill="#f00" stroke-width="0"/>
            </g>
          </g>
        </g>
        <clipPath id="building-clip-1"><rect width="113" height="113" rx="0" ry="0" fill="none" stroke-width="0"/></clipPath>
      </g>
      <g transform="matrix(-1 0 0 1 450 0)" clip-path="url(#building-clip-2)">
        <g id="building-anim-3" transform="translate(225,225)">
          <g transform="translate(0,0)">
            <g transform="matrix(0.5 0 0 0.5 -112.5 -112.5)">
              <ellipse rx="225" ry="225" fill="#f00" stroke-width="0"/>
            </g>
          </g>
        </g>
        <g id="building-anim-4" transform="translate(225,225)">
          <g transform="translate(0,0)">
            <g id="building-fade-2" transform="matrix(0.5 0 0 0.5 113 113)" opacity="0">
              <ellipse rx="225" ry="225" fill="#f00" stroke-width="0"/>
            </g>
          </g>
        </g>
        <clipPath id="building-clip-2"><rect width="113" height="113" rx="0" ry="0" fill="none" stroke-width="0"/></clipPath>
      </g>
      <g transform="matrix(1 0 0 -1 0 450)" clip-path="url(#building-clip-3)">
        <g id="building-anim-5" transform="translate(225,225)">
          <g transform="translate(0,0)">
            <g transform="matrix(0.5 0 0 0.5 -112.5 -112.5)">
              <ellipse rx="225" ry="225" fill="#f00" stroke-width="0"/>
            </g>
          </g>
        </g>
        <g id="building-anim-6" transform="translate(225,225)">
          <g transform="translate(0,0)">
            <g id="building-fade-3" transform="matrix(0.5 0 0 0.5 113 113)" opacity="0">
              <ellipse rx="225" ry="225" fill="#f00" stroke-width="0"/>
            </g>
          </g>
        </g>
        <clipPath id="building-clip-3"><rect width="113" height="113" rx="0" ry="0" fill="none" stroke-width="0"/></clipPath>
      </g>
      <g transform="matrix(-1 0 0 -1 450 450)" clip-path="url(#building-clip-4)">
        <g id="building-anim-7" transform="translate(225,225)">
          <g transform="translate(0,0)">
            <g transform="matrix(0.5 0 0 0.5 -112.5 -112.5)">
              <ellipse rx="225" ry="225" fill="#f00" stroke-width="0"/>
            </g>
          </g>
        </g>
        <g id="building-anim-8" transform="translate(225,225)">
          <g transform="translate(0,0)">
            <g id="building-fade-4" transform="matrix(0.5 0 0 0.5 113 113)" opacity="0">
              <ellipse rx="225" ry="225" fill="#f00" stroke-width="0"/>
            </g>
          </g>
        </g>
        <clipPath id="building-clip-4"><rect width="113" height="113" rx="0" ry="0" fill="none" stroke-width="0"/></clipPath>
      </g>
      <g transform="translate(0.3 112)" clip-path="url(#building-clip-5)">
        <g id="building-anim-9" transform="translate(113,113)">
          <g transform="translate(0,0)">
            <ellipse rx="113" ry="113" fill="#f00" stroke-width="0"/>
          </g>
        </g>
        <g id="building-anim-10" transform="translate(113,113)">
          <g transform="translate(-100,-50)">
            <g id="building-fade-5" transform="translate(326 50)" opacity="0">
              <ellipse rx="113" ry="113" fill="#f00" stroke-width="0"/>
            </g>
          </g>
        </g>
        <clipPath id="building-clip-5"><rect width="113" height="226" rx="0" ry="0" fill="none" stroke-width="0"/></clipPath>
      </g>
      <g transform="matrix(-1 0 0 -1 450 338)" clip-path="url(#building-clip-6)">
        <g id="building-anim-11" transform="translate(113,113)">
          <g transform="translate(0,0)">
            <ellipse rx="113" ry="113" fill="#f00" stroke-width="0"/>
          </g>
        </g>
        <g id="building-anim-12" transform="translate(113,113)">
          <g transform="translate(-100,-50)">
            <g id="building-fade-6" transform="translate(326 50)" opacity="0">
              <ellipse rx="113" ry="113" fill="#f00" stroke-width="0"/>
            </g>
          </g>
        </g>
        <clipPath id="building-clip-6"><rect width="113" height="226" rx="0" ry="0" fill="none" stroke-width="0"/></clipPath>
      </g>
      <g transform="matrix(0 1 -1 0 338 0)" clip-path="url(#building-clip-7)">
        <g id="building-anim-13" transform="translate(113,113)">
          <g transform="translate(0,0)">
            <ellipse rx="113" ry="113" fill="#f00" stroke-width="0"/>
          </g>
        </g>
        <g id="building-anim-14" transform="translate(113,113)">
          <g transform="translate(-100,-50)">
            <g id="building-fade-7" transform="translate(326 50)" opacity="0">
              <ellipse rx="113" ry="113" fill="#f00" stroke-width="0"/>
            </g>
          </g>
        </g>
        <clipPath id="building-clip-7"><rect width="113" height="226" rx="0" ry="0" fill="none" stroke-width="0"/></clipPath>
      </g>
      <g transform="matrix(0 -1 1 0 112 450)" clip-path="url(#building-clip-8)">
        <g id="building-anim-15" transform="translate(113,113)">
          <g transform="translate(0,0)">
            <ellipse rx="113" ry="113" fill="#f00" stroke-width="0"/>
          </g>
        </g>
        <g id="building-anim-16" transform="translate(113,113)">
          <g transform="translate(-100,-50)">
            <g id="building-fade-8" transform="translate(326 50)" opacity="0">
              <ellipse rx="113" ry="113" fill="#f00" stroke-width="0"/>
            </g>
          </g>
        </g>
        <clipPath id="building-clip-8"><rect width="113" height="226" rx="0" ry="0" fill="none" stroke-width="0"/></clipPath>
      </g>
      <g id="building-anim-center" transform="translate(225,225) scale(0.25,0.25)">
        <g transform="translate(0,0)">
          <ellipse rx="225" ry="225" fill="#f00" stroke="#fff" stroke-width="0"/>
        </g>
      </g>
      <clipPath id="building-clip-main"><rect width="450" height="450" rx="0" ry="0" fill="none" stroke-width="0"/></clipPath>
    </g>
  </mask>
</g>
</svg>`,
  },

  choice: {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 450" shape-rendering="geometricPrecision" text-rendering="geometricPrecision">
<defs>
  <linearGradient id="choice-grad-1" x1="1.839" y1="-0.165" x2="-1.505" y2="2.038" gradientUnits="objectBoundingBox"><stop offset="0%" stop-color="var(--gradient-start, #18bcf2)"/><stop offset="100%" stop-color="var(--gradient-end, #e10054)"/></linearGradient>
  <linearGradient id="choice-grad-2" x1="2.708" y1="-0.112" x2="-0.641" y2="2.162" gradientUnits="objectBoundingBox"><stop offset="0%" stop-color="var(--gradient-start, #18bcf2)"/><stop offset="100%" stop-color="var(--gradient-end, #e10054)"/></linearGradient>
  <linearGradient id="choice-grad-3" x1="2.775" y1="-1.128" x2="-0.574" y2="1.147" gradientUnits="objectBoundingBox"><stop offset="0%" stop-color="var(--gradient-start, #18bcf2)"/><stop offset="100%" stop-color="var(--gradient-end, #e10054)"/></linearGradient>
  <linearGradient id="choice-grad-4" x1="267.35" y1="-363.38" x2="-486.13" y2="148.38" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="var(--gradient-start, #18bcf2)"/><stop offset="100%" stop-color="var(--gradient-end, #e10054)"/></linearGradient>
</defs>
<g id="choice-center" transform="translate(225,225) scale(1,1)">
  <g transform="translate(-288,-288)">
    <ellipse rx="112.5" ry="112.5" transform="translate(400.5 175.5)" fill="url(#choice-grad-1)" stroke-width="0"/>
    <ellipse rx="112.5" ry="112.5" transform="translate(175.5 175.5)" fill="url(#choice-grad-2)" stroke-width="0"/>
    <ellipse rx="112.5" ry="112.5" transform="translate(175.5 400.5)" fill="url(#choice-grad-3)" stroke-width="0"/>
    <ellipse rx="112.5" ry="112.5" transform="translate(400.5 400.5)" fill="url(#choice-grad-4)" stroke-width="0"/>
  </g>
</g>
<g transform="translate(-63 -63)">
  <g id="choice-corner-1" transform="translate(392.65,167.65) scale(0,0)">
    <ellipse rx="112.5" ry="112.5" transform="translate(7.85,7.85)" fill="url(#choice-grad-1)" stroke-width="0"/>
  </g>
  <g id="choice-corner-2" transform="translate(167.65,167.65) scale(0,0)">
    <ellipse rx="112.5" ry="112.5" transform="translate(7.85,7.85)" fill="url(#choice-grad-2)" stroke-width="0"/>
  </g>
  <g id="choice-corner-3" transform="translate(167.65,392.65) scale(0,0)">
    <ellipse rx="112.5" ry="112.5" transform="translate(7.85,7.85)" fill="url(#choice-grad-3)" stroke-width="0"/>
  </g>
  <g id="choice-corner-4" transform="translate(392.65,392.65) scale(0,0)">
    <ellipse rx="112.5" ry="112.5" transform="translate(7.85,7.85)" fill="url(#choice-grad-4)" stroke-width="0"/>
  </g>
</g>
</svg>`,
  },

  sustainability: {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 450" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" style="background-color:transparent">
<defs>
  <linearGradient id="sustainability-grad" x1="182.813" y1="-93.75" x2="-98.437" y2="63.281" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="var(--gradient-start, #18bcf2)"/><stop offset="50%" stop-color="var(--gradient-mid, #77d2af)"/><stop offset="100%" stop-color="var(--gradient-end, #d6e96d)"/></linearGradient>
  <linearGradient id="sustainability-grad-sm" x1="91.406" y1="-23.437" x2="-49.219" y2="15.82" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="var(--gradient-start, #18bcf2)"/><stop offset="50%" stop-color="var(--gradient-mid, #77d2af)"/><stop offset="100%" stop-color="var(--gradient-end, #d6e96d)"/></linearGradient>
</defs>
<g transform="translate(-63 -63)" mask="url(#sustainability-mask-1)">
  <g id="sustainability-leaf-1" transform="translate(513.613,513.613)">
    <g transform="scale(-1,1) translate(-112.5,112.5)">
      <g transform="matrix(0 1 -1 0 0 0)">
        <path d="M-112.5,112.5c124.264,0,225-100.736,225-225-124.264,0-225,100.736-225,225Z" fill="url(#sustainability-grad)" stroke-width="0"/>
      </g>
    </g>
  </g>
  <mask id="sustainability-mask-1" mask-type="alpha" x="-150%" y="-150%" height="400%" width="400%">
    <g transform="translate(287.785 289.206)">
      <ellipse rx="223.5" ry="223.5" fill="#f00" stroke="#fff" stroke-width="2"/>
    </g>
  </mask>
</g>
<g transform="matrix(-1 0 0 1 513 -63)" mask="url(#sustainability-mask-2)">
  <g id="sustainability-leaf-2" transform="translate(513.613,513.613)">
    <g transform="scale(-1,1) translate(-112.5,112.5)">
      <g transform="matrix(0 1 -1 0 0 0)">
        <path d="M-112.5,112.5c124.264,0,225-100.736,225-225-124.264,0-225,100.736-225,225Z" fill="url(#sustainability-grad)" stroke-width="0"/>
      </g>
    </g>
  </g>
  <mask id="sustainability-mask-2" mask-type="alpha" x="-150%" y="-150%" height="400%" width="400%">
    <g transform="translate(287.785 289.206)">
      <ellipse rx="223.5" ry="223.5" fill="#f00" stroke="#fff" stroke-width="2"/>
    </g>
  </mask>
</g>
<g id="sustainability-leaf-3" transform="translate(225,225)">
  <g transform="translate(-112.5,112.5)">
    <g transform="matrix(0 1 -1 0 0 0)">
      <path d="M-112.5,112.5c124.264,0,225-100.736,225-225-124.264,0-225,100.736-225,225Z" transform="translate(0 0.806)" fill="url(#sustainability-grad)" stroke-width="0"/>
    </g>
  </g>
</g>
<g id="sustainability-leaf-4" transform="translate(225,225)">
  <g transform="translate(0,0)">
    <g transform="matrix(0 1 1 0 112.5 112.5)">
      <path d="M-112.5,112.5c124.264,0,225-100.736,225-225-124.264,0-225,100.736-225,225Z" fill="url(#sustainability-grad)" stroke-width="0"/>
    </g>
  </g>
</g>
<g id="sustainability-leaf-5-wrap" transform="translate(225,225)">
  <g id="sustainability-leaf-5" transform="scale(1,1)">
    <g transform="translate(0,0)">
      <g transform="matrix(0 1 1 0 112.5 -112.5)">
        <path d="M-112.5,112.5c124.264,0,225-100.736,225-225-124.264,0-225,100.736-225,225Z" fill="url(#sustainability-grad)" stroke-width="0"/>
      </g>
    </g>
  </g>
</g>
<g id="sustainability-leaf-6-wrap" transform="translate(225,225)">
  <g id="sustainability-leaf-6" transform="scale(1,1)">
    <g transform="translate(-112.5,-112.5)">
      <g transform="matrix(0 1 -1 0 0 0)">
        <path d="M-112.5,112.5c124.264,0,225-100.736,225-225-124.264,0-225,100.736-225,225Z" fill="url(#sustainability-grad)" stroke-width="0"/>
      </g>
    </g>
  </g>
</g>
<g transform="matrix(-1 0 0 -1 225 28.125)">
  <path d="M56.25,28.125c0-31.066-25.184-56.25-56.25-56.25s-56.25,25.184-56.25,56.25c0,0,112.5,0,112.5,0Z" fill="url(#sustainability-grad-sm)" stroke-width="0"/>
</g>
</svg>`,
  },

  privacy: {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 450" shape-rendering="geometricPrecision" text-rendering="geometricPrecision">
<defs>
  <linearGradient id="privacy-grad" x1="65.9" y1="384.1" x2="384.1" y2="65.9" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="var(--gradient-start, #18bcf2)"/><stop offset="100%" stop-color="var(--gradient-end, #cfe4ff)"/></linearGradient>
</defs>
<g transform="translate(-63 -63)" mask="url(#privacy-mask)">
  <path d="M281.25,89.2L344.32,26.13l79.55,79.55L360.8,168.75h89.2v112.5h-89.2l63.07,63.07-79.55,79.55L281.25,360.8v89.2h-112.5v-89.2l-63.07,63.07-79.55-79.55L89.2,281.25H0v-112.5h89.2L26.13,105.68l79.55-79.55L168.75,89.2V0h112.5v89.2ZM225,112.5C225,174.63,174.63,225,112.5,225C174.63,225,225,275.37,225,337.5l.04-2.9C226.58,273.81,276.34,225,337.5,225C275.37,225,225,174.63,225,112.5Z" transform="translate(63 63)" fill="url(#privacy-grad)"/>
  <mask id="privacy-mask" mask-type="alpha" x="-150%" y="-150%" height="400%" width="400%">
    <g id="privacy-scale" transform="translate(288,288) scale(1,1)">
      <g transform="translate(-225,-225)">
        <g id="privacy-quad-1" transform="translate(225,225)">
          <path d="M225,450h-56.25v-89.2l-63.07,63.07-79.55-79.55L89.2,281.25H0V225q71.84,0,112.5,0C174.63,225,225,275.37,225,337.5v112.5Z" transform="translate(-225,-225)" fill="url(#privacy-grad)"/>
        </g>
        <g id="privacy-quad-2" transform="translate(225,225)">
          <path d="M225,450h-56.25v-89.2l-63.07,63.07-79.55-79.55L89.2,281.25H0V225q71.84,0,112.5,0C174.63,225,225,275.37,225,337.5v112.5Z" transform="rotate(-90) translate(-225,-225)" fill="url(#privacy-grad)"/>
        </g>
        <g id="privacy-quad-3" transform="translate(225,225)">
          <path d="M225,450h-56.25v-89.2l-63.07,63.07-79.55-79.55L89.2,281.25H0V225q71.84,0,112.5,0C174.63,225,225,275.37,225,337.5v112.5Z" transform="rotate(-180) translate(-225,-225)" fill="url(#privacy-grad)"/>
        </g>
        <g id="privacy-quad-4" transform="translate(225,225)">
          <path d="M225,450h-56.25v-89.2l-63.07,63.07-79.55-79.55L89.2,281.25H0V225q71.84,0,112.5,0C174.63,225,225,275.37,225,337.5v112.5Z" transform="rotate(-270) translate(-225,-225)" fill="url(#privacy-grad)"/>
        </g>
      </g>
    </g>
  </mask>
</g>
</svg>`,
  },
} as const;

export type BRAND_ICON = keyof typeof BRAND_ICONS;
