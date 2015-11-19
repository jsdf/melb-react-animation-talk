- interruptible animations for less annoying, more tactile UX
- real world is not linear
- spring physics create relatable intuitable motion, 'feels good' 
- css animation approaches are not interuptible, easing functions cannot easily be retargeted

- to make react's animation model fit systems which operate over time, pass in rendering for one slice of time

- performance
  - avoid nested animation loops
  - make use of pure render/shouldComponentUpdate
  - chrome dev tools, paint time

