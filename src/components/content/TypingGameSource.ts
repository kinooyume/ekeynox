import { GameModeKind } from "../gameMode/GameMode";
import {
  type GameOptions,
  WordsGenerationCategory,
  CategoryKind,
} from "../gameMode/GameOptions";
import type { ContentData, Paragraph } from "./Content";
import Content from "./Content";
import { randomQuote, randomWords } from "./randomContent";

// NOTE: Static or Dynamic handler here
export type SourceProps = {
  random: Array<string>;
  custom: string;
};

type GetSourceProps = {
  opts: GameOptions;
  sources: SourceProps;
  wordsCount: number;
};

type NestedSourceProps = {
  src: () => ContentData;
  following: boolean;
};

const getSource = ({
  opts,
  sources,
  wordsCount: wordNumber,
}: GetSourceProps): NestedSourceProps => {
  if (opts.categorySelected.kind === CategoryKind.custom) {
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

type NextContent = () => (prev: ContentData) => ContentHandler;

export type GetContent = () => ContentHandler;

export type ContentHandler = {
  data: ContentData;
  new: GetContent;
  next: NextContent;
};

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
  const wordsCount = prev.wordsCount + next.wordsCount;
  const keySet = new Set([...prev.keySet, ...next.keySet]);
  return { paragraphs, keySet, wordsCount };
};

const next = (nextContent: GetContent, following: boolean) => () => {
  const next = nextContent();
  return (prev: ContentData): ContentHandler => {
    return {
      data: mergeSource(prev, next.data, following),
      new: next.new,
      next: next.next,
    };
  };
};

const makeSourceNested = (props: GetSourceProps): GetContent => {
  const nestedSource =
    (props: NestedSourceProps): GetContent =>
    () => ({
      data: props.src(),
      new: nestedSource(props),
      next: next(nestedSource(props), props.following),
    });
  return nestedSource(getSource(props));
};

// const emptyContentHandler =
//   (nextGetContent: GetContent): NextContent =>
//   () =>
//   (prevData: ContentData) => ({
//     data: prevData,
//     next: nextGetContent().next,
//   });

const makeRedoContent = (
  content: ContentData,
  nextGetContent: GetContent,
): GetContent => {
  return () => ({
    data: content,
    new: makeRedoContent(content, nextGetContent),
    next: nextGetContent().next,
  });
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
  switch (opts.modeSelected) {
    case GameModeKind.random:
      return {
        kind: GameModeKind.random,
        getContent: makeSourceNested({
          opts,
          sources,
          wordsCount: opts.random,
        }),
      };
    case GameModeKind.timer:
      return {
        kind: GameModeKind.timer,
        getContent: makeSourceNested({
          opts,
          sources,
          wordsCount: 40,
        }),
        time: opts.timer * 1000,
      };
  }
};

export { makeGetContent, makeRedoContent };
