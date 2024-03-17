import { WordStatus } from "../prompt/PromptWord.tsx";
import { PromptKeyFocus, PromptKeyStatus } from "../metrics/KeyMetrics.ts";
import List from "../List.ts";
import { keyHooks } from "./ContentNav.ts";
import { MetaWord } from "./ContentList.ts";

export const parseWord = (keySet: Set<string>) => (word: string): MetaWord => {
    const keys = List.makeDLinkedListFromArray(word.split(""), (key) => {
        /* Side effect */
        keySet.add(key);
        return {
            value: {
                key,
                status: PromptKeyStatus.unstart,
                focus: PromptKeyFocus.unset,
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

