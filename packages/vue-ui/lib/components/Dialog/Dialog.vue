<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
	import { Dialog as ArkDialog } from '@ark-ui/vue/dialog';
	import { XMarkIcon } from '@heroicons/vue/20/solid';

	import type { DialogEmits, DialogProps, DialogSlots } from './Dialog.type';

	import '@packages/styles/components/Dialog.css';

	withDefaults(defineProps<DialogProps>(), {
		modal: true,
		preventScroll: true,
		closeOnEscape: true,
		closeOnInteractOutside: true,
		role: 'dialog',
		open: undefined
	});

	const emit = defineEmits<DialogEmits>();

	defineSlots<DialogSlots>();
</script>

<template>
	<ArkDialog.Root
		:open="open"
		:default-open="defaultOpen"
		:lazy-mount="lazyMount"
		:unmount-on-exit="unmountOnExit"
		:modal="modal"
		:role="role"
		:prevent-scroll="preventScroll"
		:close-on-escape="closeOnEscape"
		:close-on-interact-outside="closeOnInteractOutside"
		:initial-focus-el="initialFocusEl"
		:final-focus-el="finalFocusEl"
		@update:open="emit('update:open', $event)"
	>
		<ArkDialog.Trigger
			v-if="$slots.trigger"
			class="Dialog_Trigger"
			as-child
		>
			<slot name="trigger" />
		</ArkDialog.Trigger>

		<Teleport to="body">
			<ArkDialog.Backdrop class="Dialog_Backdrop" />
			<ArkDialog.Positioner class="Dialog_Positioner">
				<ArkDialog.Content
					class="Dialog_Content"
					v-bind="$attrs"
				>
					<ArkDialog.CloseTrigger class="Dialog_CloseTrigger">
						<slot name="closeIcon">
							<XMarkIcon />
						</slot>
					</ArkDialog.CloseTrigger>

					<ArkDialog.Title
						v-if="title || $slots.title"
						class="Dialog_Title"
					>
						<slot name="title">
							{{ title }}
						</slot>
					</ArkDialog.Title>

					<ArkDialog.Description
						v-if="description || $slots.description"
						class="Dialog_Description"
					>
						<slot name="description">
							{{ description }}
						</slot>
					</ArkDialog.Description>

					<div class="Dialog_Body">
						<slot />
					</div>

					<div
						v-if="$slots.footer"
						class="Dialog_Footer"
					>
						<slot name="footer" />
					</div>
				</ArkDialog.Content>
			</ArkDialog.Positioner>
		</Teleport>
	</ArkDialog.Root>
</template>
