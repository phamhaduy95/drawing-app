import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, within, userEvent, fn } from 'storybook/test';
import { ref } from 'vue';
import { SuggestionInput } from '@components/SuggestionInput';

const mockedOnModelValueUpdate = fn();

const meta = {
	title: 'Components/FormField/SuggestionInput',
	component: SuggestionInput,
	tags: ['autodocs'],
	argTypes: {
		triggerChar: { control: 'text' }
	},
	args: {
		triggerChar: '@',
		placeholder: 'Type @ to see suggestions',
		suggestions: ['apple', 'banana', 'cherry', 'date', 'elderberry'],
		'onUpdate:modelValue': mockedOnModelValueUpdate
	},
	beforeEach() {
		mockedOnModelValueUpdate.mockClear();
	}
} satisfies Meta<typeof SuggestionInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => ({
		components: { SuggestionInput },
		setup() {
			const value = ref(args.modelValue || '');

			const handleValueChange = (val: string) => {
				if (args['onUpdate:modelValue']) {
					args['onUpdate:modelValue'](val);
				}
				value.value = val;
			};

			return () => (
				<div style="padding-bottom: 200px;">
					<SuggestionInput
						{...args}
						modelValue={value.value}
						onUpdate:modelValue={handleValueChange}
					/>
					<p aria-label="Displayed value">Value: {value.value}</p>
				</div>
			);
		}
	}),
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByPlaceholderText('Type @ to see suggestions');
		const body = within(document.body);
		
		await step('Type regular text', async () => {
			await userEvent.type(input, 'I like ');
			
			expect(mockedOnModelValueUpdate).toBeCalled();
			const displayedValue = canvas.getByLabelText('Displayed value');
			expect(displayedValue).toHaveTextContent('Value: I like');
		});

		await step('Type trigger char to open suggestions', async () => {
			await userEvent.type(input, '@');
			
			// Popover should appear in the body
			const popoverItem = await body.findByText('apple');
			expect(popoverItem).toBeInTheDocument();
		});

		await step('Filter suggestions', async () => {
			await userEvent.type(input, 'b');
			
			// "banana" should be visible, "apple" should not
			const banana = await body.findByText('banana');
			expect(banana).toBeInTheDocument();
			
			const apple = body.queryByText('apple');
			expect(apple).not.toBeInTheDocument();
		});

		await step('Select a suggestion via keyboard', async () => {
			// 'banana' is currently the only item, so it's active. Press Enter.
			await userEvent.type(input, '{Enter}');
			
			// Should replace '@b' with '@banana '
			const displayedValue = canvas.getByLabelText('Displayed value');
			expect(displayedValue).toHaveTextContent('Value: I like @banana');
		});
	}
};
