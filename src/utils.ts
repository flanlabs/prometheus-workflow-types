import { SWITCH_OUTPUT_HANDLE_ID_BASE } from "./types.js";

export const switchBlockOutputHandleForIndex = (index: number): string =>
  `${SWITCH_OUTPUT_HANDLE_ID_BASE}-${index}`;
