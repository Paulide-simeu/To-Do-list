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
VALIDATION TITRE
==========================
*/
export function validateTitle(title) {

    return (
        title.length >= 3 &&
        title.length <= 50
    );
}

/*
==========================
VALIDATION DESCRIPTION
==========================
*/
export function validateDescription(description) {

    return description.length <= 200;
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

    /*
    DESCRIPTION
    */
    if (
        data.description.length > 200
    ) {

        errors.description =
            "Maximum 200 caractères";
    }

    /*
    DATE
    */
    if (data.dueDate) {

        const selectedDate =
            new Date(data.dueDate);

        const today = new Date();

        today.setHours(0,0,0,0);

        if (selectedDate < today) {

            errors.dueDate =
                "Date invalide";
        }
    }

    return errors;
}