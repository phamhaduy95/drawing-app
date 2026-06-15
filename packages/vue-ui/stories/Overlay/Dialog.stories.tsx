import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, within, userEvent, fn } from 'storybook/test';
import { ref } from 'vue';
import { Dialog } from '@components/Dialog';
import { Button } from '@components/Button';

const mockedOnOpenChange = fn();

const meta = {
	title: 'Components/Overlay/Dialog',
	component: Dialog,
	tags: ['autodocs'],
	argTypes: {
		open: { control: 'boolean' },
		modal: { control: 'boolean' },
		closeOnEscape: { control: 'boolean' },
		role: { control: 'select', options: ['dialog', 'alertdialog'] }
	},
	args: {
		title: 'Confirmation',
		description: 'Are you sure you want to proceed?',
		'onUpdate:open': mockedOnOpenChange
	},
	beforeEach() {
		mockedOnOpenChange.mockClear();
	}
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => ({
		components: { Dialog, Button },
		setup() {
			const isOpen = ref(args.open ?? false);
			
			const handleOpenChange = (open: boolean) => {
				if (args['onUpdate:open']) {
					args['onUpdate:open'](open);
				}
				isOpen.value = open;
			};

			return () => (
				<div>
					<Dialog
						{...args}
						open={isOpen.value}
						onUpdate:open={handleOpenChange}
					>
						{{
							trigger: () => <Button>Open Dialog</Button>,
							default: () => (
								<div style="padding: 16px 0;">
									This action cannot be undone.
								</div>
							),
							footer: () => (
								<>
									<Button variant="outlined" onClick={() => handleOpenChange(false)}>Cancel</Button>
									<Button variant="contained" onClick={() => handleOpenChange(false)}>Confirm</Button>
								</>
							)
						}}
					</Dialog>
				</div>
			);
		}
	}),
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		
		await step('Open dialog', async () => {
			const triggerButton = canvas.getByRole('button', { name: 'Open Dialog' });
			await userEvent.click(triggerButton);
		});

		// The dialog is rendered via Teleport to body, so we query document.body
		const body = within(document.body);

		await step('Check if dialog content is visible', async () => {
			const dialog = await body.findByRole('dialog');
			expect(dialog).toBeInTheDocument();
			
			const title = body.getByText('Confirmation');
			expect(title).toBeInTheDocument();
			
			const description = body.getByText('Are you sure you want to proceed?');
			expect(description).toBeInTheDocument();
			
			const bodyContent = body.getByText('This action cannot be undone.');
			expect(bodyContent).toBeInTheDocument();
		});

		await step('Close dialog via Cancel button', async () => {
			const cancelButton = body.getByRole('button', { name: 'Cancel' });
			await userEvent.click(cancelButton);
			
			expect(mockedOnOpenChange).toBeCalledWith(false);
		});
	}
};
