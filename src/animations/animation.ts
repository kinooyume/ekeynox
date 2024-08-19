import anime from "animejs";

export type MinimalAnimationInstance = {
  play: () => void;
  finished: Promise<void>;
};
export interface AnimationProps {
  params: anime.AnimeParams;
  offset?: string;
}

export interface AnimationParentProps extends AnimationProps {
  timeline: anime.AnimeParams;
}

export type AnimationChildren = {
  enter: AnimationProps[];
  leave: AnimationProps[];
};

const emptyAnimationChildren = {
  enter: [],
  leave: [],
};

const createAnimationTimeline = (
  timeline: anime.AnimeParams,
  anims: AnimationProps[] = [],
): MinimalAnimationInstance => {
  const a = anime.timeline({
    ...timeline,
    autoplay: false,
  });
  anims.forEach((step) => {
    a.add(step.params, step.offset);
  });
  return a;
};

const createAnimationEnter = (
  getParent: () => AnimationParentProps,
  children: AnimationProps[] = [],
): (() => MinimalAnimationInstance) => {
  return () => {
    const parent = getParent();
    return createAnimationTimeline(parent.timeline, [parent, ...children]);
  };
};

const createAnimationLeave = (
  getParent: () => AnimationParentProps,
  children: AnimationProps[] = [],
): (() => MinimalAnimationInstance) => {
  return () => {
    const parent = getParent();
    return createAnimationTimeline(parent.timeline, [...children, parent]);
  };
};

export type AnimationParent = {
  enter: () => AnimationParentProps;
  leave: () => AnimationParentProps;
};

export type CreateAnimationProps = {
  parent: AnimationParent;
  children: AnimationChildren;
};

export type AnimationComp = {
  enter: () => MinimalAnimationInstance;
  leave: () => MinimalAnimationInstance;
};

const createAnimationComp = ({
  parent,
  children = emptyAnimationChildren,
}: CreateAnimationProps): AnimationComp => ({
  enter: createAnimationEnter(parent.enter, children.enter),
  leave: createAnimationLeave(parent.leave, children.leave),
});

const createParallelAnimationInstance = (
  instances: Array<() => MinimalAnimationInstance>,
): MinimalAnimationInstance => {
  const parallelInstance = {
    play: () => {
      const anims = instances.map((getInstance) => {
        const instance = getInstance();
        instance.play();
        return instance.finished;
      });
      parallelInstance.finished = Promise.all(anims).then(() => {});
    },
    finished: Promise.resolve(),
  };
  return parallelInstance;
};

export type ParallelAnimationComp = {
  enter: Array<() => MinimalAnimationInstance>;
  leave: Array<() => MinimalAnimationInstance>;
};

const createParallelAnimationComp = (
  animations: ParallelAnimationComp,
): AnimationComp => ({
  enter: () => createParallelAnimationInstance(animations.enter),
  leave: () => createParallelAnimationInstance(animations.leave),
});

export {
  emptyAnimationChildren,
  createAnimationTimeline,
  createAnimationEnter,
  createAnimationLeave,
  createAnimationComp,
  createParallelAnimationComp,
};
