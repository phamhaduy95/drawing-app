import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { MeasurementType } from '@/modules/designer/types/Tag.type';
import { defaultTags } from '@/modules/designer/constant/defaultTags';

export const useTagsStore = defineStore('tags', () => {
	const tags = ref<MeasurementType[]>(defaultTags);

	const updateTagValue = (id: string, value: string) => {
		const tag = tags.value.find((t) => t.id === id);
		if (tag) {
			tag.value.value = value;
		}
	};

	return {
		tags,
		updateTagValue
	};
});
