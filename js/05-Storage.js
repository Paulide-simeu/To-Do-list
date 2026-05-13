/*
==========================
STORAGE KEY
==========================
*/
const STORAGE_KEY = "tasks";

/*
==========================
SAUVEGARDE
==========================
*/
export function saveTasks(tasks) {

    try {

        localStorage.setItem(
            STORAGE_KEY,
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
            localStorage.getItem(
                STORAGE_KEY
            );

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

    localStorage.removeItem(
        STORAGE_KEY
    );
}