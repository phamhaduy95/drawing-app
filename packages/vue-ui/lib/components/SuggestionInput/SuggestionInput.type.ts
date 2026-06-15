import type { HTMLAttributes } from 'vue';
import type { CommonFieldProps } from '@components/BaseField';

export interface SuggestionItem {
	label: string;
	value: string;
}

export interface SuggestionInputProps extends /* @vue-ignore */ HTMLAttributes, CommonFieldProps<string> {
	modelValue?: string;
	defaultValue?: string;
	suggestions: (string | SuggestionItem)[];
	triggerChar?: string;
	rows?: number;
}

export type SuggestionInputEmits = {
	'update:modelValue': [value: string];
};
