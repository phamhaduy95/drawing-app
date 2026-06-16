export interface ConditionalRule {
	id: string;
	condition: string;
	expression: string;
}

export interface TagBindingData {
	tag?: string;
	expression?: string;
	rules?: ConditionalRule[];
}

export interface TagBindingDialogProps {
	open?: boolean;
	initialData?: TagBindingData;
}
