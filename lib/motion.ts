// One easing family and a small set of durations, shared by Motion components.
// CSS uses the same curve through the --ease-out-soft token in globals.css.
export const ease = [0.22, 1, 0.36, 1] as const;

export const duration = {
  heading: 0.7,
  content: 0.5,
  hover: 0.2,
};

/** Spring for pointer driven movement: settles without overshooting visibly. */
export const pointerSpring = { stiffness: 190, damping: 24, mass: 0.7 };
