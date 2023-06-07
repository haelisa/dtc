export const I18nEn: I18nInterface = {
    saveBtn: 'Save',
    cancelBtn: 'Cancel',

    loadImage: 'Load image',
    loadImageUrl: 'Load image from URL',
    loading: 'Loading',
    loadError: 'Error loading %@',
    removeImage: 'Remove image',

    sizes: {
        small: 'Small',
        medium: 'Medium',
        large: 'Large'
    },

    undo: 'Undo',
    redo: 'Redo',
    clear: 'Clear',

    colors: {
        black: 'Black',
        white: 'White',
        yellow: 'Yellow',
        red: 'Red',
        green: 'Green',
        blue: 'Blue',
        purple: 'Purple',
    },

    tools: {
        brush: 'Brush'
    }
};

export const i18nLanguages: { [name: string]: I18nInterface } = {

    en: I18nEn
};

export interface I18nInterface {
    saveBtn?: string;
    cancelBtn?: string;

    loadImage?: string;
    loadImageUrl?: string;
    loading?: string;
    loadError?: string;
    removeImage?: string;

    sizes?: { [name: string]: string };

    undo?: string;
    redo?: string;
    clear?: string;

    colors?: { [name: string]: string };

    tools?: { [name: string]: string };
}