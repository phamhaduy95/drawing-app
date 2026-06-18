import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSimulation = defineStore('simulation', () => {
	const mode = ref<'design' | 'simulation'>('design');
	const status = ref<'RUN' | 'STOP' | 'PAUSE'>('STOP');

	const setMode = (newMode: 'design' | 'simulation') => {
		mode.value = newMode;
	};

	const setStatus = (newStatus: 'RUN' | 'STOP' | 'PAUSE') => {
		status.value = newStatus;
	};

	return {
		mode,
		status,
		setMode,
		setStatus
	};
});
