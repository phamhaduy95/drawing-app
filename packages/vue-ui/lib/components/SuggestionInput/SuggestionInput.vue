<script setup lang="ts">
	import { computed, nextTick, ref, watch, useId } from 'vue';
	import { Popover as ArkPopover } from '@ark-ui/vue/popover';
	import { BaseField } from '@components/BaseField';
	import { IconButton } from '@components/IconButton';
	import { XMarkIcon } from '@heroicons/vue/20/solid';

	import type {
		SuggestionInputEmits,
		SuggestionInputProps,
		SuggestionItem
	} from './SuggestionInput.type';

	import '@packages/styles/components/SuggestionInput.css';
	import '@packages/styles/components/TextArea.css';
	import '@packages/styles/components/TextInput.css';

	defineOptions({ inheritAttrs: false });

	const props = withDefaults(defineProps<SuggestionInputProps>(), {
		modelValue: undefined,
		defaultValue: '',
		triggerChar: '@',
		size: 'md',
		required: false,
		disabled: false,
		clearable: false,
		rows: 2,
		as: 'textarea'
	});

	const emit = defineEmits<SuggestionInputEmits & { valueChange: [e: InputEvent] }>();

	const inputId = useId();
	const supportingTextId = useId();

	const internalValue = ref(props.defaultValue);
	const inputValue = computed(() => props.modelValue ?? internalValue.value);

	const isOpen = ref(false);
	const searchQuery = ref('');
	const triggerIndex = ref(-1);
	const inputRef = ref<HTMLTextAreaElement | null>(null);

	const activeIndex = ref(0);

	const normalizedSuggestions = computed(() => {
		return props.suggestions.map((s) => {
			if (typeof s === 'string') return { label: s, value: s };
			return s;
		});
	});

	const filteredSuggestions = computed(() => {
		if (!searchQuery.value) return normalizedSuggestions.value;
		const lowerQuery = searchQuery.value.toLowerCase();
		return normalizedSuggestions.value.filter(
			(s) =>
				s.label.toLowerCase().includes(lowerQuery) || s.value.toLowerCase().includes(lowerQuery)
		);
	});

	const parsedSegments = computed(() => {
		// Escape the trigger char for RegExp if necessary
		const trigger = props.triggerChar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const regex = new RegExp(`(${trigger}[\\w\\-]+)`, 'g');
		const text = inputValue.value;
		let lastIndex = 0;
		const segments = [];

		let match;
		while ((match = regex.exec(text)) !== null) {
			if (match.index > lastIndex) {
				segments.push({ isMatch: false, text: text.slice(lastIndex, match.index) });
			}
			const query = match[0].slice(props.triggerChar.length);
			const isValid = props.suggestions.some((s) => {
				const val = typeof s === 'string' ? s : s.value;
				return val === query;
			});

			segments.push({ isMatch: isValid, text: match[0] });
			lastIndex = regex.lastIndex;
		}
		if (lastIndex < text.length) {
			segments.push({ isMatch: false, text: text.slice(lastIndex) });
		}

		if (segments.length === 0) {
			segments.push({ isMatch: false, text: '' });
		}

		return segments;
	});

	watch(searchQuery, () => {
		activeIndex.value = 0;
	});

	const handleInput = (e: Event) => {
		const target = e.target as HTMLTextAreaElement;
		const val = target.value;
		internalValue.value = val;
		emit('update:modelValue', val);
		emit('valueChange', e as InputEvent);

		const cursor = target.selectionStart || 0;
		const textBeforeCursor = val.slice(0, cursor);
		const lastTriggerIndex = textBeforeCursor.lastIndexOf(props.triggerChar);

		if (lastTriggerIndex !== -1) {
			const isStartOrSpace =
				lastTriggerIndex === 0 ||
				val[lastTriggerIndex - 1] === ' ' ||
				val[lastTriggerIndex - 1] === '\n';
			if (isStartOrSpace) {
				const query = textBeforeCursor.slice(lastTriggerIndex + 1);
				if (!query.includes(' ') && !query.includes('\n')) {
					searchQuery.value = query;
					triggerIndex.value = lastTriggerIndex;
					isOpen.value = true;
					return;
				}
			}
		}
		isOpen.value = false;
	};

	const selectSuggestion = (suggestion: SuggestionItem) => {
		const before = inputValue.value.slice(0, triggerIndex.value);
		const after = inputValue.value.slice(triggerIndex.value + 1 + searchQuery.value.length);
		const newValue = before + props.triggerChar + suggestion.value + ' ' + after;

		internalValue.value = newValue;
		emit('update:modelValue', newValue);
		isOpen.value = false;

		nextTick(() => {
			const el = inputRef.value;
			if (el && typeof el.focus === 'function') {
				el.focus();
				const newCursorPos = before.length + 1 + suggestion.value.length + 1;
				el.setSelectionRange(newCursorPos, newCursorPos);
			}
		});
	};

	const handleClear = () => {
		emit('update:modelValue', '');
		internalValue.value = '';
	};

	const shouldShowClearIcon = computed(
		() => props.clearable && typeof inputValue.value === 'string' && inputValue.value.length > 0
	);

	const handleKeyDown = (e: KeyboardEvent) => {
		if (!isOpen.value) return;

		if (e.key === 'Escape') {
			isOpen.value = false;
			e.preventDefault();
			e.stopPropagation();
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			activeIndex.value = (activeIndex.value + 1) % filteredSuggestions.value.length;
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			activeIndex.value =
				(activeIndex.value - 1 + filteredSuggestions.value.length) %
				filteredSuggestions.value.length;
		} else if (e.key === 'Enter' || e.key === 'Tab') {
			if (filteredSuggestions.value.length > 0) {
				e.preventDefault();
				e.stopPropagation();
				selectSuggestion(filteredSuggestions.value[activeIndex.value] as SuggestionItem);
			}
		}
	};
</script>

<template>
	<ArkPopover.Root
		:open="isOpen"
		:auto-focus="false"
		:positioning="{
			placement: 'bottom-start',
			strategy: 'fixed'
		}"
		@update:open="isOpen = $event"
	>
		<ArkPopover.Anchor as-child>
			<BaseField
				class="SuggestionInput TextArea"
				:style="{ '--input-rows': rows }"
				:label="label"
				:supporting-text="supportingText"
				:status="status"
				:required="required"
				:input-id="inputId"
				:disabled="disabled"
				:supporting-text-id="supportingText ? supportingTextId : undefined"
				:size="size"
			>
				<div
					class="BaseField_Field"
					:data-clearable="clearable"
					:data-disabled="disabled"
					:data-required="required"
					:data-status="status"
					style="position: relative"
				>
					<div
						class="SuggestionInput_Overlay"
						aria-hidden="true"
					>
						<template
							v-for="(segment, i) in parsedSegments"
							:key="i"
						>
							<span
								v-if="segment.isMatch"
								class="SuggestionInput_Chip"
							>
								{{ segment.text }}
							</span>
							<span v-else>{{ segment.text }}</span>
						</template>
					</div>

					<component
						:is="as"
						:id="inputId"
						ref="inputRef"
						:class="[
							as === 'textarea' ? 'TextArea_Input' : 'TextInput_Input',
							'SuggestionInput_Input'
						]"
						:placeholder="placeholder"
						:disabled="disabled"
						:aria-describedby="supportingText ? supportingTextId : undefined"
						:aria-invalid="status === 'error'"
						:value="inputValue"
						:required="required"
						:rows="as === 'textarea' ? rows : undefined"
						:type="as === 'input' ? 'text' : undefined"
						v-bind="$attrs"
						@input="handleInput"
						@keydown="handleKeyDown"
					/>

					<div class="BaseField_Trailing">
						<IconButton
							v-if="shouldShowClearIcon"
							aria-label="Clear"
							:size="size"
							variant="text"
							color="secondary"
							@click="handleClear"
						>
							<XMarkIcon />
						</IconButton>
					</div>
				</div>
			</BaseField>
		</ArkPopover.Anchor>
		<Teleport to="body">
			<ArkPopover.Positioner
				:style="{ zIndex: 10000 }"
				class="SuggestionInput_Positioner"
			>
				<ArkPopover.Content class="SuggestionInput_Content">
					<div
						v-if="filteredSuggestions.length > 0"
						class="SuggestionInput_Dropdown"
					>
						<div
							v-for="(item, index) in filteredSuggestions"
							:key="item.value + index"
							class="SuggestionInput_Item"
							:data-highlighted="index === activeIndex ? '' : undefined"
							@mousedown.prevent="selectSuggestion(item)"
						>
							{{ item.label }}
						</div>
					</div>
					<div
						v-else
						class="SuggestionInput_Empty"
					>
						No suggestions found
					</div>
				</ArkPopover.Content>
			</ArkPopover.Positioner>
		</Teleport>
	</ArkPopover.Root>
</template>
