import { CategoryKind, TypingOptions, WordsGenerationCategory } from "~/typingOptions/typingOptions";
import type { ContentData } from ".";
import Content from ".";
import { randomQuote, randomWords } from "./randomContent";
import { Paragraph } from "./paragraphs/types";
import { deepCloneParagraphs } from "./paragraphs";
import { createSpace } from "./word";

// TODO: On a dit, Fixed or Loop

// NOTE: Static or Dynamic handler here
export type SourceProps = {
  random: Array<string>;
  custom: string;
};

type GetSourceProps = {
  opts: TypingOptions;
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
  following?: Paragraph;
  parts?: Array<Paragraph>;
  new: GetContent;
  next: NextContent;
};

// PERF: du coup, plutot que d'avoir ca
// on pourrait juste le faire directement dans le store

const mergeSource = (
  prev: ContentData,
  next: ContentData,
  following: boolean,
) => {
  const nextParagraphs = deepCloneParagraphs(next.paragraphs);
  const prevParagraphs = deepCloneParagraphs(prev.paragraphs);
  const prevLast: Paragraph = prevParagraphs.pop() || [];

  let paragraphs;
  if (following) {
    const [first, ...rest] = deepCloneParagraphs(nextParagraphs);
    const newParagraph = prevLast.concat(createSpace(), first);
    paragraphs = prevParagraphs.concat([newParagraph, ...rest]);
  } else {
    //  prevLast.push(Content.makeEnter());
    paragraphs = prevParagraphs.concat([prevLast, ...nextParagraphs]);
  }
  const wordsCount = prev.wordsCount + next.wordsCount;
  const keySet = new Set([...prev.keySet, ...next.keySet]);
  return { paragraphs, keySet, wordsCount };
};

const next = (nextContent: GetContent, following: boolean) => () => {
  const next = nextContent();
  return (prev: ContentData): ContentHandler => {
    // add enter at the begin data.paragraphs
    // if (!following) next.data.paragraphs.unshift([Content.makeEnter()]);
    return {
      data: mergeSource(prev, next.data, following),
      following: following ? next.data.paragraphs[0] : undefined,
      parts: !following ? next.data.paragraphs : undefined,
      new: next.new,
      next: next.next,
    };
  };
};

const makeSourceNested = (firstProps: GetSourceProps): GetContent => {
  const nestedSource =
    (props: NestedSourceProps): GetContent =>
    () => ({
      data: props.src(),
      new: nestedSource(props),
      next: next(nestedSource(props), props.following),
    });
  return nestedSource(getSource(firstProps));
};

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

export { makeRedoContent, makeSourceNested };
