/*
==========================
DATE MINIMUM
==========================
*/
export function setMinDate() {

    const today =
        new Date()
        .toISOString()
        .split("T")[0];

    document
        .getElementById("dueDate")
        .setAttribute("min", today);
}

/*
==========================
VALIDATION FORMULAIRE
==========================
*/
export function validateForm(data) {

    const errors = {};

    /*
    TITLE
    */
    if (
        !data.title ||
        data.title.trim().length < 3
    ) {

        errors.title =
            "Minimum 3 caractères";
    }

    if (
        data.title &&
        data.title.trim().length > 50
    ) {

        errors.title =
            "Maximum 50 caractères";
    }

    /*
    DESCRIPTION
    */
    if (
        data.description &&
        data.description.length > 200
    ) {

        errors.description =
            "Maximum 200 caractères";
    }

    /*
    CATEGORY
    */
    if (!data.category) {

        errors.category =
            "Catégorie obligatoire";
    }

    /*
    PRIORITY
    */
    if (!data.priority) {

        errors.priority =
            "Priorité obligatoire";
    }

    /*
    DATE
    */
    if (data.dueDate) {

        const selectedDate =
            new Date(data.dueDate);

        const today =
            new Date();

        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {

            errors.dueDate =
                "Date invalide";
        }
    }

    return errors;
}