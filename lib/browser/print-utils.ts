let nextId = 0;
export const getNextId = function () {
  return ++nextId;
};

// Stock page sizes
export const PDFPageSizes: Record<string, ElectronInternal.MediaSize> = {
  Letter: {
    custom_display_name: 'Letter',
    height_microns: 279400,
    name: 'NA_LETTER',
    width_microns: 215900
  },
  Legal: {
    custom_display_name: 'Legal',
    height_microns: 355600,
    name: 'NA_LEGAL',
    width_microns: 215900
  },
  Tabloid: {
    height_microns: 431800,
    name: 'NA_LEDGER',
    width_microns: 279400,
    custom_display_name: 'Tabloid'
  },
  A0: {
    custom_display_name: 'A0',
    height_microns: 1189000,
    name: 'ISO_A0',
    width_microns: 841000
  },
  A1: {
    custom_display_name: 'A1',
    height_microns: 841000,
    name: 'ISO_A1',
    width_microns: 594000
  },
  A2: {
    custom_display_name: 'A2',
    height_microns: 594000,
    name: 'ISO_A2',
    width_microns: 420000
  },
  A3: {
    custom_display_name: 'A3',
    height_microns: 420000,
    name: 'ISO_A3',
    width_microns: 297000
  },
  A4: {
    custom_display_name: 'A4',
    height_microns: 297000,
    name: 'ISO_A4',
    is_default: 'true',
    width_microns: 210000
  },
  A5: {
    custom_display_name: 'A5',
    height_microns: 210000,
    name: 'ISO_A5',
    width_microns: 148000
  },
  A6: {
    custom_display_name: 'A6',
    height_microns: 148000,
    name: 'ISO_A6',
    width_microns: 105000
  }
} as const;

export const paperFormats: Record<string, ElectronInternal.PageSize> = {
  letter: { width: 8.5, height: 11 },
  legal: { width: 8.5, height: 14 },
  tabloid: { width: 11, height: 17 },
  ledger: { width: 17, height: 11 },
  a0: { width: 33.1, height: 46.8 },
  a1: { width: 23.4, height: 33.1 },
  a2: { width: 16.54, height: 23.4 },
  a3: { width: 11.7, height: 16.54 },
  a4: { width: 8.27, height: 11.7 },
  a5: { width: 5.83, height: 8.27 },
  a6: { width: 4.13, height: 5.83 }
} as const;

export const isValidCustomPageSize = (width: number, height: number) => {
  return [width, height].every(x => x > 352);
};

export function validateBoolean (name: string, value: any) {
  if (value !== undefined && typeof value !== 'boolean') {
    throw new Error(`${name} must be a Boolean`);
  }
}

export function validateNumber (name: string, value: any) {
  if (value !== undefined && typeof value !== 'number') {
    throw new Error(`${name} must be a Number`);
  }
}

export function validateString (name: string, value: any) {
  if (value !== undefined && typeof value !== 'string') {
    throw new Error(`${name} must be a String`);
  }
}
