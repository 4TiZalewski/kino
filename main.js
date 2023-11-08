// @ts-check

/**
 * @type {HTMLButtonElement | null}
 */
const create_button = document.querySelector("#create");
/**
 * @type {HTMLInputElement | null}
 */
const miejsca = document.querySelector("#miejsca");
/**
 * @type {HTMLInputElement | null}
 */
const miejsca_na_rzad = document.querySelector("#miejsca-na-rzad");
/**
 * @type {HTMLElement | null}
 */
const cinema_display = document.querySelector(".cinema");
/**
 * @type {HTMLButtonElement | null}
 */
const reserve_button = document.querySelector("#reserve");

if (create_button && miejsca && miejsca_na_rzad && cinema_display) {
    create_button.addEventListener("click", function(event) {
        event.preventDefault();

        /**
         * @type {number}
         */
        const ilosc_miejsc = Number(miejsca.value);
        /**
         * @type {number}
         */
        const ilosc_miejsc_na_rzad = Number(miejsca_na_rzad.value);

        while (cinema_display.firstChild) {
            cinema_display.removeChild(cinema_display.firstChild);
        }

        if (
            ilosc_miejsc > 1 &&
            ilosc_miejsc < 1000 &&
            ilosc_miejsc_na_rzad > 1 &&
            ilosc_miejsc_na_rzad < 100
        ) {
            /**
             * @type {number}
             */
            const columns = Math.floor(ilosc_miejsc / ilosc_miejsc_na_rzad);
            /**
             * @type {boolean}
             */
            const next_row = !(ilosc_miejsc % ilosc_miejsc_na_rzad == 0);
            /**
             * @type {number}
             */
            let seat_number = 1;

            for(let column = 1; column <= columns; column++) {
                create_seat_row(seat_number, column, ilosc_miejsc_na_rzad, cinema_display);
                seat_number += ilosc_miejsc_na_rzad;
            }

            if (next_row) {
                const additional_seats = ilosc_miejsc % ilosc_miejsc_na_rzad;
                seat_number = ilosc_miejsc - additional_seats + 1;
                create_seat_row(seat_number, columns + 1, additional_seats, cinema_display);
            }
        } else {
            // Ojojoj
            alert("Za dużo!");
        }

        configure_price();
        refresh_cinema();
    });
}

if (reserve_button) {
    reserve_button.addEventListener("click", function(/** @type {Event} */ event) {
        event.preventDefault();

        const reserved_seats = count_reserved_seats();
        configure_price(reserved_seats);
    });
}

refresh_cinema();



/**
 * @param {number} reserved_seats 
 */
function configure_price(reserved_seats = 0) {
    /**
     * @type {HTMLHeadingElement | null}
     */
    const price_text = document.querySelector(".cena");
    /**
     * @type {HTMLDivElement | null}
     */
    const price_wrapper = document.querySelector(".cena-wrapper");
    /**
     * @type {HTMLInputElement | null}
     */
    const current_price_element = document.querySelector("#price-setting");

    if (price_wrapper && price_text && current_price_element) {
        if (reserved_seats > 0) {
            price_wrapper.style.display = "block";

            /**
             * @type {number}
             */
            let current_price = Number(current_price_element.value);

            if (isNaN(current_price)) {
                current_price = 0;
            }

            /**
             * @type {number}
             */
            const final_price = reserved_seats * current_price;

            price_text.innerText = `${final_price}`;
            return;
        }

        price_wrapper.style.display = "none";
    }
}

/**
 * @returns {number}
 */
function count_reserved_seats() {
    /**
     * @type {NodeListOf<HTMLButtonElement>}
     */
    const buttons = document.querySelectorAll(".seat");
    let seat_reserved = 0;
    buttons.forEach((/** @type {ChildNode} */ element) => {
        if (element instanceof HTMLButtonElement) {
            const button = /** @type {HTMLButtonElement} */ (element);
            if (button.value === "0") {
                format_button(button, 2);
                seat_reserved += 1;
            }
        }
    });

    return seat_reserved;
}

/**
 * @param {HTMLButtonElement} button 
 */
function register_seat_callback(button) {
    button.addEventListener("click", function(/** @type {MouseEvent} */ event) {
        event.preventDefault();

        /**
         * @type {EventTarget | null}
         */
        const event_target = event.target;
        if (event_target == null) {
            return;
        }

        const button = /** @type {HTMLButtonElement} */ (event_target);
        click_button(button);
    });
}

/**
 * @param {HTMLButtonElement} button 
 */
function click_button(button) {
    /**
     * @type {number}
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
            console.error(`Invalid button value!: "${button_value}"`);
    }
}

/**
 * @param {HTMLButtonElement} button 
 * @param {number} mode
 */
function format_button(button, mode) {
    button.style.width = "2.5rem";
    switch(mode) {
        case 0:
            button.style.backgroundColor = "red";
            button.value = "0";
            break;
        case 1:
            button.style.backgroundColor = "green";
            button.value = "1";
            break;
        case 2:
            button.style.backgroundColor = "gray";
            button.value = "2";
            break;
        default:
            console.error(`Invalid button value!: "${mode}"`);
    }
}

/**
 * @param {number} seat_number_start 
 * @param {number} row_number 
 * @param {number} number_of_seats 
 * @param {Element} parent
 */
function create_seat_row(seat_number_start, row_number, number_of_seats, parent) {
    /**
     * @type {HTMLDivElement}
     */
    const row_item = document.createElement("div");

    /**
     * @type {HTMLHeadElement}
     */
    const row_number_indicator = document.createElement("h4");
    row_number_indicator.className = "row-indicator";
    row_number_indicator.innerText = `${row_number}`;
    row_item.appendChild(row_number_indicator);
    
    /**
     * @type {number}
     */
    let seat_number = seat_number_start;

    for (let row = 1; row <= number_of_seats; row++) {
        /**
         * @type {HTMLButtonElement}
         */
        const button = document.createElement("button");
        button.className = "seat";
        button.innerText = `${seat_number}`;

        format_button(button, 1);
        register_seat_callback(button);

        row_item.appendChild(button);
        seat_number += 1;
    }

    parent.appendChild(row_item);
}

function refresh_cinema() {
    /**
     * @type {NodeListOf<HTMLButtonElement>}
     */
    const seats = document.querySelectorAll(".seat");
    /**
     * @type {HTMLDivElement | null}
     */
    const cinema_wrapper = document.querySelector(".cinema-wrapper");

    if (cinema_wrapper) {
        if (
            seats.length < 1
        ) {
            cinema_wrapper.style.display = "none";
        } else {
            cinema_wrapper.style.display = "flex";
        }
    }
}