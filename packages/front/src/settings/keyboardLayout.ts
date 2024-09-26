import qwerty from "./layout/qwerty.json";
import azerty from "./layout/azerty.json";
import { keyboardLayoutName, KeyboardLayoutName } from "./settings";

export type KeyLayout = {
  primary: string;
  all: Array<string>;
  size: string;
  used: boolean;
};

export type RowLayout = Array<KeyLayout>;

export type KeyboardLayout = {
  layout: Array<RowLayout>;
  layoutFlat: Array<KeyLayout>;
  extra: Array<KeyLayout>;
};

const layouts: Record<KeyboardLayoutName, typeof qwerty> = { qwerty, azerty };

export type HigherKeyboard = (keySet: Set<string>) => KeyboardLayout;

const resetLayout = (layout: Array<RowLayout>) => {
  layout.forEach((row) => row.forEach((key) => (key.used = false)));
};

const create = (layoutName: string): HigherKeyboard => {
  if (!keyboardLayoutName.includes(layoutName))
    throw new Error(`Invalid keyboard layout: ${layoutName}`);
  const source = layouts[layoutName];
  const layout = source.keys.map((row) =>
    row.map((key) => ({
      primary: key[0],
      all: key,
      size: source.size[key[0] as keyof typeof source.size] || "",
      used: false,
    })),
  );

  const layoutFlat = layout.flat();

  return (keySet: Set<string>) => {
    resetLayout(layout);
    let extra = [] as Array<KeyLayout>;
    keySet.forEach((key) => {
      const lKey = layoutFlat.find((k) => k.all.includes(key));
      if (lKey) {
        lKey.used = true;
      } else {
        extra.push({
          primary: key,
          all: [key],
          size: "",
          used: true,
        });
      }
    });
    return { layout, extra, layoutFlat };
  };
};

export default { create };
