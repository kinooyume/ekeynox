import anime from "animejs";

export interface AnimationProps {
  params: anime.AnimeParams;
  offset?: string;
}

export interface ParentAnimationProps extends AnimationProps {
  timeline: anime.AnimeParams;
}

export type AnimationChildren = {
  enter: AnimationProps[];
  leave: AnimationProps[];
};

export type AnimationParent = {
  enter: () => ParentAnimationProps;
  leave: () => ParentAnimationProps;
};

export type AnimationComp = {
  enter: () => anime.AnimeTimelineInstance;
  leave: () => anime.AnimeTimelineInstance;
};

const createAnimationTimeline = (
  timeline: anime.AnimeParams,
  anims: AnimationProps[],
) => {
  const a = anime.timeline({
    ...timeline,
    autoplay: false,
  });
  anims.forEach((step) => {
    a.add(step.params, step.offset);
  });
  return a;
};

export type CreateAnimationProps = {
  parent: AnimationParent;
  children: AnimationChildren;
};
const createAnimation = ({
  parent,
  children,
}: CreateAnimationProps): AnimationComp => ({
  enter: () => {
    const parentAnim = parent.enter();
    return createAnimationTimeline(parentAnim.timeline, [
      parentAnim,
      ...children.enter,
    ]);
  },
  leave: () => {
    const parentAnim = parent.leave();
    return createAnimationTimeline(parentAnim.timeline, [
      ...children.leave,
      parentAnim,
    ]);
  },
});

export { createAnimation };
