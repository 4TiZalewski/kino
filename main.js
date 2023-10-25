// @ts-check

/**
 * @type {NodeListOf<HTMLButtonElement>} buttons
 */
const buttons = document.querySelectorAll("button:not(#create)");
/**
 * @type {HTMLButtonElement | null} create_button
 */
const create_button = document.querySelector("#create");
/**
 * @type {HTMLInputElement | null} miejsca
 */
const miejsca = document.querySelector("#miejsca");
/**
 * @type {HTMLInputElement | null} miejsca_na_rzad
 */
const miejsca_na_rzad = document.querySelector("#miejsca");
/**
 * @type {Element | null} cinema_display
 */
const cinema_display = document.querySelector(".cinema");

if (create_button && miejsca && miejsca_na_rzad && cinema_display) {
    create_button.addEventListener("click", function(event) {
        event.preventDefault();
        /**
         * @type {number} ilosc_miejsc
         */
        const ilosc_miejsc = Number(miejsca.value);
        /**
         * @type {number} ilosc_miejsc_na_rzad
         */
        const ilosc_miejsc_na_rzad = Number(miejsca_na_rzad.value);
        /**
         * @type {number} columns
         */
        const columns = Math.floor(ilosc_miejsc / ilosc_miejsc_na_rzad);
        const next_row = ilosc_miejsc % ilosc_miejsc_na_rzad == 0;

        for(let column = 1; column <= columns; column++) {
            for (let row = 1; row <= ilosc_miejsc_na_rzad; row++) {
                // TODO: end it
            }
        }
    });
}

/**
 * @type {HTMLButtonElement} element
 */
buttons.forEach((element) => {

    format_button(element);

    /**
     * @type {MouseEvent} event
     */
    element.addEventListener("click", function(event) {
        event.preventDefault();

        /**
         * @type {EventTarget | null} button
         */
        const event_target = event.target;
        if (event_target == null) {
            return;
        }

        const button = /** @type {HTMLButtonElement} */ (event_target);
        format_button(button);
    });
});

/**
 * @param {HTMLButtonElement} button 
 */
function format_button(button) {
    /**
     * @type {number} button_value
     */
    const button_value = Number(button.value);

    switch(button_value) {
        case 0:
            button.style.backgroundColor = "green";
            button.value = "1";
            break;
        case 1:
            button.style.backgroundColor = "red";
            button.value = "0";
            break;
        case 2:
            button.style.backgroundColor = "gray";
            break;
        default:
            console.error(`Invalid button value!: "${button_value}"`)
    }
}