import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useTagsStore } from './useTagsStore';

export const useSimulation = defineStore('simulation', () => {
	const mode = ref<'design' | 'simulation'>('design');
	const status = ref<'RUN' | 'STOP' | 'PAUSE'>('STOP');
	const progress = ref(0);

	const tagsStore = useTagsStore();
	let simulationTimer: number | null = null;

	const setMode = (newMode: 'design' | 'simulation') => {
		mode.value = newMode;
		if (newMode === 'design') {
			setStatus('STOP');
		}
	};

	const clearTimer = () => {
		if (simulationTimer !== null) {
			window.clearInterval(simulationTimer);
			simulationTimer = null;
		}
	};

	const handlers = {
		RUN: () => {
			if (simulationTimer !== null) return;
			simulationTimer = window.setInterval(() => {
				progress.value = progress.value >= 100 ? 0 : progress.value + 1;
				const currentTimestamp = new Date().toISOString();
				tagsStore.tags.forEach((tag) => {
					tag.value.value = progress.value.toString();
					tag.value.timestamp = currentTimestamp;

					const rand = Math.random();
					tag.value.quality = rand < 0.6 ? 'Good' : rand < 0.9 ? 'Medium' : 'Bad';
				});
			}, 1000);
		},
		STOP: () => {
			clearTimer();
			progress.value = 0;
			const currentTimestamp = new Date().toISOString();
			tagsStore.tags.forEach((tag) => {
				tag.value.value = '0';
				tag.value.timestamp = currentTimestamp;
				tag.value.quality = 'Good';
			});
		},
		PAUSE: () => {
			clearTimer();
		}
	};

	const setStatus = (newStatus: 'RUN' | 'STOP' | 'PAUSE') => {
		status.value = newStatus;
		handlers[newStatus]?.();
	};

	return {
		mode,
		status,
		progress,
		setMode,
		setStatus
	};
});
