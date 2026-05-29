import { userEvent, within } from "storybook/test";

const DRAG_DELAY_MS = 50;

const wait = (ms: number = DRAG_DELAY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function dragItem(
  canvas: ReturnType<typeof within>,
  itemLabel: string,
  steps: number
) {
  const sourceElement = await canvas.findByRole("row", { name: itemLabel });
  sourceElement.focus();

  await userEvent.keyboard("{ArrowLeft}");
  await userEvent.keyboard("{Enter}");

  const key = steps > 0 ? "{ArrowDown}" : "{ArrowUp}";
  for (let i = 0; i < Math.abs(steps); i++) {
    await wait();
    await userEvent.keyboard(key);
  }
  await userEvent.keyboard("{Enter}");
}

export async function dragItemToList(
  canvas: ReturnType<typeof within>,
  itemLabel: string,
  tabCount: number = 1
) {
  const sourceElement = await canvas.findByRole("row", { name: itemLabel });
  sourceElement.focus();

  await userEvent.keyboard("{ArrowLeft}");
  await wait();
  await userEvent.keyboard("{Enter}");

  for (let i = 0; i < tabCount; i++) {
    await wait();
    await userEvent.keyboard("{Tab}");
  }

  await wait();
  await userEvent.keyboard("{Enter}");
}
