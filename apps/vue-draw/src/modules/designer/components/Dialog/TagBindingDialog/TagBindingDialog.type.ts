export interface ConditionalRule {
	id: string;
	continue: boolean;
	condition: string;
	expression: string;
}

export type TagBindingMode = 'direct' | 'expression' | 'conditional';

export interface TagBindingData {
	tag?: string;
}

export interface TagBindingDialogProps {
	open?: boolean;
	initialData?: TagBindingData;
}
