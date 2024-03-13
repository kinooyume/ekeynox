import qwerty from "./layout/qwerty.json";
import azerty from "./layout/azerty.json";

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

const getDefault: () => KeyboardLayout = () => ({
  layout: [],
  layoutFlat: [],
  extra: [],
});

const kblayout = {
  qwerty,
  azerty,
};

const create = (
  layoutName: string,
  keySet: Set<string>,
): KeyboardLayout | null => {
  const source = kblayout[layoutName as keyof typeof kblayout];
  if (!source) return null;
  const layout = source.keys.map((row) =>
    row.map((key) => ({
      primary: key[0],
      all: key,
      size: source.size[key[0] as keyof typeof source.size] || "",
      used: false,
    })),
  );
  let extra = [] as Array<KeyLayout>;
  const layoutFlat = layout.flat();
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

export default { getDefault, create };
