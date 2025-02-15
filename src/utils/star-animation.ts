interface Star {
  x: number
  y: number
  radius: number
  vx: number
  vy: number
  opacity: number
  baseX: number
  baseY: number
}

interface FallingStar {
  x: number
  y: number
  vx: number
  vy: number
  opacity: number
}

const moonImages: Record<string, HTMLImageElement> = {};

function loadMoonImages() {
  const phases = [
    "New", "Waxing Crescent", "First Quarter", "Waxing Gibbous", "Full",
    "Waning Gibbous", "Last Quarter", "Waning Crescent"
  ];
  phases.forEach((phase) => {
    const img = new Image();
    img.src = `./moons/${(phase + " moon").replace(/\s/g, "-").toLowerCase()}.png`;
    moonImages[phase] = img;
  });
}

loadMoonImages()


const getJulianDate = (date = new Date()) => {
  const time = date.getTime();
  const tzoffset = date.getTimezoneOffset()

  return (time / 86400000) - (tzoffset / 1440) + 2440587.5;
}

const LUNAR_MONTH = 29.530588853; const getLunarAge = (date = new Date()) => {
  const percent = getLunarAgePercent(date);
  const age = percent * LUNAR_MONTH; return age;
}

const getLunarAgePercent = (date = new Date()) => {
  return normalize((getJulianDate(date) - 2451550.1) / LUNAR_MONTH);
}

const normalize = (value: number) => {
  value = value - Math.floor(value);
  if (value < 0)
    value = value + 1;
  return value;
}

const getLunarPhase = (date = new Date()) => {
  const age = getLunarAge(date); if (age < 1.84566)
    return "New";
  else if (age < 5.53699)
    return "Waxing Crescent";
  else if (age < 9.22831)
    return "First Quarter";
  else if (age < 12.91963)
    return "Waxing Gibbous";
  else if (age < 16.61096)
    return "Full";
  else if (age < 20.30228)
    return "Waning Gibbous";
  else if (age < 23.99361)
    return "Last Quarter";
  else if (age < 27.68493)
    return "Waning Crescent"; return "New";
}

export function initStarAnimation(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return;

  let animationFrameId: number
  const stars: Star[] = []
  const numStars = 1000
  let width = canvas.clientWidth
  let height = canvas.clientHeight
  let mouseX = 0
  let mouseY = 0

  // Falling star variables
  let fallingStar: FallingStar | null = null
  let lastFallingStarTime = 0,
    nextFallingStarTime: (number | null) = null

  function resizeCanvas() {
    console.log(canvas.clientWidth, canvas.clientHeight)
    width = canvas.clientWidth
    height = canvas.clientHeight
    canvas.width = width
    canvas.height = height
    initStars()
  }

  let moonOpacity = 1;
  let moonOpacityDirection = 1;
  const moonOscillationSpeed = 0.000000001; // Adjust for faster/slower changes

  function animateMoon(ctx: CanvasRenderingContext2D, time: number) {
    const phase = getLunarPhase();
    const moonImg = moonImages[phase];
    if (!moonImg) return;

    // Sinusoidal opacity fluctuation
    moonOpacity = 0.50 + 0.25 * Math.sin(time * moonOscillationSpeed);

    const moonSize = Math.min(width, height) * 0.12;
    const x = width - moonSize - 50;
    const y = 50;

    ctx.globalAlpha = moonOpacity;
    ctx.drawImage(moonImg, x, y, moonSize, moonSize);
    ctx.globalAlpha = 1; // Reset opacity
  }


  function initStars() {
    stars.length = 0
    for (let i = 0; i < numStars; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      stars.push({
        x,
        y,
        baseX: x,
        baseY: y,
        radius: Math.random() * 1.5 + 0.5,
        vx: Math.random() * 0.2 - 0.1,
        vy: Math.random() * 0.2 - 0.1,
        opacity: Math.random(),
      })
    }
  }

  function createFallingStar() {
    const useVerticalEdge = Math.random() > 0.5
    const useLeftOrTop = Math.random() < 0.5
    fallingStar = {
      x: useVerticalEdge ? (useLeftOrTop ? 0 : width) : (Math.random() * width),
      y: useVerticalEdge ? (Math.random() * height) : (useLeftOrTop ? 0 : height),
      vx: useVerticalEdge ? (useLeftOrTop ? (Math.random() * 5 + 5) : -(Math.random() * 5 + 5)) : (Math.random() * 20 - 10),
      vy: useVerticalEdge ? (Math.random() * 20 - 10) : (useLeftOrTop ? (Math.random() * 5 + 5) : -(Math.random() * 5 + 5)),
      opacity: 1,
    }
  }

  function animate(currentTime: number) {
    if (!ctx) return;
    const nightSkyGradient = ctx.createLinearGradient(width/2, 0, width/2, height);
    // Add three color stops
    nightSkyGradient.addColorStop(0, "rgba(0,0,10,0.5)");
    nightSkyGradient.addColorStop(1, "rgba(10,10,30,0.5)");
    ctx.fillStyle = nightSkyGradient
    ctx.fillRect(0, 0, width, height)

    const parallaxIntensity = 0.05

    stars.forEach((star) => {
      // Apply parallax effect
      const dx = mouseX - width / 2
      const dy = mouseY - height / 2
      const parallaxX = /*star.baseX + dx * parallaxIntensity * (star.radius / 1.5)*/star.baseX
      const parallaxY = /*star.baseY + dy * parallaxIntensity * (star.radius / 1.5)*/star.baseY

      ctx.beginPath()
      ctx.arc(parallaxX, parallaxY, star.radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
      ctx.fill()

      // Update base position
      star.baseX += star.vx
      star.baseY += star.vy
      star.opacity += Math.random() * 0.02 - 0.01

      if (star.opacity < 0) star.opacity = 0
      if (star.opacity > 1) star.opacity = 1

      if (star.baseX < 0 || star.baseX > width) star.vx = -star.vx
      if (star.baseY < 0 || star.baseY > height) star.vy = -star.vy
    })

    // Animate falling star
    if (fallingStar) {
      ctx.beginPath()
      ctx.arc(fallingStar.x, fallingStar.y, 5, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 255, 1)`
      ctx.fill()

      fallingStar.y += fallingStar.vy
      fallingStar.x += fallingStar.vx

      if (fallingStar.y > height || fallingStar.y < 0 || fallingStar.x > width || fallingStar.x < 0) {
        fallingStar = null
        nextFallingStarTime = lastFallingStarTime + 30000 + Math.random() * 30000
      }
    } else if (currentTime > 10000) {
      if (currentTime > (nextFallingStarTime || 0)) {
        console.log("generating star")
        createFallingStar()
        lastFallingStarTime = currentTime
      }
    }

    animateMoon(ctx, new Date().getTime());

    animationFrameId = requestAnimationFrame(animate)
  }

  function updateMousePosition(e: MouseEvent) {
    console.log(e)
    mouseX = e.pageX
    mouseY = e.pageY
  }

  resizeCanvas()
  window.addEventListener("resize", resizeCanvas)
  //window.addEventListener("mousemove", updateMousePosition)

  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = "rgba(0, 0, 10, 1)"
  ctx.fillRect(0, 0, width, height)
  animate(0)

  return () => {
    window.removeEventListener("resize", resizeCanvas)
    //window.removeEventListener("mousemove", updateMousePosition)
    cancelAnimationFrame(animationFrameId)
  }
}

