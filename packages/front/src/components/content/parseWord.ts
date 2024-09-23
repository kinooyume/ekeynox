import { WordStatus } from "../prompt/PromptWord.tsx";
import { KeyFocus, KeyStatus } from "../metrics/KeyMetrics.ts";
import List from "../List.ts";
import { keyHooks } from "./ContentList.ts.bck";
import { MetaWord } from "./ContentList.ts.bck";

export const parseWord = (keySet: Set<string>) => (word: string): MetaWord => {
    const keys = List.makeDLinkedListFromArray(word.split(""), (key) => {
        /* Side effect */
        keySet.add(key);
        return {
            value: {
                key,
                status: KeyStatus.unstart,
                focus: KeyFocus.unset,
            },
            hooks: keyHooks,
        };
    });
    if (!keys) throw new Error("Unexpected empty keys");
    return {
        value: {
            focus: false,
            status: WordStatus.unstart,
            wasCorrect: false,
            wpm: 0,
            isSeparator: word.trim() === "",
            keys,
        }, hooks: WordHooks
    };
};

