import type { HTMLAttributes } from 'vue';

export interface DialogProps extends /* @vue-ignore */ HTMLAttributes {
	open?: boolean;
	defaultOpen?: boolean;
	lazyMount?: boolean;
	unmountOnExit?: boolean;
	modal?: boolean;
	role?: 'dialog' | 'alertdialog';
	preventScroll?: boolean;
	closeOnEscape?: boolean;
	closeOnInteractOutside?: boolean;
	initialFocusEl?: () => HTMLElement | null;
	finalFocusEl?: () => HTMLElement | null;
	title?: string;
	description?: string;
}

export type DialogEmits = {
	'update:open': [open: boolean];
	openChange: [details: { open: boolean }];
};

export type DialogSlots = {
	trigger?: () => void;
	title?: () => void;
	description?: () => void;
	default?: () => void;
	footer?: () => void;
	closeIcon?: () => void;
};
