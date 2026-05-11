/*
==========================
SAUVEGARDE
==========================
*/
export function saveTasks(tasks) {

    try {

        localStorage.setItem(
            "tasks",
            JSON.stringify(tasks)
        );

    } catch (error) {

        console.error(
            "Erreur sauvegarde localStorage :",
            error
        );

    }
}

/*
==========================
CHARGEMENT
==========================
*/
export function loadTasks() {

    try {

        const data =
            localStorage.getItem("tasks");

        return data
            ? JSON.parse(data)
            : [];

    } catch (error) {

        console.error(
            "Erreur chargement localStorage :",
            error
        );

        return [];
    }
}

/*
==========================
SUPPRESSION
==========================
*/
export function clearTasks() {

    localStorage.removeItem("tasks");
}