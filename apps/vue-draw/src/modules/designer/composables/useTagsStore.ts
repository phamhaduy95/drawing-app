import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { MeasurementType } from '@/modules/designer/types/Tag.type';
import { mockedInitalTags } from '@/modules/designer/constant/defaultTags';

export const useTagsStore = defineStore('tags', () => {
	const tags = ref<MeasurementType[]>(mockedInitalTags);

	const tagOptions = computed(() => {
		return tags.value.flatMap((tag) => {
			const base = `Root.${tag.server.name}.${tag.functionBlock.name}`;
			const options: { label: string; value: string }[] = [];

			const tagFields = ['label', 'description', 'value', 'unit'];
			tagFields.forEach((field) => {
				const optionStr = `${base}.${field}`;
				options.push({ label: optionStr, value: optionStr });
			});

			return options;
		});
	});

	const tagMap = computed(() => {
		const map = new Map<string, string>();

		tags.value.forEach((tag) => {
			const base = `Root.${tag.server.name}.${tag.functionBlock.name}`;
			const tagFields = ['label', 'description', 'value', 'unit'] as const;
			tagFields.forEach((field) => {
				const optionStr = `${base}.${field}`;
				const tagFieldId = tag[field].id;
				map.set(optionStr, tagFieldId);
			});
		});

		return map;
	});

	const updateTagValue = (id: string, value: string) => {
		const tag = tags.value.find((t) => t.id === id);
		if (tag) {
			tag.value.value = value;
		}
	};

	const addTags = (newTags: MeasurementType[]) => {
		tags.value.push(...newTags);
	};

	const removeTags = (tagIds: string[]) => {
		tags.value = tags.value.filter((t) => !tagIds.includes(t.id));
	};

	const clear = () => {
		tags.value = [];
	};

	return {
		tags,
		tagOptions,
		updateTagValue,
		addTags,
		tagMap,
		removeTags,
		clear
	};
});
