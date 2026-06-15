import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { BlankEditable } from '@components/BlankEditable';
import { ref } from 'vue';
import { expect, within, userEvent, fn } from 'storybook/test';

const mockedOnModelValueUpdate = fn();
const mockedOnValueChange = fn();

const meta = {
	title: 'Components/FormField/BlankEditable',
	component: BlankEditable,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded'
	},
	argTypes: {
		'onUpdate:modelValue': { action: 'update:modelValue' },
		onValueChange: { action: 'valueChange' },

		size: {
			control: 'select',
			options: ['xs', 'sm', 'md', 'lg']
		},
		activationMode: {
			control: 'select',
			options: ['focus', 'dblclick', 'click', 'none']
		},
		submitMode: {
			control: 'select',
			options: ['enter', 'blur', 'none', 'both']
		}
	},
	args: {
		placeholder: 'Enter text...',
		dataTestid: 'blank-editable-component',
		'onUpdate:modelValue': mockedOnModelValueUpdate,
		onValueChange: mockedOnValueChange,
	},
	render: (args) => ({
		components: { BlankEditable },
		setup() {
			return { args };
		},
		template: '<BlankEditable v-bind="args" />'
	}),
	beforeEach() {
		mockedOnModelValueUpdate.mockClear();
		mockedOnValueChange.mockClear();
	}
} satisfies Meta<typeof BlankEditable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		defaultValue: 'Hello World'
	},
	play: async ({ canvasElement, args, step }) => {
		const canvas = within(canvasElement);
		const { dataTestid = '' } = args;

		const container = canvas.getByTestId(dataTestid);
		await step('Check if container exists', async () => {
			expect(container).toBeInTheDocument();
		});

		await step('Check if preview shows defaultValue', async () => {
			const previewElement = canvas.getByText('Hello World');
			expect(previewElement).toBeInTheDocument();
		});

		await step('Click preview to enter edit mode', async () => {
			const previewElement = canvas.getByText('Hello World');
			await userEvent.click(previewElement);
		});

		await step('Check if input appears and is focused', async () => {
			const input = canvas.getByRole('textbox');
			expect(input).toBeInTheDocument();
			expect(input).toHaveValue('Hello World');
		});

		await step('Type a new value and submit', async () => {
			const input = canvas.getByRole('textbox');
			await userEvent.clear(input);
			await userEvent.type(input, 'New Text');
			// Submit by pressing Enter
			await userEvent.keyboard('{Enter}');
		});

		await step('Check if preview shows new value and valueChange is emitted', async () => {
			const previewElement = canvas.getByText('New Text');
			expect(previewElement).toBeInTheDocument();

			expect(mockedOnValueChange).toBeCalledWith(expect.objectContaining({ value: 'New Text' }));
			expect(mockedOnModelValueUpdate).toBeCalledWith('New Text');
		});
	}
};

export const Controllable: Story = {
	args: {
		modelValue: 'controlled value'
	},
	render: (args) => ({
		components: { BlankEditable },
		setup() {
			const { 'onUpdate:modelValue': onModelValueUpdate } = args;
			const value = ref(args.modelValue);
			const handleValueChange = (val: string) => {
				if (onModelValueUpdate) onModelValueUpdate(val);
				value.value = val;
			};
			return () => (
				<div>
					<BlankEditable {...args} modelValue={value.value} onUpdate:modelValue={handleValueChange} />
					<p style="margin-left: 8px; margin-top: 12px;" aria-label="Displayed value">
						Value: {value.value}
					</p>
				</div>
			);
		}
	}),
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Check if preview displays initial value', async () => {
			expect(canvas.getByText('controlled value')).toBeInTheDocument();
		});

		await step('Click preview to edit', async () => {
			const previewElement = canvas.getByText('controlled value');
			await userEvent.click(previewElement);
		});

		await step('Type in value into BlankEditable input and submit', async () => {
			const input = canvas.getByRole('textbox');
			await userEvent.clear(input);
			await userEvent.type(input, 'updated value');
			await userEvent.keyboard('{Enter}');
		});

		await step('Check if displayed value is updated', async () => {
			const displayedValue = canvas.getByLabelText('Displayed value');
			expect(displayedValue).toHaveTextContent('Value: updated value');
			expect(mockedOnModelValueUpdate).toBeCalled();
		});
	}
};

export const DoubleClickActivation: Story = {
	args: {
		activationMode: 'dblclick',
		defaultValue: 'Double click me'
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Check if input is not visible initially', async () => {
			const input = canvas.queryByRole('textbox');
			expect(input).not.toBeInTheDocument();
		});

		await step('Double click to edit', async () => {
			const preview = canvas.getByText('Double click me');
			await userEvent.dblClick(preview);
		});

		await step('Check if input appears', async () => {
			const input = canvas.getByRole('textbox');
			expect(input).toBeInTheDocument();
		});
	}
};

export const Disabled: Story = {
	args: {
		disabled: true,
		defaultValue: 'Disabled Editable'
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		await step('Check if click does not activate edit mode', async () => {
			const preview = canvas.getByText('Disabled Editable');
			await userEvent.click(preview);
			const input = canvas.queryByRole('textbox');
			expect(input).not.toBeInTheDocument();
		});
	}
};

export const Sizes: Story = {
	render: () => ({
		components: { BlankEditable },
		setup() {
			return () => (
				<div style="display: flex; flex-direction: column; gap: 16px;">
					<BlankEditable size="xs" defaultValue="xs size" />
					<BlankEditable size="sm" defaultValue="sm size" />
					<BlankEditable size="md" defaultValue="md size" />
					<BlankEditable size="lg" defaultValue="lg size" />
				</div>
			);
		}
	})
};
