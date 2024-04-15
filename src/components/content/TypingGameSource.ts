import { GameModeKind } from "../gameMode/GameMode";
import {
  type GameOptions,
  WordsGenerationCategory,
  ContentTypeKind,
} from "../gameMode/GameOptions";
import type { ContentData, Paragraph } from "./Content";
import Content from "./Content";
import type { Paragraphs } from "./ContentList";
import { randomQuote, randomWords } from "./randomContent";

// NOTE: Static or Dynamic handler here
type SourceProps = {
  random: Array<string>;
  custom: string;
};

type GetSourceProps = {
  opts: GameOptions;
  sources: SourceProps;
  wordNumber: number;
};

type NestedSourceProps = {
  src: () => ContentData;
  following: boolean;
};

const getSource = ({
  opts,
  sources,
  wordNumber,
}: GetSourceProps): NestedSourceProps => {
  if (opts.contentType.kind === ContentTypeKind.custom) {
    return { src: () => Content.parse(sources.custom), following: false };
  }
  switch (opts.generation.category) {
    case WordsGenerationCategory.words1k:
      return {
        src: () => Content.parseWords(randomWords(sources.random)(wordNumber)),
        following: true,
      };
    case WordsGenerationCategory.quotes:
      return {
        src: () => Content.parse(randomQuote(sources.random)),
        following: false,
      };
  }
};

export type ContentHandler = {
  data: ContentData;
  next: () => (prev: ContentData) => ContentHandler;
};

export type GetContent = () => ContentHandler;

const mergeSource = (
  prev: ContentData,
  next: ContentData,
  following: boolean,
) => {
  const nextParagraphs = Content.deepClone(next.paragraphs);
  const prevParagraphs = Content.deepClone(prev.paragraphs);
  const prevLast: Paragraph = prevParagraphs.pop() || [];

  let paragraphs;
  if (following) {
    const [first, ...rest] = Content.deepClone(nextParagraphs);
    const newParagraph = prevLast.concat(Content.makeSpace(), first);
    paragraphs = prevParagraphs.concat([newParagraph, ...rest]);
  } else {
    prevLast.push(Content.makeEnter());
    paragraphs = prevParagraphs.concat([prevLast, ...nextParagraphs]);
  }
  const keySet = new Set([...prev.keySet, ...next.keySet]);
  return { paragraphs, keySet };
};

const next = (nextContent: GetContent, following: boolean) => () => {
  const next = nextContent();
  return (prev: ContentData) => {
    return {
      data: mergeSource(prev, next.data, following),
      next: next.next,
    };
  };
};

const makeSourceNested = (props: GetSourceProps): GetContent => {
  const nestedSource =
    (props: NestedSourceProps): GetContent =>
    () => ({
      data: props.src(),
      next: next(nestedSource(props), props.following),
    });
  return nestedSource(getSource(props));
};

export type GameModeContent =
  | {
      kind: GameModeKind.random;
      getContent: GetContent;
    }
  | {
      kind: GameModeKind.timer;
      time: number;
      getContent: GetContent;
    };

const makeGetContent = (
  opts: GameOptions,
  sources: SourceProps,
): GameModeContent => {
  switch (opts.mode) {
    case GameModeKind.random:
      return {
        kind: GameModeKind.random,
        getContent: makeSourceNested({
          opts,
          sources,
          wordNumber: opts.random.value,
        }),
      };
    case GameModeKind.timer:
      return {
        kind: GameModeKind.timer,
        getContent: makeSourceNested({
          opts,
          sources,
          wordNumber: 2,
        }),
        time: opts.timer.value * 1000,
      };
  }
};

export { makeGetContent };
