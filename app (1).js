
const { createApp, ref, computed, onMounted, watch, nextTick } = Vue;

// Translation dictionary (simplified for brevity)
const translations = {
    en: {
        appTitle: "Dailynest:Your personal Task Manager",
        dashboard: "Dashboard",
        analytics: "Analytics",
        settings: "Settings",
        activeTasks: "Active Tasks",
        completed: "Completed",
        overdue: "Overdue",
        productivity: "Productivity",
        addTask: "Add Task",
        edit: "Edit",
        delete: "Delete",
        startTimer: "Start Timer",
        // ... truncated for brevity ...
    }
};

createApp({
    setup() {
        const currentPage = ref('dashboard');
        const darkMode = ref(true);
        const showTaskModal = ref(false);
        const editingTask = ref(null);
        const tasks = ref(JSON.parse(localStorage.getItem('tasks')) || []);

        const currentTask = ref({
            title: { en: '', hi: '', sa: '' },
            description: { en: '', hi: '', sa: '' },
            priority: 'MEDIUM',
            category: 'WORK',
            dueDate: '',
            estimatedTime: 1,
            completed: false,
            timeSpent: 0,
            createdAt: new Date().toISOString()
        });

        const timerTime = ref(1500);
        const timerActive = ref(false);
        const timerMode = ref('work');
        const timerPreset = ref('pomodoro');
        const timerProgress = computed(() => {
            const total = timerMode.value === 'work' ? 1500 : 300;
            return 100 - (timerTime.value / total * 100);
        });

        const analyticsPeriod = ref('week');
        const analyticsCategory = ref('all');
        const analyticsPriority = ref('all');

        const defaultPriority = ref('MEDIUM');
        const enableAI = ref(true);
        const enableNotifications = ref(true);
        const enableTimeTracking = ref(true);

        const themeColors = ref([
            { name: { en: 'Blue' }, bg: '#191970', text: 'white' },
            { name: { en: 'Black' }, bg: 'black', text: 'white' }
        ]);
        const selectedColor = ref(themeColors.value[0]);

        const aiSuggestions = ref([]);

        const filteredTasks = computed(() => {
            return [...tasks.value].sort((a, b) => a.completed - b.completed);
        });

        const changePage = (page) => currentPage.value = page;
        const toggleDarkMode = () => {
            darkMode.value = !darkMode.value;
            document.body.classList.toggle('light-mode', !darkMode.value);
            saveSettings();
        };

        const saveSettings = () => {
            localStorage.setItem('settings', JSON.stringify({
                darkMode: darkMode.value,
                defaultPriority: defaultPriority.value,
                enableAI: enableAI.value,
                enableNotifications: enableNotifications.value,
                enableTimeTracking: enableTimeTracking.value,
                themeColor: selectedColor.value
            }));
        };

        const addTask = () => {
            currentTask.value.createdAt = new Date().toISOString();
            tasks.value.push({ ...currentTask.value });
            currentTask.value = JSON.parse(JSON.stringify(currentTask.value));
            showTaskModal.value = false;
        };

        const editTask = (task) => {
            currentTask.value = JSON.parse(JSON.stringify(task));
            editingTask.value = task;
            showTaskModal.value = true;
        };

        const updateTask = () => {
            Object.assign(editingTask.value, currentTask.value);
            showTaskModal.value = false;
        };

        const deleteTask = (task) => {
            const index = tasks.value.indexOf(task);
            if (index > -1) tasks.value.splice(index, 1);
        };

        const closeTaskModal = () => {
            showTaskModal.value = false;
        };

        const currentLanguage = ref(localStorage.getItem('language') || 'en');
        const t = (key) => translations[currentLanguage.value][key] || key;
        const saveLanguage = () => localStorage.setItem('language', currentLanguage.value);

        onMounted(() => {
            const savedSettings = JSON.parse(localStorage.getItem('settings'));
            if (savedSettings) {
                darkMode.value = savedSettings.darkMode;
                defaultPriority.value = savedSettings.defaultPriority || 'MEDIUM';
                enableAI.value = savedSettings.enableAI !== false;
                enableNotifications.value = savedSettings.enableNotifications !== false;
                enableTimeTracking.value = savedSettings.enableTimeTracking !== false;
                selectedColor.value = savedSettings.themeColor || themeColors.value[0];
            }

            document.body.classList.toggle('light-mode', !darkMode.value);
        });

        watch(tasks, () => {
            localStorage.setItem('tasks', JSON.stringify(tasks.value));
        }, { deep: true });

        return {
            currentPage, darkMode, showTaskModal, editingTask, tasks, currentTask,
            timerTime, timerActive, timerMode, timerPreset, timerProgress,
            defaultPriority, enableAI, enableNotifications, enableTimeTracking,
            themeColors, selectedColor, aiSuggestions, analyticsPeriod, analyticsCategory, analyticsPriority,
            filteredTasks, changePage, toggleDarkMode,
            addTask, editTask, updateTask, deleteTask, closeTaskModal,
            currentLanguage, t, saveLanguage
        };
    }
}).mount('#app');
