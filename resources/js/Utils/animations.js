// resources/js/utils/animations.js

export const animationVariants = {
    float: {
        y: [0, -15, 0],
        transition: { duration: 4, ease: "easeInOut", repeat: Infinity }
    },
    pulse: {
        scale: [1, 1.05, 1],
        transition: { duration: 5, ease: "easeInOut", repeat: Infinity }
    },
    bounce: {
        y: [0, -20, 0],
        transition: { duration: 2, ease: "easeInOut", repeat: Infinity }
    },
    sway: {
        rotate: [0, -5, 5, -5, 0],
        transition: { duration: 5, ease: "easeInOut", repeat: Infinity }
    },
    shake: {
        x: [0, -10, 10, -10, 0],
        transition: { duration: 1, ease: "easeInOut", repeat: Infinity }
    },
    spin: {
        rotate: [0, 360],
        transition: { duration: 2, ease: "linear", repeat: Infinity }
    },
    zoom: {
        scale: [1, 1.2, 1],
        transition: { duration: 3, ease: "easeInOut", repeat: Infinity }
    },
    fadeIn: {
        opacity: [0, 1],
        transition: { duration: 2, ease: "easeInOut" }
    },
    fadeOut: {
        opacity: [1, 0],
        transition: { duration: 2, ease: "easeInOut" }
    },
    slideIn: {
        x: [-100, 0],
        transition: { duration: 1, ease: "easeInOut" }
    },
    slideOut: {
        x: [0, 100],
        transition: { duration: 1, ease: "easeInOut" }
    },
    flip: {
        rotateY: [0, 180, 0],
        transition: { duration: 2, ease: "easeInOut", repeat: Infinity }
    },
    wobble: {
        rotate: [0, 10, -10, 10, -10, 0],
        transition: { duration: 3, ease: "easeInOut", repeat: Infinity }
    },
    swing: {
        rotate: [0, 15, -15, 0],
        transition: { duration: 2, ease: "easeInOut", repeat: Infinity }
    },
    pulseColor: {
        backgroundColor: ["#fff", "#f0f0f0", "#fff"],
        transition: { duration: 3, ease: "easeInOut", repeat: Infinity }
    },
    rotate: {
        rotate: [0, 360],
        transition: { duration: 2, ease: "linear", repeat: Infinity }
    },
    slideUp: {
        y: [100, 0],
        transition: { duration: 1, ease: "easeInOut" }
    },
    slideDown: {
        y: [-100, 0],
        transition: { duration: 1, ease: "easeInOut" }
    },
    bounceIn: {
        y: [20, -10, 0],
        transition: { duration: 1, ease: "easeInOut" }
    },
    bounceOut: {
        y: [0, -20, 0],
        transition: { duration: 1, ease: "easeInOut" }
    },
    shakeX: {
        x: [0, -15, 15, -15, 0],
        transition: { duration: 1, ease: "easeInOut", repeat: Infinity }
    },
    shakeY: {
        y: [0, -15, 15, -15, 0],
        transition: { duration: 1, ease: "easeInOut", repeat: Infinity }
    },
    flipX: {
        rotateX: [0, 180, 0],
        transition: { duration: 2, ease: "easeInOut", repeat: Infinity }
    },
    flipY: {
        rotateY: [0, 180, 0],
        transition: { duration: 2, ease: "easeInOut", repeat: Infinity }
    },
    fadeSlideIn: {
        opacity: [0, 1],
        y: [-20, 0],
        transition: { duration: 1, ease: "easeInOut" }
    },
    fadeSlideOut: {
        opacity: [1, 0],
        y: [0, 20],
        transition: { duration: 1, ease: "easeInOut" }
    },
    zoomIn: {
        scale: [0.5, 1],
        transition: { duration: 1, ease: "easeInOut" }
    },
    zoomOut: {
        scale: [1, 0.5],
        transition: { duration: 1, ease: "easeInOut" }
    },
    pulseScale: {
        scale: [1, 1.1, 1],
        transition: { duration: 2, ease: "easeInOut", repeat: Infinity }
    },
    rotateIn: {
        rotate: [0, 360],
        transition: { duration: 2, ease: "easeInOut" }
    },
    rotateOut: {
        rotate: [360, 0],
        transition: { duration: 2, ease: "easeInOut" }
    },
    slideLeft: {
        x: [100, 0],
        transition: { duration: 1, ease: "easeInOut" }
    },
    slideRight: {
        x: [-100, 0],
        transition: { duration: 1, ease: "easeInOut" }
    },
    fadeZoomIn: {
        opacity: [0, 1],
        scale: [0.5, 1],
        transition: { duration: 1, ease: "easeInOut" }
    },
    swingIn: {
        rotate: [0, 15, -15, 0],
        transition: { duration: 1, ease: "easeInOut" }
    },
    swingOut: {
        rotate: [0, -15, 15, 0],
        transition: { duration: 1, ease: "easeInOut" }
    },
    swingLeft: {
        rotate: [0, -15, 15, 0],
        transition: { duration: 1, ease: "easeInOut", repeat: Infinity }
    },
    swingRight: {
    rotate: [0, 15, -15, 0],
    transition: { duration: 1, ease: "easeInOut", repeat: Infinity }
},
  waveIn: {
  rotate: [0, -4],
  transformOrigin: "bottom right", // atau "100% 100%"
  transition: { 
    duration: 4, 
    ease: "easeInOut", 
    repeat: Infinity,
    repeatType: "reverse"
  }
},
    waveOut: {
    rotate: [0, 4,],
        transformOrigin: "bottom left", // atau "0% 100%"
        transition: { 
            duration: 4, 
            ease: "easeInOut", 
            repeat: Infinity,
            repeatType: "reverse"
        }
    },

     waveOutFlipped: {
        rotate: [0, 4],
        scaleX: -1, // Flip horizontal
        transformOrigin: "bottom left",
        transition: { 
            duration: 4, 
            ease: "easeInOut", 
            repeat: Infinity,
            repeatType: "reverse"
        }
    },

marquee: {
  x: [0, 800],
  opacity: [0, 1, 1, 1], // Fade in di awal, lalu tetap terlihat
  transition: {
    duration: 30,
    ease: "linear",
    repeat: Infinity,
    repeatType: "loop",
    times: [0, 0.03, 0.97, 1] // Fade in di 3% pertama, fade out di 3% terakhir (opsional)
  }
},

marqueeReverse: {
  x: [0, -800],
  opacity: [0, 1, 1, 1], // Fade in di awal, lalu tetap terlihat
  transition: {
    duration: 30,
    ease: "linear",
    repeat: Infinity,
    repeatType: "loop",
    times: [0, 0.03, 0.97, 1] // Fade in di 3% pertama, fade out di 3% terakhir (opsional)
  }
}

};